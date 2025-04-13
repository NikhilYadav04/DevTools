
import requests
import json

# URL of the Flask server
url = 'http://127.0.0.1:5000/crawl'

# The data to send in the POST request (the website URL you want to crawl)
data = {
    "url": "https://www.jagran.com/",
    "category": "False",
    'max_pages': 100
}

# Send the POST request to the Flask app
response = requests.post(url, json=data)

# Check if the request was successful
if response.status_code == 200:
    # Parse the JSON response
    links_data = response.json()
    print("Crawled Links Data:")
    print(json.dumps(links_data, indent=4))
else:
    print(f"Error: {response.status_code}")
    print(response.text)


