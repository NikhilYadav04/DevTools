import sqlite3
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import random

user_agents = [
                # Desktop Browsers
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
                
                # Mobile Browsers
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/537.36",
                "Mozilla/5.0 (Linux; Android 14; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/537.36",
                "Mozilla/5.0 (Linux; Android 12; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                "Mozilla/5.0 (Linux; Android 13; OnePlus 10 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                
                # Search Engine Crawlers
                "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
                "Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)",
                "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
                "Mozilla/5.0 (compatible; DuckDuckBot/1.1; +https://duckduckgo.com/duckduckbot)",
                "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)"
                ]

# Save URL to SQLite
def save_url(url, status_code, source):
    conn = sqlite3.connect("crawler.db")
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT OR IGNORE INTO links (url, status_code, source) VALUES (?, ?, ?)", (url, status_code, source))
        conn.commit()
    except sqlite3.Error as e:
        print("SQLite Error:", e)
    finally:
        conn.close()

# Get sitemap URL from robots.txt
async def get_sitemap_from_robots(session, base_url):
    robots_url = urljoin(base_url, "/robots.txt")
    try:
        async with session.get(robots_url, timeout=5) as response:
            if response.status == 200:
                maps = [line.split(": ", 1)[1].strip() for line in (await response.text()).split("\n") if line.lower().startswith("sitemap:")]
                return maps
    except Exception:
        print("No robots.txt")
        # save_url(robots_url, 500, base_url)
    return None

# Fetch URLs from sitemap.xml
async def fetch_sitemap_urls(session, sitemap_urls):
    all_urls = []
    for sitemap_url in sitemap_urls:
        try:
            async with session.get(sitemap_url, timeout=5) as response:
                if response.status == 200:
                    root = ET.fromstring(await response.text())
                    all_urls.extend([elem.text for elem in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")])
        except Exception:
            pass
    return all_urls

# Extract internal and external links
async def extract_links(session, url, base_url):
    internal_links = []
    external_links = []
    try:
        headers = {"User-Agent": random.choice(user_agents)}
        
        async with session.get(url, headers=headers, timeout=5) as response:
            if response.status == 200:
                soup = BeautifulSoup(await response.text(), "html.parser")
                for a_tag in soup.find_all("a", href=True):
                    link = urljoin(base_url, a_tag["href"])
                    if urlparse(link).netloc == urlparse(base_url).netloc:
                        internal_links.append(link)
                    else:
                        external_links.append(link)
    except Exception:
        pass
    return internal_links, external_links
