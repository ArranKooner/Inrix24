# SerpAPI Google Trends API - Compared Breakdown by Region
# Must input multiple values, seperated by a comma
import os
import io
from flask import Flask, request
import json
from serpapi.google_search import GoogleSearch
import boto3
from datetime import datetime

# user must input at least two names, seperated by commas

def search(inputName):
    print(f"searching for: {inputName}")
    params = {
    "engine": "google_trends",
    "q": inputName,
    "geo": "US",
    "region": "REGION",
    "data_type": "GEO_MAP",
    "api_key": os.getenv("API_KEY")
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    compared_breakdown_by_region = results["compared_breakdown_by_region"]

    upload(compared_breakdown_by_region, inputName)
    return compared_breakdown_by_region

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

inp = input("Please input two or more names, seperated by commas\n")
search(inp) 
