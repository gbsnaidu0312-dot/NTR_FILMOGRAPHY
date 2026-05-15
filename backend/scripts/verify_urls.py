"""Verify generated URLs against R2 bucket"""
import requests, urllib3
urllib3.disable_warnings()
base = 'https://pub-4b8805119f7f49ae848fa1aaa57dd6d0.r2.dev'

urls = [
    ('poster', f'{base}/wp5283563.jpg'),
    ('audio Ninnu 01.mp3', f'{base}/Audio/Ninnu%20Choodalani/01.mp3'),
    ('audio Ninnu 1.mp3', f'{base}/Audio/Ninnu%20Choodalani/1.mp3'),
    ('video Temper song-06.mp4', f'{base}/VideoCuts/Video%20Songs/Temper/song-06.mp4'),
    ('video Temper 06.mp4', f'{base}/VideoCuts/Video%20Songs/Temper/06.mp4'),
    ('video Temper 6.mp4', f'{base}/VideoCuts/Video%20Songs/Temper/6.mp4'),
    ('video Temper 1.mp4', f'{base}/VideoCuts/Video%20Songs/Temper/1.mp4'),
    ('photo Offline 01.jpg', f'{base}/Photos/Offline/01.jpg'),
    ('photo Offline 1.jpg', f'{base}/Photos/Offline/1.jpg'),
    ('photo RRR 1.jpg', f'{base}/Photos/Movie/RRR/1.jpg'),
    ('photo RRR 2.jpg', f'{base}/Photos/Movie/RRR/2.jpg'),
]

print("Verifying URLs:")
for label, url in urls:
    try:
        r = requests.head(url, verify=False, timeout=3)
        status = 'OK' if r.status_code == 200 else 'MISS'
        print(f'  {status:4s} [{r.status_code}] {label}')
    except Exception as e:
        print(f'  ERR  {label}: {e}')
