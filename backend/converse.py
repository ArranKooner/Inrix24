import boto3
from botocore.exceptions import ClientError
import os
from dotenv import load_dotenv
from flask import Flask, request
import serpNews
import redditscraper

load_dotenv()

app = Flask(__name__)
@app.route('/')

def model():
    # Put your AWS credentials in a .env file
    access_key_id = os.getenv("AWS_ACCESS_KEY")
    secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")

    bucket_name = "webscraping-data-2024"
    # Create an S3 client
    s3 = boto3.client(
        "s3", aws_access_key_id=access_key_id, aws_secret_access_key=secret_access_key
    )

    # Get company from request arguments
    company = request.args.get('company', 'netflix')

    # Calls the web scrapers
    serpNews.news(company)
    redditscraper.redditscraper(company)

    # Paths of the files in S3

    # the raw data is from news, reddit is processed data
    raw_data_key = f"{company}/raw-data/2024-11-16.json"
    processed_data_key = f"{company}/processed-data/2024-11-16/{company}.json"

    # Read news data from S3
    try:
        raw_data_object = s3.get_object(Bucket=bucket_name, Key=raw_data_key)
        raw_data = raw_data_object['Body'].read().decode('utf-8')
    except ClientError as e:
        print(f"Error fetching raw data: {e}")
        raw_data = ""

    # Read reddit data from S3
    try:
        processed_data_object = s3.get_object(Bucket=bucket_name, Key=processed_data_key)
        processed_data = processed_data_object['Body'].read().decode('utf-8')
    except ClientError as e:
        print(f"Error fetching processed data: {e}")
        processed_data = ""

    # Initialize the Bedrock client
    client = boto3.client(
        service_name="bedrock-runtime",
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
        region_name="us-west-2",
    )

    # The model ID for the model you want to use
    model_id = "anthropic.claude-3-sonnet-20240229-v1:0"

    # Define different prompts for multiple AI calls
    prompts = [
        f"Analyze the public sentiment about {company}'s latest product based on this data: {raw_data}",
        f"Summarize the top three concerns about {company} from the provided data: {processed_data}",
        f"Identify the most viral news and Reddit posts about {company} and their impact: {raw_data + processed_data}",
    ]

    # Perform multiple AI calls and store responses in variables
    outputs = []
    for prompt in prompts:
        conversation = [
            {
                "role": "user",
                "content": [{"text": prompt}],
            }
        ]

        try:
            streaming_response = client.converse_stream(
                modelId=model_id,
                messages=conversation,
                inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
            )

            # Extract and store the streamed response text
            output = ""
            for chunk in streaming_response["stream"]:
                if "contentBlockDelta" in chunk:
                    text = chunk["contentBlockDelta"]["delta"]["text"]
                    output += text
            outputs.append(output)
        except (ClientError, Exception) as e:
            print(f"ERROR: Can't invoke '{model_id}' for prompt '{prompt}'. Reason: {e}")
            outputs.append(f"Error for prompt: {prompt}")

    # Print or return the outputs
    for i, output in enumerate(outputs):
        print(f"Response {i + 1}:\n{output}\n")
    return outputs


if __name__ == "__main__":
    model()


  
# def model():

#     # Put your AWS credentials in a .env file
#     access_key_id = os.getenv("AWS_ACCESS_KEY")
#     secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
    

#     bucket_name = "webscraping-data-2024"
#     # Create an S3 client
#     s3 = boto3.client(
#         "s3", aws_access_key_id=access_key_id, aws_secret_access_key=secret_access_key
#     )

#     # List all objects in the bucket
#     # response = s3.list_objects(Bucket=bucket_name)

#     # # Print the object details
#     # print("Objects in the bucket:")
#     # for obj in response.get("Contents", []):
#     #     print(f"- {obj['Key']} (Last modified: {obj['LastModified']})")

#     company = request.args['company']
#     if 'company' in request.args:
#         company = request.args['company']
#     else:
#         company = 'netflix'  
    
#     # calls the web scrapers
#     serpNews.news(company)
#     redditscraper.redditscraper(company)
    
#     # Path of the file in S3
#     # getting the data from the scrapers

#     #get data from the news jsons
#     object_key = company+"/raw-data/2024-11-16.json"
#     local_file_path = "./someFile.txt"

#     # # Download the object from S3
#     s3.download_file(bucket_name, object_key, local_file_path)
#     # with open('./someFile.txt', 'r') as file:
#     #     data = file.read()
#     #     print(data)

#     s3_object = s3.get_object(Bucket=bucket_name, Key=object_key)
#     data = s3_object['Body'].read().decode('utf-8')

#     #print(f"Object '{object_key}' downloaded to '{local_file_path}'")
#     client = boto3.client(
#         service_name="bedrock-runtime",
#         aws_access_key_id=access_key_id,
#         aws_secret_access_key=secret_access_key,
#         region_name="us-west-2",
#     )

#     #get the data from the reddit jsons
#     object_key = company+"/processed-data/2024-11-16.json"
#     object_key = company+"/processed-data/2024-11-16/"+company+".json"
#     local_file_path = "./someFile2.txt"

#     # # Download the object from S3
#     s3.download_file(bucket_name, object_key, local_file_path)
#     # with open('./someFile.txt', 'r') as file:
#     #     data = file.read()
#     #     print(data)

#     s3_object = s3.get_object(Bucket=bucket_name, Key=object_key)
#     data += s3_object['Body'].read().decode('utf-8')

#     # The model ID for the model you want to use
#     model_id = "anthropic.claude-3-sonnet-20240229-v1:0"

#     # The message you want to send to the model
#     user_message = "read this data and give me feedback for this"+company+"'s business model based on the data provided. Get the most viral news and reddit posts about that company. find out how the public is perceiving their most recent product. also name the top three general social media concerns or praises. :" + data

#     conversation = [
#         {
#             "role": "user",
#             "content": [{"text": user_message}],
#         }
#     ]
    

#     try:
#         streaming_response = client.converse_stream(
#             modelId=model_id,
#             messages=conversation,
#             inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
#         )

#         # Extract and print the streamed response text in real-time.
#         output = ""
#         for chunk in streaming_response["stream"]:
#             if "contentBlockDelta" in chunk:
#                 text = chunk["contentBlockDelta"]["delta"]["text"]
#                 print(text, end="")
#                 output += text
#         return output

#     except (ClientError, Exception) as e:
#         print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
#         exit(1)
        
# if __name__ == "__main__":
#     model()