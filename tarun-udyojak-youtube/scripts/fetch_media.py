"""Find and download real photos / logos for a video, and log where each came from.

usage (from tarun-udyojak-youtube/):
  python3 scripts/fetch_media.py search "<query>" [--n 12]              # list Commons files + contact sheet
  python3 scripts/fetch_media.py get videos/<v> <slug> "File:<name>" [--w 1600]
  python3 scripts/fetch_media.py icon videos/<v> <slug> <simple-icons-slug> [--color FFFFFF]

Sources:
  * Wikimedia Commons (freely licensed photos + many brand logos). Search tries the API first and
    falls back to the MediaSearch HTML page (the API rate-limits shared cloud IPs).
  * simple-icons (npm, offline): monochrome SVG brand logos, e.g. zomato, swiggy, paytm, phonepe, jio.
Files land in videos/<v>/public/img/<slug>.<ext>; videos/<v>/credits.md gets one line per file
(source page, author, licence) for the YouTube description. Logos are trademarks: use them to
refer to the company (news/commentary), never to imply endorsement.
"""
import sys, os, re, json, time, html, subprocess, urllib.parse, urllib.request

UA = 'TarunUdyojakVideoTool/1.0 (https://github.com/prasanna-wagh27/video-editing)'
API = 'https://commons.wikimedia.org/w/api.php'
SCRATCH = os.environ.get('MEDIA_TMP', '/tmp/tu-media')


def get(url, binary=False, tries=4):
    for k in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read()
            if not binary and data.startswith(b'You are making too many requests'):
                raise IOError('rate limited')
            return data if binary else data.decode('utf-8', 'replace')
        except Exception as e:  # noqa: BLE001
            if k == tries - 1:
                raise
            time.sleep(2 * 2 ** k)


def api(**params):
    params.update(format='json', formatversion=2)
    return json.loads(get(API + '?' + urllib.parse.urlencode(params), tries=2))


def search(q, n=12):
    try:
        r = api(action='query', list='search', srnamespace=6, srlimit=n * 2, srsearch=q)
        names = [h['title'] for h in r['query']['search'] if re.search(r'\.(jpe?g|png|svg|webp|tiff?)$', h['title'], re.I)]
    except Exception:  # noqa: BLE001  API throttled -> HTML search page
        page = get('https://commons.wikimedia.org/w/index.php?' + urllib.parse.urlencode(
            {'search': q, 'title': 'Special:Search', 'ns6': 1, 'fulltext': 1, 'limit': max(n, 20)}))
        names = []
        for m in re.findall(r'File:[^"&<>?#]+?\.(?:jpe?g|png|svg|webp|gif|tiff?)', page, re.I):
            m = urllib.parse.unquote(m).replace('_', ' ')
            if m not in names:
                names.append(m)
    return names[:n]


STD_W = [120, 250, 330, 500, 960, 1280, 1920, 3840]  # Wikimedia only serves (and allows) these thumb widths


def file_url(name, w):
    w = next((x for x in STD_W if x >= w), STD_W[-1])
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(name[5:].replace(' ', '_')) + f'?width={w}'


def meta(name):
    """Author + licence from Commons; falls back to 'see page' when the API is throttled."""
    try:
        r = api(action='query', prop='imageinfo', iiprop='extmetadata', titles=name)
        em = r['query']['pages'][0]['imageinfo'][0]['extmetadata']
        clean = lambda k: re.sub(r'<[^>]+>', '', html.unescape(em.get(k, {}).get('value', ''))).strip()
        return clean('Artist') or 'unknown', clean('LicenseShortName') or 'see page'
    except Exception:  # noqa: BLE001  API throttled -> read the file page itself
        try:
            page = get('https://commons.wikimedia.org/wiki/' + urllib.parse.quote(name.replace(' ', '_')), tries=2).replace('&#95;', '_')
            txt = lambda h: re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html.unescape(h))).strip()
            lic = re.search(r'class="licensetpl_short"[^>]*>(.*?)</span>', page, re.S)
            aut = re.search(r'id="fileinfotpl_aut".*?</td>\s*<td[^>]*>(.*?)</td>', page, re.S)
            pd = 'Public domain' if re.search(r'licensetpl_short[^>]*>\s*Public domain', page) else None
            # (the page footer/structured data always links CC0, so only count licence links, not publicdomain/zero)
            cc = re.search(r'creativecommons\.org/licenses/([a-z-]+)/([0-9.]+)', page)
            ccname = f'CC {cc.group(1).upper()} {cc.group(2)}' if cc else None
            return (txt(aut.group(1))[:80] if aut else 'unknown'), (txt(lic.group(1)) if lic else pd or ccname or 'see page')
        except Exception:  # noqa: BLE001
            return 'see page', 'see page'


