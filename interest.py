# SerpAPI Google Trends API - Interest by Region
# Input one name
import os
import io
import json
from serpapi.google_search import GoogleSearch
import boto3
from datetime import datetime

def search(inputName):
    print(f"searching for: {inputName}")
    params = {
    "engine": "google_trends",
    "q": inputName,
    "data_type": "GEO_MAP_0",
    "geo": "US",
    "region": "REGION", #should users decide if they want to do COUNTRY, REGION (subregion), DMA (metro), or CITY?
    "api_key": os.getenv("API_KEY")
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

inp = input("Please input one name\n")
search(inp) 
