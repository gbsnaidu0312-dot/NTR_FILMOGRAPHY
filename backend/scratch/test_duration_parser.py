import struct
import requests

def get_mp4_duration(url):
    try:
        # Fetch the first 64KB
        headers = {'Range': 'bytes=0-65536'}
        r = requests.get(url, headers=headers, timeout=5)
        data = r.content
        
        # Search for 'mvhd' atom
        idx = data.find(b'mvhd')
        if idx == -1:
            print("  mvhd atom not found in first 64KB. Retrying with first 512KB...")
            headers = {'Range': 'bytes=0-524288'}
            r = requests.get(url, headers=headers, timeout=5)
            data = r.content
            idx = data.find(b'mvhd')
            if idx == -1:
                return None
        
        version = data[idx + 8]
        if version == 0:
            timescale = struct.unpack('>I', data[idx + 20:idx + 24])[0]
            duration = struct.unpack('>I', data[idx + 24:idx + 28])[0]
        elif version == 1:
            timescale = struct.unpack('>I', data[idx + 28:idx + 32])[0]
            duration = struct.unpack('>Q', data[idx + 32:idx + 40])[0]
        else:
            return None
            
        if timescale > 0:
            return int(duration / timescale)
    except Exception as e:
        print(f"  Error parsing {url}: {e}")
    return None

# Test with a known video URL
url = "https://ntrfilmography.live/VideoCuts/Video%20Songs/Aadi/Chiki%20Chiki%20Bum.mp4"
print(f"Fetching duration for: {url}")
duration = get_mp4_duration(url)
print(f"Parsed Duration: {duration} seconds")
