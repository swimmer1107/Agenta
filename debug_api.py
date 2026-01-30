
import requests
import json
import sys

url = "http://localhost:3000/api/agent"
payload = {
    "message": "Test Task",
    "threadId": "debug-123"
}

print(f"Connecting to {url}...")
try:
    with requests.post(url, json=payload, stream=True) as r:
        r.raise_for_status()
        print("Connected. Streaming...")
        for line in r.iter_lines():
            if line:
                decoded = line.decode('utf-8')
                print(f"RAW: {decoded}")
except Exception as e:
    print(f"Error: {e}")
