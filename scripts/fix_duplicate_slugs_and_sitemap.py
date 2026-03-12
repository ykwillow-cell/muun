"""
1. DB에서 중복 슬러그를 가진 꿈해몽을 찾아 slug를 고유하게 수정 (slug-2, slug-3 형태)
2. sitemap.xml의 /dream/ 항목을 513개 전부로 교체
"""

import requests
import re
from datetime import date
from collections import defaultdict

SUPABASE_URL = "https://vuifbmsdggnwygvgcrkj.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aWZibXNkZ2dud3lndmdjcmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTg3NjQ4NiwiZXhwIjoyMDg3NDUyNDg2fQ.PBZ8Mv6m6U89JHe7xS70XhL5k0V_7NjM9f-lpd3YYhw"

HEADERS = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
}

BASE_URL = "https://muunsaju.com"
TODAY = date.today().isoformat()
SITEMAP_PATH = "/home/ubuntu/muun/client/public/sitemap.xml"


def fetch_all_dreams():
    rows, offset = [], 0
    while True:
        params = {"select": "id,slug,published_at", "published": "eq.true", "limit": 1000, "offset": offset}
        r = requests.get(f"{SUPABASE_URL}/rest/v1/dreams", headers=HEADERS, params=params)
        r.raise_for_status()
        data = r.json()
        if not data:
            break
        rows.extend(data)
        if len(data) < 1000:
            break
        offset += 1000
    return rows


def update_slug(dream_id, new_slug):
    r = requests.patch(
        f"{SUPABASE_URL}/rest/v1/dreams",
        headers={**HEADERS, "Prefer": "return=representation"},
        params={"id": f"eq.{dream_id}"},
        json={"slug": new_slug},
    )
    r.raise_for_status()
    return r.json()


def main():
    print("=== DB 꿈해몽 전체 수집 ===")
    dreams = fetch_all_dreams()
    print(f"총 {len(dreams)}개 수집\n")

    # 슬러그별 그룹핑 (created_at/published_at 기준 정렬 - 첫 번째는 원본 유지)
    slug_groups = defaultdict(list)
    for d in dreams:
        slug = d.get("slug") or str(d["id"])
        slug_groups[slug].append(d)

    dupes = {slug: items for slug, items in slug_groups.items() if len(items) > 1}
    print(f"중복 슬러그: {len(dupes)}개 (중복 항목 수: {sum(len(v)-1 for v in dupes.values())}개)\n")

    # 중복 슬러그 수정: 첫 번째는 원본 유지, 나머지는 -2, -3 ... 붙이기
    updated_dreams = []  # (id, new_slug, published_at)
    fix_count = 0

    for slug, items in dupes.items():
        # published_at 기준 오름차순 정렬 (가장 오래된 것이 원본)
        sorted_items = sorted(items, key=lambda x: x.get("published_at") or "")
        for i, item in enumerate(sorted_items):
            if i == 0:
                # 원본 유지
                updated_dreams.append((item["id"], slug, item.get("published_at")))
                continue
            # 새 슬러그 생성
            new_slug = f"{slug}-{i+1}"
            # 이미 존재하는 슬러그와 충돌 방지
            while new_slug in slug_groups and new_slug != slug:
                new_slug = f"{new_slug}-x"
            print(f"  수정: {slug} → {new_slug} (id: {item['id'][:8]}...)")
            update_slug(item["id"], new_slug)
            updated_dreams.append((item["id"], new_slug, item.get("published_at")))
            fix_count += 1

    # 중복 없는 항목들도 추가
    for slug, items in slug_groups.items():
        if len(items) == 1:
            item = items[0]
            updated_dreams.append((item["id"], slug, item.get("published_at")))

    print(f"\nDB 슬러그 수정 완료: {fix_count}개")
    print(f"전체 고유 슬러그: {len(updated_dreams)}개\n")

    # sitemap 재구성
    with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
        sitemap_content = f.read()

    # 기존 /dream/ 블록 전체 제거
    url_blocks = re.findall(r"  <url>.*?  </url>", sitemap_content, re.DOTALL)
    non_dream_blocks = []
    removed = 0
    for block in url_blocks:
        loc_match = re.search(r"<loc>(.*?)</loc>", block)
        if loc_match and "/dream/" in loc_match.group(1):
            removed += 1
        else:
            non_dream_blocks.append(block)

    print(f"기존 /dream/ 블록 제거: {removed}개")

    # 새 /dream/ 블록 생성 (published_at 최신순)
    sorted_dreams = sorted(updated_dreams, key=lambda x: x[2] or "", reverse=True)
    new_dream_blocks = []
    for dream_id, slug, published_at in sorted_dreams:
        lastmod = (published_at or TODAY)[:10]
        new_dream_blocks.append(
            f"  <url>\n    <loc>{BASE_URL}/dream/{slug}</loc>\n    <lastmod>{lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>"
        )

    print(f"새 /dream/ 블록 추가: {len(new_dream_blocks)}개")

    # 헤더 추출
    header_match = re.match(r"(.*?<urlset[^>]*>)", sitemap_content, re.DOTALL)
    header = header_match.group(1) if header_match else '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

    all_blocks = non_dream_blocks + new_dream_blocks
    new_content = header + "\n" + "\n".join(all_blocks) + "\n</urlset>\n"

    with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    # 최종 검증
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
    print(f"   기타: {len(final_other)}개")
    print(f"   전체 URL: {len(final_locs)}개")

    if len(final_locs) == len(set(final_locs)):
        print("✅ 중복 URL 없음 확인 완료")
    else:
        dupes_url = [l for l in set(final_locs) if final_locs.count(l) > 1]
        print(f"⚠️  중복 URL {len(dupes_url)}개: {dupes_url[:3]}")


if __name__ == "__main__":
    main()
