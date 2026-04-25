"""
sitemap.xml에서 중복 URL을 제거하고 깔끔하게 정리하는 스크립트
- 중복이 있을 경우 첫 번째 항목만 유지
- URL 블록 단위로 파싱하여 처리
"""

import re
from datetime import date

SITEMAP_PATH = "/home/ubuntu/muun/client/public/sitemap.xml"

def main():
    with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # <url>...</url> 블록 전체를 추출
    url_blocks = re.findall(r"<url>.*?</url>", content, re.DOTALL)
    print(f"전체 URL 블록 수: {len(url_blocks)}개")

    # 중복 제거 (loc 기준, 첫 번째 항목 유지)
    seen_locs = set()
    unique_blocks = []
    duplicate_count = 0

    for block in url_blocks:
        loc_match = re.search(r"<loc>(.*?)</loc>", block)
        if not loc_match:
            continue
        loc = loc_match.group(1).strip()
        if loc in seen_locs:
            duplicate_count += 1
        else:
            seen_locs.add(loc)
            unique_blocks.append(block)

    print(f"중복 제거: {duplicate_count}개")
    print(f"고유 URL 수: {len(unique_blocks)}개")

    # 새 sitemap 생성
    # 헤더 부분 추출 (<?xml ... ?> 및 <urlset ...>)
    header_match = re.match(r"(.*?<urlset[^>]*>)", content, re.DOTALL)
    header = header_match.group(1) if header_match else '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

    # 각 블록을 2-space 들여쓰기로 정규화
    normalized_blocks = []
    for block in unique_blocks:
        # 블록 내 각 줄의 앞뒤 공백 정리
        lines = block.strip().splitlines()
        normalized = "\n".join("  " + line.strip() if line.strip() else "" for line in lines)
        normalized_blocks.append(normalized)

    new_content = header + "\n" + "\n".join(normalized_blocks) + "\n</urlset>\n"

    with open(SITEMAP_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    # 최종 검증
    with open(SITEMAP_PATH, "r", encoding="utf-8") as f:
        final = f.read()
    final_locs = re.findall(r"<loc>(.*?)</loc>", final)
    print(f"\n✅ sitemap.xml 정리 완료!")
    print(f"   최종 총 URL 수: {len(final_locs)}개")

    # 카테고리별 집계
    guide_count = sum(1 for l in final_locs if "/guide/" in l)
    dream_count = sum(1 for l in final_locs if "/dream/" in l)
    dict_count = sum(1 for l in final_locs if "/dictionary/" in l)
    other_count = len(final_locs) - guide_count - dream_count - dict_count
    print(f"   - 칼럼 (/guide/): {guide_count}개")
    print(f"   - 꿈해몽 (/dream/): {dream_count}개")
    print(f"   - 운세사전 (/dictionary/): {dict_count}개")
    print(f"   - 기타 (메인 페이지 등): {other_count}개")

    if len(final_locs) == len(set(final_locs)):
        print("✅ 중복 URL 없음 확인 완료")
    else:
        dupes = [l for l in set(final_locs) if final_locs.count(l) > 1]
        print(f"⚠️  중복 URL {len(dupes)}개 여전히 존재")

if __name__ == "__main__":
    main()
