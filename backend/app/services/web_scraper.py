import re
import logging
import httpx
from typing import Dict, Any, Optional

logger = logging.getLogger("agentsphere.web_scraper")

def fetch_company_website_metadata(url: str) -> Dict[str, Any]:
    """Fetch live HTML content from company website URL and extract real metadata."""
    if not url:
        return {"title": None, "description": None, "fetched": False}

    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        res = httpx.get(url, headers=headers, timeout=4.0, follow_redirects=True, verify=False)
        if res.status_code == 200:
            html = res.text
            
            # Extract <title>
            title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
            title = title_match.group(1).strip() if title_match else None

            # Extract <meta name="description" content="...">
            desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE | re.DOTALL)
            if not desc_match:
                desc_match = re.search(r'<meta\s+property=["\']og:description["\']\s+content=["\'](.*?)["\']', html, re.IGNORECASE | re.DOTALL)
            description = desc_match.group(1).strip() if desc_match else None

            return {
                "url": str(res.url),
                "title": title,
                "description": description,
                "status_code": 200,
                "fetched": True
            }
    except Exception as e:
        logger.warning(f"Could not fetch website {url}: {e}")

    return {"url": url, "title": None, "description": None, "fetched": False}
