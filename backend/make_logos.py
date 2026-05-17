import os
from PIL import Image

logo_path = r"c:\PROJECT_N\BACKUP_ZIP\NTRFILMOGRAPHY\frontend\public\tiger-nation-logo.jpg"
out_p = r"c:\PROJECT_N\BACKUP_ZIP\NTRFILMOGRAPHY\frontend\public\tiger-nation-logo-portrait.jpg"
out_l = r"c:\PROJECT_N\BACKUP_ZIP\NTRFILMOGRAPHY\frontend\public\tiger-nation-logo-landscape.jpg"

try:
    img = Image.open(logo_path)
    img = img.convert("RGB")
    w, h = img.size
    print(f"Original size: {w}x{h}")
    
    # Let's get the background color (top left pixel)
    bg_color = img.getpixel((0, 0))

    # Landscape (16:9)
    # If the image is not 16:9, let's make it 16:9.
    target_l_w = 1920
    target_l_h = 1080
    
    # Calculate scale to fit inside landscape while maintaining aspect ratio, or just center it.
    scale = min(target_l_w / w, target_l_h / h)
    new_w = int(w * scale)
    new_h = int(h * scale)
    resized_l = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    landscape = Image.new("RGB", (target_l_w, target_l_h), bg_color)
    landscape.paste(resized_l, ((target_l_w - new_w) // 2, (target_l_h - new_h) // 2))
    landscape.save(out_l)
    print("Saved landscape")
    
    # Portrait (2:3) or typical poster size like 800x1200
    target_p_w = 800
    target_p_h = 1200
    
    scale_p = min(target_p_w / w, target_p_h / h)
    new_p_w = int(w * scale_p)
    new_p_h = int(h * scale_p)
    resized_p = img.resize((new_p_w, new_p_h), Image.Resampling.LANCZOS)
    
    portrait = Image.new("RGB", (target_p_w, target_p_h), bg_color)
    portrait.paste(resized_p, ((target_p_w - new_p_w) // 2, (target_p_h - new_p_h) // 2))
    portrait.save(out_p)
    print("Saved portrait")

except Exception as e:
    print("Error:", e)
