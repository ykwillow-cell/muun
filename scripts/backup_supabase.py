"""
Supabase DB 전체 백업 스크립트
- columns, dreams, fortune_dictionary 테이블을 JSON으로 백업
- backups/YYYY-MM-DD/ 폴더에 저장
- 최근 30일치 백업만 보관 (오래된 것 자동 삭제)
"""

import requests
import json
import os
import shutil
from datetime import date, timedelta
from pathlib import Path

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://vuifbmsdggnwygvgcrkj.supabase.co")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
}

TABLES = [
    "columns",
    "dreams",
    "fortune_dictionary",
]

BACKUP_ROOT = Path("backups")
KEEP_DAYS = 30  # 보관 기간


def fetch_all(table: str) -> list:
    rows, offset = [], 0
    while True:
        params = {"select": "*", "limit": 1000, "offset": offset}
        resp = requests.get(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers=HEADERS,
            params=params,
        )
        resp.raise_for_status()
        data = resp.json()
        if not data:
            break
        rows.extend(data)
        if len(data) < 1000:
            break
        offset += 1000
    return rows


def main():
    today = date.today().isoformat()
    backup_dir = BACKUP_ROOT / today
    backup_dir.mkdir(parents=True, exist_ok=True)

    print(f"=== Supabase DB 백업 시작: {today} ===\n")

    summary = {}
    for table in TABLES:
        print(f"[{table}] 수집 중...")
        rows = fetch_all(table)
        out_path = backup_dir / f"{table}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(rows, f, ensure_ascii=False, indent=2)
        summary[table] = len(rows)
        print(f"  → {len(rows)}개 저장: {out_path}")

    # 요약 파일 저장
    summary_path = backup_dir / "summary.json"
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump({"date": today, "tables": summary}, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 백업 완료!")
    for table, count in summary.items():
        print(f"   {table}: {count}개")

    # 오래된 백업 삭제 (30일 초과)
    cutoff = date.today() - timedelta(days=KEEP_DAYS)
    deleted = []
    if BACKUP_ROOT.exists():
        for d in BACKUP_ROOT.iterdir():
            if d.is_dir():
                try:
                    folder_date = date.fromisoformat(d.name)
                    if folder_date < cutoff:
                        shutil.rmtree(d)
                        deleted.append(d.name)
                except ValueError:
                    pass

    if deleted:
        print(f"\n🗑️  오래된 백업 삭제: {', '.join(deleted)}")
    else:
        print(f"\n보관 기간({KEEP_DAYS}일) 초과 백업 없음")


if __name__ == "__main__":
    main()
