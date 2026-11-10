#!/usr/bin/env python3
"""Publish posts (image or video) to the content site.

Token: export CONTENT_UPLOAD_TOKEN="ci_upload_..."   (never written to disk by this script)

Single post:
  python3 scripts/upload-post.py --topic "..." --kind video --caption-file cap.txt --video out/v.mp4
  python3 scripts/upload-post.py --topic "..." --kind success-story --caption "..." --image photo.jpg
Batch (paths are relative to the JSON file):
  python3 scripts/upload-post.py --batch posts.json
  [{"topic": "...", "kind": "video", "caption_file": "captions/3.txt", "video": "videos/3.mp4"}, ...]
Add --dry-run to check files and print what would be sent, without any network call.

API:
  image: POST /api/posts multipart (topic, kind, caption, image=@file)
  video: POST /api/uploads {"contentType","size"} -> {key, uploadId, partSize, partCount}
         PUT  /api/uploads?key=&uploadId=&part=N  <raw bytes> -> {partNumber, etag}
         POST /api/uploads/complete {"key","uploadId","parts"}
         POST /api/posts multipart (topic, caption, kind=video, video_key=<key>)
"""
import argparse, json, mimetypes, os, sys, time, uuid, urllib.parse, urllib.request, urllib.error

BASE = os.environ.get('CONTENT_BASE_URL', 'https://ci.prasannawagh.dev')
UA = 'TarunUdyojakUploader/1.0'


def token():
    tok = os.environ.get('CONTENT_UPLOAD_TOKEN', '')
    if not tok:
        sys.exit('CONTENT_UPLOAD_TOKEN is not set')
    return tok


def call(method, path, body=None, ctype=None, tries=4):
    url = BASE.rstrip('/') + path
    for k in range(tries):
        req = urllib.request.Request(url, data=body, method=method, headers={'Authorization': f'Bearer {token()}', 'User-Agent': UA, **({'Content-Type': ctype} if ctype else {})})
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                raw = r.read()
                return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as e:
            msg = e.read()[:500].decode('utf-8', 'replace')
            if e.code < 500 and e.code != 429:
                sys.exit(f'{method} {path} -> HTTP {e.code}: {msg}')
            err = f'HTTP {e.code}: {msg}'
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            err = str(e)
        if k < tries - 1:
            wait = 2 * 2 ** k
            print(f'  {method} {path.split("?")[0]} failed ({err}); retry in {wait}s', file=sys.stderr)
            time.sleep(wait)
    sys.exit(f'{method} {path} failed after {tries} tries: {err}')


def multipart(fields, files=()):
    b = uuid.uuid4().hex
    out = bytearray()
    for k, v in fields.items():
        out += f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n'.encode() + str(v).encode() + b'\r\n'
    for name, path in files:
        ct = mimetypes.guess_type(path)[0] or 'application/octet-stream'
        out += f'--{b}\r\nContent-Disposition: form-data; name="{name}"; filename="{os.path.basename(path)}"\r\nContent-Type: {ct}\r\n\r\n'.encode()
        out += open(path, 'rb').read() + b'\r\n'
    out += f'--{b}--\r\n'.encode()
    return bytes(out), f'multipart/form-data; boundary={b}'


def upload_video(path):
    size = os.path.getsize(path)
    ct = mimetypes.guess_type(path)[0] or 'video/mp4'
    init = call('POST', '/api/uploads', json.dumps({'contentType': ct, 'size': size}).encode(), 'application/json')
    key, uid, psize, pcount = init['key'], init['uploadId'], int(init['partSize']), int(init['partCount'])
    print(f'  upload {os.path.basename(path)}: {size / 1e6:.1f} MB in {pcount} parts')
    parts = []
    with open(path, 'rb') as f:
        for n in range(1, pcount + 1):
            chunk = f.read(psize)
            q = urllib.parse.urlencode({'key': key, 'uploadId': uid, 'part': n})
            r = call('PUT', f'/api/uploads?{q}', chunk, 'application/octet-stream')
            parts.append({'partNumber': int(r.get('partNumber', n)), 'etag': r['etag']})
            print(f'    part {n}/{pcount} ok')
    call('POST', '/api/uploads/complete', json.dumps({'key': key, 'uploadId': uid, 'parts': parts}).encode(), 'application/json')
    return key


def publish(p, root, dry):
    cap = p.get('caption')
    if cap is None and p.get('caption_file'):
        cap = open(os.path.join(root, p['caption_file']), encoding='utf-8').read().strip()
    if not p.get('topic') or not cap:
        sys.exit(f'post needs topic and caption: {p}')
    media = p.get('video') or p.get('image')
    if not media:
        sys.exit(f'post needs "video" or "image": {p}')
    mpath = os.path.join(root, media)
    if not os.path.isfile(mpath):
        sys.exit(f'missing file: {mpath}')
    kind = p.get('kind') or ('video' if p.get('video') else 'post')
    print(f'- {p["topic"]} [{kind}] {media} ({os.path.getsize(mpath) / 1e6:.1f} MB)\n  caption: {cap[:120]}{"…" if len(cap) > 120 else ""}')
    if dry:
        return {'dry_run': True}
    if p.get('video'):
        key = upload_video(mpath)
        body, ct = multipart({'topic': p['topic'], 'caption': cap, 'kind': kind, 'video_key': key})
    else:
        body, ct = multipart({'topic': p['topic'], 'caption': cap, 'kind': kind}, [('image', mpath)])
    res = call('POST', '/api/posts', body, ct)
    print('  posted:', json.dumps(res, ensure_ascii=False)[:300])
    return res


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--batch'); ap.add_argument('--topic'); ap.add_argument('--kind'); ap.add_argument('--caption')
    ap.add_argument('--caption-file'); ap.add_argument('--image'); ap.add_argument('--video'); ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()
    if a.batch:
        posts, root = json.load(open(a.batch, encoding='utf-8')), os.path.dirname(os.path.abspath(a.batch))
    else:
        posts, root = [{'topic': a.topic, 'kind': a.kind, 'caption': a.caption, 'caption_file': a.caption_file, 'image': a.image, 'video': a.video}], os.getcwd()
    if not a.dry_run:
        token()
    for p in posts:  # validate everything before publishing anything
        publish(p, root, dry=True)
    if a.dry_run:
        print('dry run: nothing sent'); return
    print('publishing…')
    for p in posts:
        publish(p, root, dry=False)


if __name__ == '__main__':
    main()
