"""Pull startups with $5K+ MRR from TrustMRR, by category, and flag ones founded 2025+.
Usage: export TRUSTMRR_KEY=tmrr_xxx; python3 trustmrr_pull.py
"""
import csv, json, os, sys, time, urllib.error, urllib.parse, urllib.request

KEY = os.environ.get("TRUSTMRR_KEY")
if not KEY:
    sys.exit("Set TRUSTMRR_KEY first: export TRUSTMRR_KEY=tmrr_xxx")

BASE = "https://trustmrr.com/api/v1/startups"
CATEGORIES = ["ai", "marketing", "customer-support", "sales", "social-media",
              "analytics", "productivity", "content-creation", "saas"]
MIN_MRR = 5000  # dollars
MAX_PAGES = 6
NEWER_THAN = "2025-01-01"
PAUSE = 6.5


def get(params):
    url = BASE + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {KEY}"})
    while True:
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                reset = e.headers.get("X-RateLimit-Reset")
                wait = int(reset) - int(time.time()) if reset else 30
                wait = min(max(wait, 5), 65)
                print(f"rate limited, waiting {wait}s", flush=True)
                time.sleep(wait + 1)
                continue
            sys.exit(f"HTTP {e.code}: {e.read().decode()[:300]}")


rows = []
for cat in CATEGORIES:
    for page in range(1, MAX_PAGES + 1):
        res = get({"category": cat, "minMrr": MIN_MRR, "sort": "revenue-desc",
                   "limit": 10, "page": page})
        for s in res.get("data", []):
            rev = s.get("revenue") or {}
            rows.append({
                "category": cat,
                "name": s.get("name"),
                "mrr_usd": round(rev.get("mrr") or 0),
                "founded": (s.get("foundedDate") or "")[:10],
                "new_2025plus": (s.get("foundedDate") or "") >= NEWER_THAN,
                "growth_mrr_30d_pct": s.get("growthMRR30d"),
                "audience": s.get("targetAudience"),
                "subs": s.get("activeSubscriptions"),
                "website": s.get("website"),
                "description": (s.get("description") or "").replace("\n", " "),
            })
        print(f"{cat} page {page}: total so far {len(rows)}", flush=True)
        if not res.get("meta", {}).get("hasMore"):
            break
        time.sleep(PAUSE)
    time.sleep(PAUSE)

rows.sort(key=lambda r: (r["category"], -r["mrr_usd"]))
with open("trustmrr_results.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)

new = [r for r in rows if r["new_2025plus"]]
print(f"\nDone. {len(rows)} startups, {len(new)} founded {NEWER_THAN}+. Saved trustmrr_results.csv", flush=True)
