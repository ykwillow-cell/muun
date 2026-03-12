"""
sitemap.xml의 기존 /dream/ 항목을 전부 제거하고
현재 DB(service_role)의 발행된 꿈해몽 슬러그로 새로 채우는 스크립트
"""

import requests
import re
from datetime import date

SUPABASE_URL = "https://vuifbmsdggnwygvgcrkj.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTg3NjQ4NiwiZXhwIjoyMDg3NDUyNDg2fQ.PBZ8Mv6m6U89JHe7xS70XhL5k0V_7NjM9f-lpd3YYhw"

HEADERS = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
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
    # 1. DB에서 발행된 꿈해몽 전체 조회
    print("DB에서 꿈해몽 전체 수집 중...")
    dreams = fetch_all_rows(
        "dreams",
        "id,slug,published_at",
        {"published": "eq.true"},
    )
    print(f"  → DB 총 {len(dreams)}개")

    # 고유 슬러그만 추출 (중복 슬러그는 published_at 최신 것 우선)
    slug_map = {}
    for d in dreams:
        slug = d.get("slug") or str(d["id"])
        existing = slug_map.get(slug)
        if not existing:
            slug_map[slug] = d
        else:
            # 최신 published_at 우선
            existing_date = existing.get("published_at") or ""
            new_date = d.get("published_at") or ""
            if new_date > existing_date:
                slug_map[slug] = d

    print(f"  → 고유 슬러그 {len(slug_map)}개")

    # 2. 현재 sitemap 읽기
    with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
        sitemap_content = f.read()

    # 기존 /dream/ URL 블록 전체 제거
    # <url>...</url> 블록 단위로 파싱
    url_blocks = re.findall(r"  <url>.*?  </url>", sitemap_content, re.DOTALL)
    non_dream_blocks = []
    removed_count = 0
    for block in url_blocks:
        loc_match = re.search(r"<loc>(.*?)</loc>", block)
        if loc_match and "/dream/" in loc_match.group(1):
            removed_count += 1
        else:
            non_dream_blocks.append(block)

    print(f"\n기존 /dream/ 블록 제거: {removed_count}개")
    print(f"남은 비-dream 블록: {len(non_dream_blocks)}개")

    # 3. 새 /dream/ 블록 생성 (published_at 최신순 정렬)
    sorted_slugs = sorted(
        slug_map.items(),
        key=lambda x: x[1].get("published_at") or "",
        reverse=True,
    )

    new_dream_blocks = []
    for slug, data in sorted_slugs:
        lastmod = (data.get("published_at") or TODAY)[:10]
        new_dream_blocks.append(
            f"  <url>\n    <loc>{BASE_URL}/dream/{slug}</loc>\n    <lastmod>{lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>"
        )

    print(f"새로 추가할 /dream/ 블록: {len(new_dream_blocks)}개")

    # 4. 헤더 추출
    header_match = re.match(r"(.*?<urlset[^>]*>)", sitemap_content, re.DOTALL)
    header = header_match.group(1) if header_match else '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

    # 5. 새 sitemap 조합: 비-dream 블록 + 새 dream 블록
    all_blocks = non_dream_blocks + new_dream_blocks
    new_content = header + "\n" + "\n".join(all_blocks) + "\n</urlset>\n"

    with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    # 6. 최종 검증
    with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
        final = f.read()
    final_locs = re.findall(r"<loc>(.*?)</loc>", final)
    final_dream = [l for l in final_locs if "/dream/" in l]
    final_guide = [l for l in final_locs if "/guide/" in l]
    final_dict = [l for l in final_locs if "/dictionary/" in l]
    final_other = [l for l in final_locs if "/dream/" not in l and "/guide/" not in l and "/dictionary/" not in l]

    print(f"\n✅ sitemap.xml 재구성 완료!")
    print(f"   꿈해몽 (/dream/): {len(final_dream)}개")
    print(f"   칼럼 (/guide/): {len(final_guide)}개")
    print(f"   운세사전 (/dictionary/): {len(final_dict)}개")
    print(f"   기타 (메인 등): {len(final_other)}개")
    print(f"   전체 URL: {len(final_locs)}개")

    if len(final_locs) == len(set(final_locs)):
        print("✅ 중복 URL 없음 확인 완료")
    else:
        dupes = [l for l in set(final_locs) if final_locs.count(l) > 1]
        print(f"⚠️  중복 URL {len(dupes)}개: {dupes[:3]}")


if __name__ == "__main__":
    main()
