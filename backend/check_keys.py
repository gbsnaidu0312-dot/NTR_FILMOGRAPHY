import json
import sys

try:
    with open('full_media_structure.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print("TOP LEVEL KEYS:")
    for k in data.keys():
        print(f" - {k}")
except Exception as e:
    print(e)
