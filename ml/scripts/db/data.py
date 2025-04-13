import sqlite3

def get_all_links_data():
    conn = sqlite3.connect("crawler.db")
    cursor = conn.cursor()
    cursor.execute("SELECT url, status_code, source FROM links")
    rows = cursor.fetchall()
    conn.close()
    return [{"url": row[0], "status_code": row[1], "source": row[2]} for row in rows]
