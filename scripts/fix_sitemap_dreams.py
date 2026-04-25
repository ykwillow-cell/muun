"""
sitemap.xml의 /dream/ UUID 슬러그를 실제 영문 슬러그로 교체하고,
누락된 꿈해몽 URL을 추가하는 스크립트
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

def is_uuid(s):
    return bool(re.match(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', s, re.I))

def main():
    # DB에서 전체 꿈해몽 조회 (id, slug, published_at)
    print("DB에서 꿈해몽 데이터 수집 중...")
    dreams = fetch_all_rows("dreams", "id,slug,published_at", {"published": "eq.true"})
    print(f"  → {len(dreams)}개 수집")

    # id → {slug, published_at} 매핑
    id_to_dream = {}
    slug_to_dream = {}
    for d in dreams:
        id_to_dream[str(d["id"])] = d
        slug = d.get("slug") or str(d["id"])
        slug_to_dream[slug] = d

    with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
        sitemap_content = f.read()

    # sitemap에서 /dream/ URL 전체 추출
    all_locs = re.findall(r"<loc>(.*?)</loc>", sitemap_content)
    dream_locs = [loc for loc in all_locs if "/dream/" in loc]
    print(f"\nsitemap /dream/ URL 수: {len(dream_locs)}개")

    # UUID 슬러그인 것들 찾기
    uuid_locs = []
    for loc in dream_locs:
        slug = loc.split("/dream/")[-1].rstrip("/")
        if is_uuid(slug):
            uuid_locs.append((loc, slug))

    print(f"UUID 형식 슬러그: {len(uuid_locs)}개")

    # UUID 슬러그를 실제 영문 슬러그로 교체
    replaced_count = 0
    already_correct = 0
    not_found = 0
    updated_content = sitemap_content

    for old_loc, uuid in uuid_locs:
        dream_data = id_to_dream.get(uuid)
        if not dream_data:
            print(f"  ⚠️  UUID {uuid}에 해당하는 DB 항목 없음 (삭제된 콘텐츠)")
            not_found += 1
            continue

        real_slug = dream_data.get("slug")
        if not real_slug or real_slug == uuid:
            # slug가 없거나 UUID와 동일하면 그대로 유지
            already_correct += 1
            continue

        new_loc = f"{BASE_URL}/dream/{real_slug}"
        if new_loc == old_loc:
            already_correct += 1
            continue

        # 교체 (URL 블록 전체에서 old_loc를 new_loc로)
        updated_content = updated_content.replace(
            f"<loc>{old_loc}</loc>",
            f"<loc>{new_loc}</loc>"
        )
        replaced_count += 1

    print(f"UUID → 영문 슬러그 교체: {replaced_count}개")
    print(f"이미 올바른 슬러그: {already_correct}개")
    print(f"DB에 없는 UUID: {not_found}개")

    # 교체 후 현재 sitemap의 /dream/ 슬러그 목록 재계산
    current_dream_slugs = set()
    for loc in re.findall(r"<loc>(.*?)</loc>", updated_content):
        if "/dream/" in loc:
            slug = loc.split("/dream/")[-1].rstrip("/")
            current_dream_slugs.add(slug)

    # 누락된 슬러그 찾기
    missing = []
    for slug, data in slug_to_dream.items():
        if slug not in current_dream_slugs:
            missing.append({
                "loc": f"{BASE_URL}/dream/{slug}",
                "lastmod": (data.get("published_at") or TODAY)[:10],
            })

    print(f"\n누락된 꿈해몽 URL: {len(missing)}개")
    if missing:
        for m in missing[:10]:
            print(f"  - {m['loc']}")
        if len(missing) > 10:
            print(f"  ... 외 {len(missing)-10}개")

    # 누락 항목 추가
    if missing:
        new_blocks = ""
        for u in missing:
            new_blocks += f"""  <url>
    <loc>{u['loc']}</loc>
    <lastmod>{u['lastmod']}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n"""
        updated_content = updated_content.replace("</urlset>", new_blocks + "</urlset>")

    # 저장
    with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
        f.write(updated_content)

    # 최종 검증
    with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
        final = f.read()
    final_locs = re.findall(r"<loc>(.*?)</loc>", final)
    final_dream_locs = [l for l in final_locs if "/dream/" in l]
    print(f"\n✅ sitemap.xml 업데이트 완료!")
    print(f"   /dream/ URL 수: {len(final_dream_locs)}개 (DB 발행: {len(dreams)}개)")
    print(f"   전체 URL 수: {len(final_locs)}개")

    # 중복 검사
    if len(final_locs) == len(set(final_locs)):
        print("✅ 중복 URL 없음 확인 완료")
    else:
        dupes = [l for l in set(final_locs) if final_locs.count(l) > 1]
        print(f"⚠️  중복 URL {len(dupes)}개 발견: {dupes[:5]}")

if __name__ == "__main__":
    main()
