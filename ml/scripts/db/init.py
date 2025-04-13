import sqlite3

def init_db():
    conn = sqlite3.connect("crawler.db")
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS links")
    cursor.execute("""
        CREATE TABLE links (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT UNIQUE,
            status_code INTEGER,
            source TEXT
        )
    """)
    conn.commit()
    conn.close()