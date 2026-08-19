-- ============================================================
-- 무운사주 Supabase RLS 최소 권한 정책 (최종 확정)
-- 작성일: 2026-08-19
-- 근거: Management API 직접 감사 결과 반영
--
-- [현재 상태 감사 결과]
-- fortune_dictionary: RLS 비활성화 (Error)
-- dreams: "Allow public read" USING(true) SELECT 정책 존재 (공개 노출)
--         "Allow service_role insert/update" - INSERT/UPDATE 정책도 {public}으로 설정
-- featured_columns: "Allow all featured_columns" ALL USING(true) 정책 존재
--                   "Public read featured_columns" SELECT USING(true) 정책 존재
-- columns: "Public can read published columns" SELECT USING(published=true) - 조건부 공개
--          "Allow all for authenticated users" ALL USING(true) - 인증 사용자 전체 허용
-- column_data: "Allow all for authenticated users" ALL USING(true) - 인증 사용자 전체 허용
-- design_themes: "Allow all for service role" ALL USING(true) - 전체 허용 (이름과 다름)
-- banners: "banners_public_read" SELECT USING(true) - 공개 읽기 (의도적)
--          "banners_auth_write" ALL USING(auth.role()='authenticated') - 인증 쓰기
-- hanja_dictionary: "Enable read access for all users" + "read_all" SELECT USING(true) - 의도적 공개
-- naming_history: "Enable insert for all users" INSERT - 의도적 공개 INSERT
--
-- [설계 원칙]
-- 1. dreams, fortune_dictionary, columns, featured_columns:
--    SEO 빌드는 service_role(BYPASSRLS)로 접근 → anon 접근 완전 차단
-- 2. hanja_dictionary: 클라이언트 직접 조회 → anon SELECT 유지
-- 3. naming_history: 비회원 INSERT → anon INSERT 유지
-- 4. banners, design_themes, column_data: UI 렌더링 필요 → 현재 상태 유지
-- ============================================================

begin;

-- ============================================================
-- 1. fortune_dictionary: RLS 활성화 (현재 완전 비활성화 상태)
--    anon/authenticated 접근 차단, service_role(BYPASSRLS)만 접근
-- ============================================================
alter table public.fortune_dictionary enable row level security;
-- anon, authenticated 역할의 모든 테이블 권한 제거
revoke all on table public.fortune_dictionary from anon, authenticated;

-- ============================================================
-- 2. dreams: 공개 접근 정책 제거 후 anon 접근 차단
--    현재 정책: "Allow public read" (SELECT USING true)
--              "Allow service_role insert" (INSERT, {public})
--              "Allow service_role update" (UPDATE, {public})
-- ============================================================
-- 공개 SELECT 정책 제거
drop policy if exists "Allow public read" on public.dreams;
-- INSERT/UPDATE 정책도 {public}이므로 anon이 접근 가능 → 제거
-- (service_role은 BYPASSRLS이므로 정책 없이도 접근 가능)
drop policy if exists "Allow service_role insert" on public.dreams;
drop policy if exists "Allow service_role update" on public.dreams;
-- anon, authenticated 역할의 모든 테이블 권한 제거
revoke all on table public.dreams from anon, authenticated;

-- ============================================================
-- 3. featured_columns: 과도한 공개 정책 제거 후 anon 접근 차단
--    현재 정책: "Allow all featured_columns" (ALL USING true)
--              "Public read featured_columns" (SELECT USING true)
-- ============================================================
drop policy if exists "Allow all featured_columns" on public.featured_columns;
drop policy if exists "Public read featured_columns" on public.featured_columns;
revoke all on table public.featured_columns from anon, authenticated;

-- ============================================================
-- 4. columns: 공개 SELECT 정책 제거 후 anon 접근 차단
--    현재 정책: "Public can read published columns" (SELECT USING published=true)
--              "Allow all for authenticated users" (ALL USING true)
--    → SEO 빌드는 service_role로 접근, 공개 웹은 정적 CDN 사용
-- ============================================================
drop policy if exists "Public can read published columns" on public.columns;
drop policy if exists "Allow all for authenticated users" on public.columns;
revoke all on table public.columns from anon, authenticated;

-- ============================================================
-- 5. naming_history: INSERT는 유지, SELECT는 차단 (이미 SELECT 정책 없음)
--    현재 정책: "Enable insert for all users" (INSERT) - 유지
--    anon의 SELECT 권한만 확인 후 제거
-- ============================================================
-- INSERT 정책은 유지, SELECT 권한만 제거
revoke select on table public.naming_history from anon, authenticated;

-- ============================================================
-- 6. sequence 권한 정리
-- ============================================================
revoke all on all sequences in schema public from anon, authenticated;

commit;

-- ============================================================
-- [적용 후 검증 쿼리]
-- ============================================================
/*
-- RLS 활성화 상태 확인
select relname as table_name, relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by relname;

-- anon/authenticated 권한 확인
select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon', 'authenticated')
order by table_name, grantee, privilege_type;

-- 현재 RLS 정책 목록
select schemaname, tablename, policyname, roles, cmd, qual
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
*/
