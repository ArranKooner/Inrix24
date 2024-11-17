# SerpAPI Google Trends API - Interest by Region
# Input one name
import os
import io
import json
from serpapi.google_search import GoogleSearch
import boto3
from datetime import datetime
import numpy as np
from dotenv import load_dotenv

load_dotenv()

def search(inputName):
    print(f"searching for: {inputName}")
    params = {
    "engine": "google_trends",
    "q": inputName,
    "data_type": "GEO_MAP_0",
    "geo": "US",
    "region": "REGION", 
    "api_key": os.getenv("E_API_KEY")
    }
    
    search = GoogleSearch(params)
    results = search.get_dict()
    interest_by_region = results["interest_by_region"]
    upload(interest_by_region, inputName)
    return interest_by_region

# add to s3
def upload(outJSON, inputName):
    s3 = boto3.client("s3",aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"))   
    current_date = datetime.now().strftime("%Y-%m-%d")
    bucket_name = "webscraping-data-2024"
    s3_key = f"{inputName}/raw-data/{current_date}.json"

    json_data = json.dumps(outJSON, indent=4)
    json_buffer = io.StringIO()
    json_buffer.write(json_data)
    json_buffer.seek(0)

    s3.put_object(
        Bucket=bucket_name,
        Key=s3_key,
        Body=json_buffer.getvalue(),
        ContentType="application/json"
    )
    print(f"JSON uploaded to S3: {bucket_name}/{s3_key}")

def serpInterest(inp):

#inp = input("input one name\n")
# process data
    #inp = "hi"
    temp = search(inp) 
    output_data = [{'State': item["location"], 'Score': item["extracted_value"], "Category": 0} for item in temp] # Create a new array with only State and Score
    output_json = json.dumps(output_data, indent=4) # Convert the new array to a JSON string
    #print(output_json)

    sorted_data = sorted(temp, key=lambda x: x['extracted_value'], reverse=True)

    # Get the top 5 and bottom 5 objects
    top_5 = sorted_data[:5]
    bottom_3 = sorted_data[-3:]

    top5_temp = json.dumps(top_5, indent=4)


    #output_top5 = [{'State': item.get('location'), 'Score': item.get('extracted_value')} for item in top5_temp]
    #top5_json = json.dumps(output_top5, indent=4) # Convert the new array to a JSON string
    #print("\ntop")
    #print(top5_temp)

    bottom3_temp = json.dumps(bottom_3, indent=4)
    #output_bottom3 = [{"State": item["location"], "Score": item["extracted_value"]} for item in bottom3_temp]
    #bottom3_json = json.dumps(output_bottom3, indent=4) # Convert the new array to a JSON string
    #print("\nbottom")
    #print(bottom3_temp)

    # score them
    # Extract the scores
    scores = [item['extracted_value'] for item in temp]

    # Calculate percentiles
    q10 = np.percentile(scores, 10) # 10th
    q25 = np.percentile(scores, 25)  # 25th percentile
    q75 = np.percentile(scores, 75)  # 75th percentile
    q95 = np.percentile(scores, 95)  # 95th percentile
    # Function to categorize the score
    def categorize(score):
        if score == 0:
            return 0
        elif score >= q95:
            return 5
        elif score >= q75:
            return 4
        elif score >= q25:
            return 3
        elif score >= q10:
            return 2
        else:
            return 1

    # Create a new array with categories that rank the search frequency
    #output_data_cat = [{"State": item["location"], "Score": item["extracted_value"], "Category": categorize(item["extracted_value"])} for item in temp]
    #output_json_cat = json.dumps(output_data_cat, indent=4)

if __name__ == "__main__":
    serpInterest("hi")
