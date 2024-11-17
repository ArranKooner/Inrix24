import praw
import boto3
import json
from datetime import datetime
from dotenv import load_dotenv
import os
import re
import emoji

load_dotenv()
def redditscraper(search):

    reddit = praw.Reddit(
        client_id=os.getenv("REDDIT_CLIENT_ID"),
        client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
        user_agent=os.getenv("REDDIT_USER_AGENT")
    )

    s3 = boto3.client(
        "s3",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
    )


    def clean_data(text):
        text = re.sub(r"http\S+|www\S+|https\S+", "", text)  
        text = emoji.replace_emoji(text, replace="")  
        text = re.sub(r"[^a-zA-Z0-9\s!?.,]", "", text)  
        text = re.sub(r"\s+", " ", text).strip() 
        return text

    def filter_threshold(comments, threshold=5):
        return [comment for comment in comments if comment["score"] >= threshold]

    def process_reddit_data(search, bucket_name, comment_threshold=5):
        current_date = datetime.now().strftime("%Y-%m-%d")
        raw_s3_key = f"{search}/raw-data/{current_date}/{search}.json"
        processed_s3_key = f"{search}/processed-data/{current_date}/{search}.json"

        raw_threads = []
        processed_threads = []

        try:
            subreddit = reddit.subreddit(search)
            for post in subreddit.hot(limit=20):
                submission = reddit.submission(id=post.id)
                submission.comments.replace_more(limit=10)

                all_comments = [
                    {"text": comment.body, "score": comment.score}
                    for comment in submission.comments.list()
                ]

                raw_threads.append({
                    "Title": post.title,
                    "URL": post.url,
                    "Post ID": post.id,
                    "Comments": all_comments,
                    "Score": post.score,
                    "Upvote Ratio": post.upvote_ratio
                })

                filtered_comments = filter_threshold(all_comments, threshold=comment_threshold)
                cleaned_comments = [
                    {"text": clean_data(comment["text"]), "score": comment["score"]}
                    for comment in filtered_comments
                ]

                processed_threads.append({
                    "Title": clean_data(post.title),
                    "URL": post.url,
                    "Post ID": post.id,
                    "Comments": cleaned_comments,
                    "Score": post.score,
                    "Upvote Ratio": post.upvote_ratio
                })

            s3.put_object(
                Bucket=bucket_name,
                Key=raw_s3_key,
                Body=json.dumps(raw_threads, indent=4),
                ContentType="application/json"
            )
            print(f"Raw data uploaded to S3: s3://{bucket_name}/{raw_s3_key}")

            s3.put_object(
                Bucket=bucket_name,
                Key=processed_s3_key,
                Body=json.dumps(processed_threads, indent=4),
                ContentType="application/json"
            )
            print(f"Processed data uploaded to S3: s3://{bucket_name}/{processed_s3_key}")

        except Exception as e:
            print(f"An error occurred: {e}")

    #search = input("What company do you want to search for? ").strip().lower()
    bucket_name = "webscraping-data-2024"
    process_reddit_data(search, bucket_name)

if __name__ == "__main__":
    redditscraper()