import os
from serpapi import GoogleSearch
from flask import Flask, request
import boto3
from datetime import datetime
from dotenv import load_dotenv
import json
import io

load_dotenv()

def news(userInput):
    # Fetch API keys from environment variables
    API_KEY = os.getenv("SERPAPI_KEY")
    AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

    # Validate if the API keys are loaded
    if not API_KEY:
        raise ValueError("SERPAPI_KEY is missing. Check your .env file.")
    if not AWS_ACCESS_KEY or not AWS_SECRET_ACCESS_KEY:
        raise ValueError("AWS keys are missing. Check your .env file.")
    
    name = userInput

    params = {
      "engine": "google_news",
      "q": name,
      "gl": "us",
      "hl": "en",
      "api_key": {API_KEY},
      "output": "JSON"
    }

    search = GoogleSearch(params)
    results = search.get_dict()["news_results"]

    output = []

    for item in results:
        if "stories" in item:
            for story in item["stories"]:
                output.append({
                            "title": story.get("title", "No title"),
                            "source": story.get("source", {}).get("name", "Unknown source"),
                            "link": story.get("link", "No link"),
                            "date": story.get("date", "No date")
                        })
        else:
            #print(item)
            output.append({
                        "title": item.get("title", "No title"),
                        "source": item.get("source", {}).get("name", "Unknown source"),
                        "link": item.get("link", "No link"),
                        "date": item.get("date", "No date")
                    })
            
    
            
    s3 = boto3.client(
            "s3",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
        )
        
    current_date = datetime.now().strftime("%Y-%m-%d")
    bucket_name = "webscraping-data-2024"
    s3_key = f"{name}/raw-data/{current_date}.json"
    
    json_data = json.dumps(output, indent=4)
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
    
    return output

if __name__ == "__main__":
    news()