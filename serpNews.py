import os
from serpapi import GoogleSearch
from flask import Flask, request
import json

app = Flask(__name__)

@app.route('/news/')
def hello():
    
    name = request.args['search']
    if 'search' in request.args:
        name = request.args['search']
    else:
        name = 'netflix'
    
    params = {
      "engine": "google_news",
      "q": name,
      "gl": "us",
      "hl": "en",
      "api_key": "a120362cf4fefcbab9ef30d6a6ce908ca65f58bf3c384f665d95342ffdb7e5c2"
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    results = results["news_results"]


    
    return results


