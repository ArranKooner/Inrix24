# SerpAPI Google Trends API - Compared Breakdown by Region
# Must input multiple values, seperated by a comma
import os
import io
from flask import Flask, request
import json
from serpapi.google_search import GoogleSearch
import boto3
from datetime import datetime
from dotenv import load_dotenv

# user must input at least two names, seperated by commas
load_dotenv()
def gsearch(inputName):
    print(f"searching for: {inputName}")
    params = {
    "engine": "google_trends",
    "q": inputName,
    "region": "COUNTRY",
    "data_type": "GEO_MAP",
    "api_key":os.getenv("E_API_KEY")
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

def serpCompare(inp):
    #inp = input("input two or more names, seperated by commas\n")

    # proccess data
    search_string = "United States"
    result_data = [item for item in gsearch(inp) if item.get("location") == search_string]
    output_data = []
    for item in result_data:
        location = item.get("location")
        values = item.get("values", [])
        
        # Iterate through the list of values
        for value in values:
            # Extract the "query" and "value" fields
            query = value.get("query")
            extracted_value = value.get("value")

            # Append a new object with "location", "query", and "value"
            output_data.append({
                "location": location,
                "query": query,
                "value": extracted_value
            })

    # Convert the new array to a JSON string for pretty printing
    output_json = json.dumps(output_data, indent=4)
    #print(output_json)

if __name__ == "__main__":
    serpCompare("tesla")
