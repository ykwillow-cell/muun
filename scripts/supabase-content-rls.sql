-- 무운사주 공개 콘텐츠 테이블 보호 정책
-- 적용 전 Vercel Production 환경변수 SUPABASE_SERVICE_ROLE_KEY 설정을 확인하세요.
-- 공개 웹은 정적 CDN 콘텐츠만 사용하고, 콘텐츠 갱신/SEO 빌드는 service role로 수행합니다.

begin;

-- 공개 anon/authenticated 역할은 더 이상 원본 콘텐츠 테이블을 직접 읽지 않습니다.
-- service_role은 Supabase의 BYPASSRLS 권한으로 백업·빌드·관리 작업을 계속 수행합니다.
alter table public.dreams enable row level security;
alter table public.fortune_dictionary enable row level security;
alter table public.columns enable row level security;
alter table public.featured_columns enable row level security;

revoke all on table public.dreams from anon, authenticated;
revoke all on table public.fortune_dictionary from anon, authenticated;
revoke all on table public.columns from anon, authenticated;
revoke all on table public.featured_columns from anon, authenticated;

-- 공개 역할이 기존에 부여받았을 수 있는 sequence 사용 권한도 제거합니다.
revoke all on all sequences in schema public from anon, authenticated;

commit;

-- 적용 후 확인용 쿼리
-- select relname, relrowsecurity
-- from pg_class
-- where relname in ('dreams', 'fortune_dictionary', 'columns', 'featured_columns');
--
-- select grantee, table_name, privilege_type
-- from information_schema.role_table_grants
-- where table_schema = 'public'
--   and table_name in ('dreams', 'fortune_dictionary', 'columns', 'featured_columns')
-- order by table_name, grantee;