def credit(vdir, slug, line):
    p = os.path.join(vdir, 'credits.md')
    lines = open(p).read().splitlines() if os.path.exists(p) else ['# Media credits', '']
    lines = [l for l in lines if not l.startswith(f'- `{slug}`')] + [f'- `{slug}`: {line}']
    open(p, 'w').write('\n'.join(lines) + '\n')


def cmd_search(q, n):
    names = search(q, n)
    os.makedirs(SCRATCH, exist_ok=True)
    thumbs = []
    for i, name in enumerate(names):
        print(f'{i:2d}  {name}')
        try:
            p = os.path.join(SCRATCH, f's{i:02d}.png')
            open(p, 'wb').write(get(file_url(name, 330), binary=True)); time.sleep(0.6)
            thumbs.append(p)
        except Exception as e:  # noqa: BLE001
            print('    (thumb failed:', e, ')')
    if thumbs:  # numbered contact sheet, 4 per row
        sheet = os.path.join(SCRATCH, 'sheet.jpg')
        ins = sum([['-i', p] for p in thumbs], [])
        cells = ''.join(f'[{k}:v]scale=400:300:force_original_aspect_ratio=decrease,pad=400:300:(ow-iw)/2:(oh-ih)/2:color=gray,'
                        f"drawtext=text='{k}':x=8:y=8:fontsize=36:fontcolor=yellow:box=1:boxcolor=black[c{k}];" for k in range(len(thumbs)))
        cols = 4; rows = (len(thumbs) + cols - 1) // cols
        layout = '|'.join(f'{(k % cols) * 400}_{(k // cols) * 300}' for k in range(len(thumbs)))
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *ins, '-filter_complex',
                        cells + ''.join(f'[c{k}]' for k in range(len(thumbs))) +
                        (f'xstack=inputs={len(thumbs)}:layout={layout}:fill=black' if len(thumbs) > 1 else 'null'), sheet], check=False)
        print('sheet:', sheet)


def cmd_get(vdir, slug, name, w):
    if not name.startswith('File:'):
        name = 'File:' + name
    out_dir = os.path.join(vdir, 'public', 'img'); os.makedirs(out_dir, exist_ok=True)
    data = get(file_url(name, w), binary=True)
    ext = '.png' if data[:4] == b'\x89PNG' else '.jpg' if data[:2] == b'\xff\xd8' else '.webp' if data[8:12] == b'WEBP' else '.bin'
    out = os.path.join(out_dir, slug + ext)
    open(out, 'wb').write(data)
    who, lic = meta(name)
    page = 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(name.replace(' ', '_'))
    credit(vdir, slug, f'{name[5:]} by {who}, {lic}, Wikimedia Commons ({page})')
    print(out, f'({len(data) // 1024} KB)  credit: {who} / {lic}')


def cmd_icon(vdir, slug, icon, color):
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src = os.path.join(here, 'node_modules', 'simple-icons', 'icons', icon + '.svg')
    if not os.path.exists(src):
        sys.exit(f'no simple-icons logo "{icon}" (try fetch_media.py search "{icon} logo")')
    svg = open(src).read()
    if not color:  # brand colour from the package data
        data = json.load(open(os.path.join(here, 'node_modules', 'simple-icons', 'data', 'simple-icons.json')))
        data = data.get('icons', data) if isinstance(data, dict) else data
        color = next((d['hex'] for d in data if d.get('slug') == icon or d['title'].lower().replace(' ', '') == icon), 'FFFFFF')
    svg = svg.replace('<svg ', f'<svg fill="#{color}" ', 1)
    out_dir = os.path.join(vdir, 'public', 'img'); os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, slug + '.svg'); open(out, 'w').write(svg)
    credit(vdir, slug, f'{icon} logo via simple-icons (CC0 package; trademark of its owner)')
    print(out, '#' + color)


if __name__ == '__main__':
    a = sys.argv[1:]
    opt = lambda k, d: a[a.index(k) + 1] if k in a else d
    if not a:
        sys.exit(__doc__)
    if a[0] == 'search':
        cmd_search(a[1], int(opt('--n', 12)))
    elif a[0] == 'get':
        cmd_get(a[1], a[2], a[3], int(opt('--w', 1600)))
    elif a[0] == 'icon':
        cmd_icon(a[1], a[2], a[3], opt('--color', ''))
    else:
        sys.exit(__doc__)
