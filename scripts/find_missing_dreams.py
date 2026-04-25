"""
DB의 꿈해몽 슬러그와 sitemap의 /dream/ URL을 정밀 비교하여
누락된 항목을 찾고 추가하는 스크립트
"""

import requests
import re
from datetime import date

SUPABASE_URL = "https://vuifbmsdggnwygvgcrkj.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI"

HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
}

BASE_URL = "https://muunsaju.com"
TODAY = date.today().isoformat()
SITEMAP_PATH = "/home/ubuntu/muun/client/public/sitemap.xml"

def fetch_all_rows(table, select, filters=None, page_size=1000):
    all_rows = []
    offset = 0
    while True:
        params = {"select": select, "limit": page_size, "offset": offset}
        if filters:
            params.update(filters)
        resp = requests.get(f"{SUPABASE_URL}/rest/v1/{table}", headers=HEADERS, params=params)
        resp.raise_for_status()
        rows = resp.json()
        if not rows:
            break
        all_rows.extend(rows)
        if len(rows) < page_size:
            break
        offset += page_size
    return all_rows

def main():
    # DB에서 전체 꿈해몽 조회
    print("DB에서 꿈해몽 데이터 수집 중...")
    dreams = fetch_all_rows("dreams", "id,slug,published_at", {"published": "eq.true"})
    print(f"  → {len(dreams)}개 수집")

    # DB 슬러그 목록 (slug 없으면 id 사용)
    db_slugs = {}
    for d in dreams:
        slug = d.get("slug") or str(d["id"])
        db_slugs[slug] = d

    # sitemap에서 /dream/ 슬러그 추출
    with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
        sitemap_content = f.read()

    sitemap_dream_slugs = set()
    for loc in re.findall(r"<loc>(.*?)</loc>", sitemap_content):
        if "/dream/" in loc:
            slug = loc.split("/dream/")[-1].strip().rstrip("/")
            sitemap_dream_slugs.add(slug)

    print(f"sitemap /dream/ 슬러그 수: {len(sitemap_dream_slugs)}개")

    # 누락 찾기
    missing = []
    for slug, data in db_slugs.items():
        if slug not in sitemap_dream_slugs:
            missing.append({
                "loc": f"{BASE_URL}/dream/{slug}",
                "lastmod": (data.get("published_at") or TODAY)[:10],
            })

    print(f"누락된 꿈해몽 URL: {len(missing)}개")
    if missing:
        print("누락 슬러그 샘플 (최대 20개):")
        for m in missing[:20]:
            print(f"  - {m['loc']}")
        if len(missing) > 20:
            print(f"  ... 외 {len(missing)-20}개")

        # 추가
        new_blocks = ""
        for u in missing:
            new_blocks += f"""  <url>
    <loc>{u['loc']}</loc>
    <lastmod>{u['lastmod']}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n"""

        updated = sitemap_content.replace("</urlset>", new_blocks + "</urlset>")
        with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
            f.write(updated)

        # 최종 검증
        with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
            final = f.read()
        final_locs = re.findall(r"<loc>(.*?)</loc>", final)
        final_dream = [l for l in final_locs if "/dream/" in l]
        print(f"\n✅ 추가 완료! /dream/ URL: {len(final_dream)}개 (DB: {len(dreams)}개)")
        print(f"   전체 URL: {len(final_locs)}개")

        if len(final_locs) == len(set(final_locs)):
            print("✅ 중복 URL 없음 확인 완료")
        else:
            dupes = [l for l in set(final_locs) if final_locs.count(l) > 1]
            print(f"⚠️  중복 URL {len(dupes)}개: {dupes[:3]}")
    else:
        print("✅ 누락된 꿈해몽 URL이 없습니다.")

if __name__ == "__main__":
    main()
