
import requests
import json

# URL of the Flask server
url = 'http://127.0.0.1:5000/crawl/external'

# The data to send in the POST request (the website URL you want to crawl)
data = {
    "url": "https://tasty.co/",
    "category": "False"
}

# Send the POST request to the Flask app
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the JSON response
    links_data = response.json()
    print("Crawled Links Data:")
    print(json.dumps(links_data, indent=4))
else:
    print(f"Error: {response.status_code}")
    print(response.text)


