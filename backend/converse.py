import boto3
from botocore.exceptions import ClientError
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import serpNews
import redditscraper
import serpInterest
import serpCompare

load_dotenv()

def rank_us_companies(comp_data):
    us_data = next((entry for entry in comp_data if entry["geo"] == "US"), None)
    
    if not us_data:
        return "No data found for the United States."
    
    ranked_companies = sorted(us_data["values"], key=lambda x: x["extracted_value"], reverse=True)
    
    # Separate company names and their corresponding values
    company_names = [company["query"] for company in ranked_companies]
    company_values = [company["extracted_value"] for company in ranked_companies]
    
    return company_names, company_values

app = Flask(__name__)
CORS(app)
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
    
    #get the competitors
    company = request.args.get('company', 'netflix')
    # Initialize Bedrock client
    client = boto3.client(
        service_name="bedrock-runtime",
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
        region_name="us-west-2",
    )
    model_id = "anthropic.claude-3-sonnet-20240229-v1:0"

    #get the competitors
    company = request.args.get('company', 'netflix')
    # Initialize Bedrock client
    client = boto3.client(
        service_name="bedrock-runtime",
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
        region_name="us-west-2",
    )
    user_message = "give me the top 5 competitors of this provided company. But format it with no spaces so its company,competitor1,competitor2,competittor3 " + company
    conversation = [
    {
        "role": "user",
        "content": [{"text": user_message}],
    }
    ]
    try:
        streaming_response = client.converse_stream(
            modelId=model_id,
            messages=conversation,
            inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
        )

        # Extract and print the streamed response text in real-time.
        company_competitors = ""
        for chunk in streaming_response["stream"]:
            if "contentBlockDelta" in chunk:
                text = chunk["contentBlockDelta"]["delta"]["text"]
                company_competitors+=text

    except (ClientError, Exception) as e:
        print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
        exit(1)
    print("the company string "+company_competitors)
    
    # Calls the web scrapers
    serpNews.news(company)
    redditscraper.redditscraper(company)
    serpInterest.serpInterest(company)
    serpCompare.serpCompare(company_competitors)
    


    raw_data_key = f"{company}/raw-data/2024-11-17.json"
    processed_data_key = f"{company}/processed-data/2024-11-17/{company}.json"
    top_locs_data_key = f"{company}/raw-data/2024-11-17.json"
    comp_data_key = f"{company_competitors}/raw-data/2024-11-17.json"


    def fetch_data(key):
        """Fetch data from S3 and return content."""
        try:
            s3_object = s3.get_object(Bucket=bucket_name, Key=key)
            data = s3_object['Body'].read().decode('utf-8')
            if debug_mode:
                logging.info(f"Fetched data for key {key}")  # Log first 200 chars
            return json.loads(data)
        except ClientError as e:
            if debug_mode:
                logging.error(f"Error fetching data from {key}: {e}")
            return {}

    # Fetch data from S3
    raw_data = fetch_data(raw_data_key)
    processed_data = fetch_data(processed_data_key)
    tops_locs_data = fetch_data(top_locs_data_key)
    comps_data = fetch_data(comp_data_key)


    # Initialize Bedrock client
    client = boto3.client(
        service_name="bedrock-runtime",
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
        region_name="us-west-2",
    )

    outputs = []

        #ARRANSAMHITA
    company_names, company_values = rank_us_companies(comps_data)
    outputs.append(company_names)
    outputs.append(company_values)
    
    # Sort the data based on "extracted_value" in descending order
    sorted_data = sorted(tops_locs_data, key=lambda x: x["extracted_value"], reverse=True)

    # Select the top five and lowest three states
    top_five = sorted_data[:5]
    lowest_three = sorted_data[-3:]

    # Combine both lists (top five and lowest three)
    combined_states = [entry["location"] for entry in top_five + lowest_three]
    combined_values = [entry["extracted_value"] for entry in top_five + lowest_three]

    # Print the results
    print("Combined States:", combined_states)
    print("Combined Values:", combined_values)
    
    
    #sorted_data = sorted(tops_locs_data, key=lambda x: x["extracted_value"], reverse=True)
    #top_five = sorted_data[:5]
    #lowest_three = sorted_data[-3:]
    #top_five_states = [(entry["location"], entry["extracted_value"]) for entry in top_five]
    #lowest_three_states = [(entry["location"], entry["extracted_value"]) for entry in lowest_three]
    #print("Top Five States:", top_five_states)
    #print("Lowest Three States:", lowest_three_states)
    
    outputs.append(combined_states)
    outputs.append(combined_values)
    
    
    prompts = [
        f"Give three percentages that total to 100 of the positive, negative, and neutral feedback in this format with only integers: percent positive, percent negative, percent neutral: {raw_data}",
        f"Summarize the top three concerns about {company} from the provided data. no other text but the concerns.: {processed_data}",
        f"Identify the most viral news and Reddit posts about {company} and their impact. no other text but the news and reddit posts: {raw_data + processed_data}",
    ]
    
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
    
    
    for i, output in enumerate(outputs):
        print(f"\n==== Response {i + 1} ====")
        print(output)
        
    

    # Return the outputs in a response-friendly format (if using Flask)
    return jsonify({"outputs": outputs})


if __name__ == "__main__":
    model()
