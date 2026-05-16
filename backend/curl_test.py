import urllib.request

try:
    url = "http://localhost:8000/api/videos/folders/?type=song"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Body:", response.read().decode('utf-8'))
except Exception as e:
    print("Error:", str(e))
