#!/usr/bin/env python3
"""
Supabase Management API를 통해 RLS 정책 SQL을 production DB에 적용합니다.
curl subprocess 방식으로 Python urllib 이슈를 우회합니다.
"""
import json
import subprocess
import sys

# PAT는 환경변수 SUPABASE_MGMT_PAT 또는 인자로 전달하세요
import os
PAT = os.environ.get("SUPABASE_MGMT_PAT", "")
PROJECT_REF = "vuifbmsdggnwygvgcrkj"
API_URL = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"

# 적용할 RLS SQL
RLS_SQL = """
begin;

alter table public.fortune_dictionary enable row level security;
revoke all on table public.fortune_dictionary from anon, authenticated;

drop policy if exists "Allow public read" on public.dreams;
drop policy if exists "Allow service_role insert" on public.dreams;
drop policy if exists "Allow service_role update" on public.dreams;
revoke all on table public.dreams from anon, authenticated;

drop policy if exists "Allow all featured_columns" on public.featured_columns;
drop policy if exists "Public read featured_columns" on public.featured_columns;
revoke all on table public.featured_columns from anon, authenticated;

drop policy if exists "Public can read published columns" on public.columns;
drop policy if exists "Allow all for authenticated users" on public.columns;
revoke all on table public.columns from anon, authenticated;

revoke select on table public.naming_history from anon, authenticated;

revoke all on all sequences in schema public from anon, authenticated;

commit;
"""


def run_query_curl(sql, read_only=False):
    payload = json.dumps({"query": sql, "read_only": read_only})
    result = subprocess.run(
        ["curl", "-s", "-w", "\n%{http_code}", "-X", "POST",
         "-H", f"Authorization: Bearer {PAT}",
         "-H", "Content-Type: application/json",
         "-d", payload,
         API_URL],
        capture_output=True, text=True, timeout=60
    )
    lines = result.stdout.strip().rsplit('\n', 1)
    body = lines[0] if len(lines) >= 1 else ""
    status = int(lines[1]) if len(lines) >= 2 else 0
    try:
        return status, json.loads(body)
    except Exception:
        return status, {"raw": body}


print("=" * 60)
print("무운사주 Supabase RLS 정책 적용")
print("=" * 60)

# [1] 적용 전 상태 확인
print("\n[1] 적용 전 RLS 상태 확인...")
status, result = run_query_curl(
    "select relname as table_name, relrowsecurity as rls_enabled "
    "from pg_class c join pg_namespace n on n.oid = c.relnamespace "
    "where n.nspname = 'public' and c.relkind = 'r' order by relname",
    read_only=True
)
if isinstance(result, list):
    for row in result:
        rls = "✅ ON" if row["rls_enabled"] else "❌ OFF"
        print(f"  {row['table_name']}: {rls}")
else:
    print(f"  오류 (HTTP {status}): {result}")
    sys.exit(1)

# [2] RLS 정책 적용
print("\n[2] RLS 정책 적용 중...")
status, result = run_query_curl(RLS_SQL, read_only=False)
if status == 201:
    print("  ✅ RLS 정책 적용 성공!")
else:
    print(f"  ❌ 오류 (HTTP {status}): {result}")
    sys.exit(1)

# [3] 적용 후 RLS 상태 확인
print("\n[3] 적용 후 RLS 상태 확인...")
status, result = run_query_curl(
    "select relname as table_name, relrowsecurity as rls_enabled "
    "from pg_class c join pg_namespace n on n.oid = c.relnamespace "
    "where n.nspname = 'public' and c.relkind = 'r' order by relname",
    read_only=True
)
if isinstance(result, list):
    for row in result:
        rls = "✅ ON" if row["rls_enabled"] else "❌ OFF"
        print(f"  {row['table_name']}: {rls}")
else:
    print(f"  오류: {result}")

# [4] 적용 후 정책 목록 확인
print("\n[4] 적용 후 RLS 정책 목록...")
status, result = run_query_curl(
    "select tablename, policyname, roles, cmd "
    "from pg_policies where schemaname = 'public' order by tablename, policyname",
    read_only=True
)
if isinstance(result, list):
    for row in result:
        print(f"  {row['tablename']}: [{row['cmd']}] {row['policyname']} (roles={row['roles']})")
else:
    print(f"  오류: {result}")

# [5] anon/authenticated 권한 확인 (보호 테이블)
print("\n[5] 보호 테이블 anon/authenticated 권한 확인...")
status, result = run_query_curl(
    "select grantee, table_name, privilege_type "
    "from information_schema.role_table_grants "
    "where table_schema = 'public' and grantee in ('anon', 'authenticated') "
    "and table_name in ('dreams', 'fortune_dictionary', 'columns', 'featured_columns') "
    "order by table_name, grantee, privilege_type",
    read_only=True
)
if isinstance(result, list):
    if result:
        print("  ⚠️  아직 권한이 남아있는 항목:")
        for row in result:
            print(f"    {row['grantee']} → {row['table_name']}: {row['privilege_type']}")
    else:
        print("  ✅ dreams, fortune_dictionary, columns, featured_columns에 anon/authenticated 권한 없음")
else:
    print(f"  오류: {result}")

# [6] hanja_dictionary, naming_history 권한 확인 (유지 확인)
print("\n[6] hanja_dictionary, naming_history 권한 확인 (유지 여부)...")
status, result = run_query_curl(
    "select grantee, table_name, privilege_type "
    "from information_schema.role_table_grants "
    "where table_schema = 'public' and grantee in ('anon', 'authenticated') "
    "and table_name in ('hanja_dictionary', 'naming_history') "
    "order by table_name, grantee, privilege_type",
    read_only=True
)
if isinstance(result, list):
    for row in result:
        print(f"  {row['grantee']} → {row['table_name']}: {row['privilege_type']}")
    if not result:
        print("  (권한 없음 - hanja_dictionary는 RLS 정책으로 접근 허용)")
else:
    print(f"  오류: {result}")

print("\n" + "=" * 60)
print("RLS 정책 적용 완료")
print("=" * 60)
