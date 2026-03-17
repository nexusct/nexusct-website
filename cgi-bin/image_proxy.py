#!/usr/bin/env python3
"""Image proxy: searches Google for a facility image and returns the first result as base64."""
import json, os, sys, urllib.request, urllib.parse, base64, re

def respond(status, body):
    print(f"Status: {status}")
    print("Content-Type: application/json")
    print()
    print(json.dumps(body))

query_string = os.environ.get("QUERY_STRING", "")
params = dict(p.split("=", 1) for p in query_string.split("&") if "=" in p)
facility = urllib.parse.unquote_plus(params.get("q", ""))

if not facility:
    respond(400, {"error": "Missing ?q= parameter"})
    sys.exit(0)

try:
    # Search Google Images for the facility
    search_query = urllib.parse.quote_plus(f"{facility} building exterior")
    search_url = f"https://www.google.com/search?q={search_query}&tbm=isch&tbs=isz:m"
    
    req = urllib.request.Request(search_url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    })
    
    with urllib.request.urlopen(req, timeout=8) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
    
    # Extract image URLs from Google Image search results
    # Google embeds thumbnails as base64 or links image URLs in the page
    img_urls = []
    
    # Pattern 1: Direct image URLs in search results
    for match in re.finditer(r'"(https?://[^"]+\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)"', html):
        url = match.group(1)
        # Skip Google's own assets
        if "google.com" not in url and "gstatic.com" not in url and "googleapis.com" not in url:
            img_urls.append(url)
    
    # Pattern 2: Look for data URIs (base64 thumbnails)
    data_uris = re.findall(r'data:image/jpeg;base64,([A-Za-z0-9+/=]{100,})', html)
    
    if not img_urls and not data_uris:
        respond(404, {"error": "No images found", "url": None, "base64": None})
        sys.exit(0)
    
    # Try to fetch the first real image URL
    image_b64 = None
    image_url = None
    
    for url in img_urls[:5]:
        try:
            img_req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://www.google.com/"
            })
            with urllib.request.urlopen(img_req, timeout=6) as img_resp:
                img_data = img_resp.read()
                if len(img_data) > 5000:  # Minimum size to be a real photo
                    content_type = img_resp.headers.get("Content-Type", "image/jpeg")
                    if "png" in content_type:
                        mime = "image/png"
                    elif "webp" in content_type:
                        mime = "image/webp"
                    else:
                        mime = "image/jpeg"
                    image_b64 = base64.b64encode(img_data).decode("ascii")
                    image_url = url
                    break
        except:
            continue
    
    # Fall back to base64 thumbnail if no URL worked
    if not image_b64 and data_uris:
        image_b64 = data_uris[0]
        mime = "image/jpeg"
    
    if image_b64:
        respond(200, {
            "base64": f"data:{mime};base64,{image_b64}" if image_b64 and not image_b64.startswith("data:") else image_b64,
            "url": image_url,
            "source": "google"
        })
    else:
        respond(404, {"error": "Could not fetch image", "url": None, "base64": None})
        
except Exception as e:
    respond(422, {"error": str(e), "url": None, "base64": None})
