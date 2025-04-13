from flask import Flask, request, jsonify
import asyncio
import sqlite3

from db.init import init_db
from crawler.crawler import async_crawl_website

app = Flask(__name__)

# Flask route to start crawling
@app.route('/crawl', methods=['POST'])
def crawl():
    init_db()
    data = request.get_json()
    if 'url' not in data:
        return jsonify({"error": "URL parameter is required"}), 400

    # Category=True --> Skips links 
    base_url = data['url']
    category = data['category'] if 'category' in data else 'True'
    max_pages = int(data['max_pages']) if 'max_pages' in data else 500
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        links_data = loop.run_until_complete(async_crawl_website(base_url, category, max_pages))
        return jsonify({"links": links_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/crawl/internal', methods=['GET'])
def internal():
    try:
        # Try to establish a connection
        conn = sqlite3.connect("crawler.db")
        cursor = conn.cursor()

        # Execute a simple query to check the connection
        
        cursor.execute("SELECT url, status_code, source FROM links WHERE source<>'external'")
        rows = cursor.fetchall()
        print(rows)  # This will show you all rows in the table

        # Return the rows as JSON
        return jsonify([{"url": row[0], "status_code": row[1], "source": row[2]} for row in rows]), 200
    
    except sqlite3.Error as e:
        # If there is an SQLite database error
        return jsonify({"error": "Database connection failed", "message": str(e)}), 500
    
    except Exception as e:
        # Catch all other exceptions (unexpected issues)
        return jsonify({"error": "An unexpected error occurred", "message": str(e)}), 500
    
@app.route('/crawl/external', methods=['GET'])
def external():
    try:
        # Try to establish a connection
        conn = sqlite3.connect("crawler.db")
        cursor = conn.cursor()

        # Execute a simple query to check the connection
        
        cursor.execute("SELECT url, status_code, source FROM links WHERE source=='external'")
        rows = cursor.fetchall()
        print(rows)  # This will show you all rows in the table

        # Return the rows as JSON
        return jsonify([{"url": row[0], "status_code": row[1], "source": row[2]} for row in rows]), 200
    
    except sqlite3.Error as e:
        # If there is an SQLite database error
        return jsonify({"error": "Database connection failed", "message": str(e)}), 500
    
    except Exception as e:
        # Catch all other exceptions (unexpected issues)
        return jsonify({"error": "An unexpected error occurred", "message": str(e)}), 500

# Initialize DB
init_db()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
