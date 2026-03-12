"""
Supabase DB의 발행 URL과 sitemap.xml의 URL을 비교하여
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
    "Content-Type": "application/json",
}

BASE_URL = "https://muunsaju.com"
TODAY = date.today().isoformat()
SITEMAP_PATH = "/home/ubuntu/muun/client/public/sitemap.xml"

def fetch_all_rows(table: str, select: str, filters: dict = None, page_size: int = 1000):
    all_rows = []
    offset = 0
    while True:
        params = {"select": select, "limit": page_size, "offset": offset}
        if filters:
            params.update(filters)
        resp = requests.get(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers=HEADERS,
            params=params,
        )
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
    # 현재 sitemap에 있는 URL 목록
    with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
        sitemap_content = f.read()
    existing_locs = set(re.findall(r"<loc>(.*?)</loc>", sitemap_content))
    print(f"현재 sitemap URL 수: {len(existing_locs)}개\n")

    all_missing = []

    # --- 칼럼 ---
    print("[1] 칼럼 누락 확인...")
    columns = fetch_all_rows("columns", "id,slug,published_at", {"published": "eq.true"})
    col_missing = []
    for col in columns:
        slug = col.get("slug") or str(col["id"])
        loc = f"{BASE_URL}/guide/{slug}"
        if loc not in existing_locs:
            col_missing.append({
                "loc": loc,
                "lastmod": (col.get("published_at") or TODAY)[:10],
                "changefreq": "monthly",
                "priority": "0.6",
            })
    print(f"  DB: {len(columns)}개 / sitemap: {len([l for l in existing_locs if '/guide/' in l])}개 / 누락: {len(col_missing)}개")
    all_missing.extend(col_missing)

    # --- 꿈해몽 ---
    print("[2] 꿈해몽 누락 확인...")
    dreams = fetch_all_rows("dreams", "id,slug,published_at", {"published": "eq.true"})
    dream_missing = []
    for dream in dreams:
        slug = dream.get("slug") or str(dream["id"])
        loc = f"{BASE_URL}/dream/{slug}"
        if loc not in existing_locs:
            dream_missing.append({
                "loc": loc,
                "lastmod": (dream.get("published_at") or TODAY)[:10],
                "changefreq": "monthly",
                "priority": "0.6",
            })
    print(f"  DB: {len(dreams)}개 / sitemap: {len([l for l in existing_locs if '/dream/' in l])}개 / 누락: {len(dream_missing)}개")
    if dream_missing:
        print("  누락된 꿈해몽 슬러그:")
        for d in dream_missing:
            print(f"    - {d['loc']}")
    all_missing.extend(dream_missing)

    # --- 운세 사전 ---
    print("[3] 운세 사전 누락 확인...")
    dictionary = fetch_all_rows("fortune_dictionary", "id,slug,updated_at", {"published": "eq.true"})
    dict_missing = []
    for entry in dictionary:
        slug = entry.get("slug") or str(entry["id"])
        loc = f"{BASE_URL}/dictionary/{slug}"
        if loc not in existing_locs:
            dict_missing.append({
                "loc": loc,
                "lastmod": (entry.get("updated_at") or TODAY)[:10],
                "changefreq": "monthly",
                "priority": "0.6",
            })
    print(f"  DB: {len(dictionary)}개 / sitemap: {len([l for l in existing_locs if '/dictionary/' in l])}개 / 누락: {len(dict_missing)}개")
    all_missing.extend(dict_missing)

    print(f"\n총 누락 URL: {len(all_missing)}개")

    if not all_missing:
        print("\n✅ 모든 콘텐츠가 이미 sitemap에 등록되어 있습니다!")
        return

    # 누락된 항목 추가
    print("\n누락된 URL을 sitemap.xml에 추가합니다...")
    new_url_blocks = ""
    for u in all_missing:
        new_url_blocks += f"""  <url>
    <loc>{u['loc']}</loc>
    <lastmod>{u['lastmod']}</lastmod>
    <changefreq>{u['changefreq']}</changefreq>
    <priority>{u['priority']}</priority>
  </url>\n"""

    updated_content = sitemap_content.replace("</urlset>", new_url_blocks + "</urlset>")

    with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
        f.write(updated_content)

    # 최종 검증
    with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
        final_content = f.read()
    final_locs = re.findall(r"<loc>(.*?)</loc>", final_content)
    print(f"\n✅ sitemap.xml 업데이트 완료!")
    print(f"   추가된 URL: {len(all_missing)}개")
    print(f"   최종 총 URL: {len(final_locs)}개")

    # 중복 검사
    if len(final_locs) != len(set(final_locs)):
        dupes = [loc for loc in set(final_locs) if final_locs.count(loc) > 1]
        print(f"⚠️  중복 URL 발견: {dupes}")
    else:
        print("✅ 중복 URL 없음 확인 완료")

if __name__ == "__main__":
    main()
