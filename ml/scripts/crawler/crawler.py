from flask import Flask, request, jsonify
import aiohttp
import asyncio
import sqlite3
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import random
from extraction.extractor import get_sitemap_from_robots, fetch_sitemap_urls, save_url, extract_links
from db.data import get_all_links_data

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

async def async_crawl_website(base_url, category, max_pages=1000):
    urls_to_crawl = set()
    crawled_urls = set()
    external_links = set()
    categories = set()

    async with aiohttp.ClientSession() as session:
        sitemap_urls = await get_sitemap_from_robots(session, base_url)
        if sitemap_urls:
            urls_to_crawl.update(await fetch_sitemap_urls(session, sitemap_urls))
        else:
            urls_to_crawl.add(base_url)

        tasks = []
        while urls_to_crawl and len(crawled_urls) < max_pages:
            url = urls_to_crawl.pop()
            if url in crawled_urls:
                continue
            if url.split('/')[-2] in categories:
                # save_url(url, 200, 'Skipped')
                continue
            if category.lower() == 'true':
                categories.add(url.split('/')[-2])
            crawled_urls.add(url)
            tasks.append(process_url(session, url, base_url, urls_to_crawl, external_links))

            if len(tasks) >= 50:  # Process 50 requests at a time
                await asyncio.gather(*tasks)
                tasks = []

        if tasks:
            await asyncio.gather(*tasks)

        # Save external links
        for link in external_links:
            save_url(link, None, "external")

    return get_all_links_data()

# Process a single URL
async def process_url(session, url, base_url, urls_to_crawl, external_links):
    try:
        # Randomize the User-Agent for each request
        headers = {"User-Agent": random.choice(user_agents)}
        
        async with session.get(url, headers=headers, timeout=5) as response:
            save_url(url, response.status, base_url)
            if response.status == 200:
                internal_links, ext_links = await extract_links(session, url, base_url)
                urls_to_crawl.update(internal_links)
                external_links.update(ext_links)
    except Exception:
        save_url(url, None, base_url)
