"""
DB의 꿈해몽 슬러그와 sitemap의 /dream/ URL을 정확히 비교하여
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
    with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
        sitemap_content = f.read()

    # sitemap에서 /dream/ 슬러그만 추출
    sitemap_dream_slugs = set()
    for loc in re.findall(r"<loc>(.*?)</loc>", sitemap_content):
        if "/dream/" in loc:
            slug = loc.split("/dream/")[-1].rstrip("/")
            sitemap_dream_slugs.add(slug)

    print(f"sitemap /dream/ 슬러그 수: {len(sitemap_dream_slugs)}개")

    # DB에서 발행된 꿈해몽 전체 조회
    dreams = fetch_all_rows("dreams", "id,slug,published_at", {"published": "eq.true"})
    print(f"DB 발행 꿈해몽 수: {len(dreams)}개")

    # DB 슬러그 목록
    db_slugs = {}
    for d in dreams:
        slug = d.get("slug") or str(d["id"])
        db_slugs[slug] = d

    # 누락 찾기: DB에 있지만 sitemap에 없는 것
    missing_slugs = {slug: data for slug, data in db_slugs.items() if slug not in sitemap_dream_slugs}
    print(f"누락된 꿈해몽 수: {len(missing_slugs)}개")

    # sitemap에 있지만 DB에 없는 것 (삭제된 항목)
    orphan_slugs = sitemap_dream_slugs - set(db_slugs.keys())
    print(f"sitemap에만 있는 (DB에 없는) 꿈해몽 수: {len(orphan_slugs)}개")

    if missing_slugs:
        print("\n누락된 슬러그 목록:")
        for slug in sorted(missing_slugs.keys()):
            print(f"  - {slug}")

        # 추가
        new_blocks = ""
        for slug, data in missing_slugs.items():
            lastmod = (data.get("published_at") or TODAY)[:10]
            new_blocks += f"""  <url>
    <loc>{BASE_URL}/dream/{slug}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n"""

        updated = sitemap_content.replace("</urlset>", new_blocks + "</urlset>")
        with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
            f.write(updated)

        print(f"\n✅ {len(missing_slugs)}개 URL 추가 완료!")

        # 최종 검증
        with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
            final = f.read()
        final_locs = re.findall(r"<loc>(.*?)</loc>", final)
        print(f"최종 sitemap 총 URL: {len(final_locs)}개")
        if len(final_locs) == len(set(final_locs)):
            print("✅ 중복 URL 없음 확인 완료")
        else:
            dupes = [l for l in set(final_locs) if final_locs.count(l) > 1]
            print(f"⚠️  중복 발견: {dupes}")
    else:
        print("\n✅ 누락된 꿈해몽 URL이 없습니다.")

    if orphan_slugs:
        print(f"\n참고: sitemap에만 있고 DB에는 없는 슬러그 {len(orphan_slugs)}개 (삭제된 콘텐츠일 수 있음):")
        for s in sorted(orphan_slugs)[:10]:
            print(f"  - {s}")
        if len(orphan_slugs) > 10:
            print(f"  ... 외 {len(orphan_slugs)-10}개")

if __name__ == "__main__":
    main()
