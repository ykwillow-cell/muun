"""
Supabase에서 발행된 칼럼/꿈해몽/운세사전 슬러그를 수집하여
sitemap.xml을 업데이트하는 스크립트
"""

import requests
import json
import xml.etree.ElementTree as ET
from datetime import date
import re

SUPABASE_URL = "https://vuifbmsdggnwygvgcrkj.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzY0ODYsImV4cCI6MjA4NzQ1MjQ4Nn0.PhMK66O73HH98WIPAu66qk8FuXwJLU4Z2bhDcmDCpKI"

HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json",
}

BASE_URL = "https://muunsaju.com"
TODAY = date.today().isoformat()

def fetch_all_rows(table: str, select: str, filters: dict = None, page_size: int = 1000):
    """페이지네이션으로 전체 데이터 수집"""
    all_rows = []
    offset = 0
    while True:
        params = {
            "select": select,
            "limit": page_size,
            "offset": offset,
        }
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
    print("=== Supabase 데이터 수집 시작 ===\n")

    # 1. 칼럼 (guide/:id 또는 guide/:slug)
    print("[1] 칼럼(columns) 수집 중...")
    columns = fetch_all_rows(
        table="columns",
        select="id,slug,published_at",
        filters={"published": "eq.true"},
    )
    print(f"  → {len(columns)}개 수집")

    # 2. 꿈해몽 (dream/:slug)
    print("[2] 꿈해몽(dreams) 수집 중...")
    dreams = fetch_all_rows(
        table="dreams",
        select="id,slug,published_at",
        filters={"published": "eq.true"},
    )
    print(f"  → {len(dreams)}개 수집")

    # 3. 운세 사전 (dictionary/:id 또는 dictionary/:slug)
    print("[3] 운세 사전(fortune_dictionary) 수집 중...")
    dictionary = fetch_all_rows(
        table="fortune_dictionary",
        select="id,slug,updated_at",
        filters={"published": "eq.true"},
    )
    print(f"  → {len(dictionary)}개 수집")

    # URL 목록 생성
    new_urls = []

    for col in columns:
        url_path = col.get("slug") or str(col["id"])
        lastmod = (col.get("published_at") or TODAY)[:10]
        new_urls.append({
            "loc": f"{BASE_URL}/guide/{url_path}",
            "lastmod": lastmod,
            "changefreq": "monthly",
            "priority": "0.6",
        })

    for dream in dreams:
        url_path = dream.get("slug") or str(dream["id"])
        lastmod = (dream.get("published_at") or TODAY)[:10]
        new_urls.append({
            "loc": f"{BASE_URL}/dream/{url_path}",
            "lastmod": lastmod,
            "changefreq": "monthly",
            "priority": "0.6",
        })

    for entry in dictionary:
        url_path = entry.get("slug") or str(entry["id"])
        lastmod = (entry.get("updated_at") or TODAY)[:10]
        new_urls.append({
            "loc": f"{BASE_URL}/dictionary/{url_path}",
            "lastmod": lastmod,
            "changefreq": "monthly",
            "priority": "0.6",
        })

    print(f"\n총 신규 URL 후보: {len(new_urls)}개")

    # 기존 sitemap.xml 읽기
    sitemap_path = "/home/ubuntu/muun/client/public/sitemap.xml"
    with open(sitemap_path, "r", encoding="utf-8") as f:
        existing_content = f.read()

    # 기존 URL 추출 (중복 체크용)
    existing_locs = set(re.findall(r"<loc>(.*?)</loc>", existing_content))
    print(f"기존 sitemap URL 수: {len(existing_locs)}개")

    # 중복 제거
    filtered_urls = [u for u in new_urls if u["loc"] not in existing_locs]
    print(f"추가할 신규 URL 수: {len(filtered_urls)}개")
    skipped = len(new_urls) - len(filtered_urls)
    if skipped > 0:
        print(f"중복으로 제외된 URL 수: {skipped}개")

    if not filtered_urls:
        print("\n추가할 URL이 없습니다. 종료합니다.")
        return

    # 새 URL 블록 생성
    new_url_blocks = ""
    for u in filtered_urls:
        new_url_blocks += f"""  <url>
    <loc>{u['loc']}</loc>
    <lastmod>{u['lastmod']}</lastmod>
    <changefreq>{u['changefreq']}</changefreq>
    <priority>{u['priority']}</priority>
  </url>\n"""

    # </urlset> 바로 앞에 삽입
    updated_content = existing_content.replace("</urlset>", new_url_blocks + "</urlset>")

    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write(updated_content)

    print(f"\n✅ sitemap.xml 업데이트 완료!")
    print(f"   - 칼럼: {len([u for u in filtered_urls if '/guide/' in u['loc']])}개 추가")
    print(f"   - 꿈해몽: {len([u for u in filtered_urls if '/dream/' in u['loc']])}개 추가")
    print(f"   - 운세사전: {len([u for u in filtered_urls if '/dictionary/' in u['loc']])}개 추가")

    # 결과 검증
    with open(sitemap_path, "r", encoding="utf-8") as f:
        final_content = f.read()
    final_locs = re.findall(r"<loc>(.*?)</loc>", final_content)
    print(f"\n최종 sitemap URL 총 수: {len(final_locs)}개")

    # 중복 검사
    if len(final_locs) != len(set(final_locs)):
        dupes = [loc for loc in final_locs if final_locs.count(loc) > 1]
        print(f"⚠️  중복 URL 발견: {set(dupes)}")
    else:
        print("✅ 중복 URL 없음 확인 완료")

if __name__ == "__main__":
    main()
