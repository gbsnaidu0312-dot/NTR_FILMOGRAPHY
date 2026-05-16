import json

def find_paths(d, path, paths):
    if isinstance(d, dict):
        for k, v in d.items():
            if k == 'files' or k == '_files':
                for f in v:
                    if f.endswith('.mp4') or f.endswith('.mkv'):
                        paths.append(path + '/' + f)
            else:
                find_paths(v, path + '/' + k if path else k, paths)

try:
    with open('full_media_structure.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    paths = []
    find_paths(data, '', paths)
    with open('mp4_paths.txt', 'w', encoding='utf-8') as f:
        for p in paths:
            f.write(p + '\n')
    print("Done")
except Exception as e:
    # Try utf-16
    try:
        with open('full_media_structure.json', 'r', encoding='utf-16') as f:
            data = json.load(f)
        paths = []
        find_paths(data, '', paths)
        with open('mp4_paths.txt', 'w', encoding='utf-8') as f:
            for p in paths:
                f.write(p + '\n')
        print("Done (utf-16)")
    except Exception as e2:
        with open('mp4_paths.txt', 'w', encoding='utf-8') as f:
            f.write(str(e) + '\n' + str(e2))
