import boto3
from botocore.exceptions import ClientError
import os
from dotenv import load_dotenv
from flask import Flask, request
import serpNews
import redditscraper
import serpInterest

load_dotenv()

app = Flask(__name__)
@app.route('/')

def model():
    import json
    import logging

    # Enable logging only for debug mode
    debug_mode = False

    # Load AWS credentials
    access_key_id = os.getenv("AWS_ACCESS_KEY")
    secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")

    bucket_name = "webscraping-data-2024"
    s3 = boto3.client(
        "s3", aws_access_key_id=access_key_id, aws_secret_access_key=secret_access_key
    )

    # Get company from request arguments
    company = request.args.get('company', 'netflix')

    # Calls the web scrapers
    serpNews.news(company)
    redditscraper.redditscraper(company)
    serpInterest.serpInterest(company)

    # S3 keys
    raw_data_key = f"{company}/raw-data/2024-11-16.json"
    processed_data_key = f"{company}/processed-data/2024-11-16/{company}.json"
    top_locs_data_key = f"{company}/raw-data/2024-11-16.json"

    def fetch_data(key):
        """Fetch data from S3 and return content."""
        try:
            s3_object = s3.get_object(Bucket=bucket_name, Key=key)
            data = s3_object['Body'].read().decode('utf-8')
            if debug_mode:
                logging.info(f"Fetched data for key {key}: {data[:200]}...")  # Log first 200 chars
            return json.loads(data)
        except ClientError as e:
            if debug_mode:
                logging.error(f"Error fetching data from {key}: {e}")
            return {}

    # Fetch data from S3
    raw_data = fetch_data(raw_data_key)
    processed_data = fetch_data(processed_data_key)
    tops_locs_data = fetch_data(top_locs_data_key)

    # Initialize Bedrock client
    client = boto3.client(
        service_name="bedrock-runtime",
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
        region_name="us-west-2",
    )

    model_id = "anthropic.claude-3-sonnet-20240229-v1:0"
    prompts = [
        f"Analyze the public sentiment about {company}'s latest product based on this data: {raw_data}",
        f"Summarize the top three concerns about {company} from the provided data: {processed_data}",
        f"Identify the most viral news and Reddit posts about {company} and their impact: {raw_data + processed_data}",
        f"Output the five states where it's most popular and the three where it's not from this data: {tops_locs_data}",
    ]

    outputs = []
    for prompt in prompts:
        conversation = [{"role": "user", "content": [{"text": prompt}]}]
        try:
            streaming_response = client.converse_stream(
                modelId=model_id,
                messages=conversation,
                inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
            )

            output = ""
            for chunk in streaming_response["stream"]:
                if "contentBlockDelta" in chunk:
                    text = chunk["contentBlockDelta"]["delta"]["text"]
                    output += text
            outputs.append(output)
        except (ClientError, Exception) as e:
            if debug_mode:
                logging.error(f"ERROR: Can't invoke '{model_id}' for prompt '{prompt}'. Reason: {e}")
            outputs.append(f"Error for prompt: {prompt}")

    # for i, output in enumerate(outputs):
    #     if debug_mode:
    #         print(f"Response {i + 1}:\n{output}\n")
    # return outputs
    # Print final outputs to the console
    for i, output in enumerate(outputs):
        print(f"\n==== Response {i + 1} ====")
        print(output)

    # Return the outputs in a response-friendly format (if using Flask)
    return {"outputs": outputs}


if __name__ == "__main__":
    model()