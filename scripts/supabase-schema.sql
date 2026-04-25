-- ============================================================
-- 무운 작명소 - Supabase DB 스키마
-- 실행 위치: Supabase 대시보드 > SQL Editor
-- ============================================================

-- 1. 한자 사전 테이블 (대법원 인명용 한자 5,382자)
-- 정적 읽기 전용 데이터 - 수정 불필요
CREATE TABLE IF NOT EXISTS public.hanja_dictionary (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hanja      VARCHAR(10)  NOT NULL,
  hangul     VARCHAR(10)  NOT NULL,
  strokes    INTEGER      NOT NULL,
  element    VARCHAR(10)  NOT NULL,  -- 자원오행: 목 | 화 | 토 | 금 | 수
  meaning    TEXT         NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 검색 성능 최적화 인덱스
CREATE INDEX IF NOT EXISTS idx_hanja_strokes  ON public.hanja_dictionary (strokes);
CREATE INDEX IF NOT EXISTS idx_hanja_element  ON public.hanja_dictionary (element);
CREATE INDEX IF NOT EXISTS idx_hanja_combined ON public.hanja_dictionary (strokes, element);

-- RLS: 누구나 읽기 가능 (Anon Key로 프론트엔드에서 직접 조회)
ALTER TABLE public.hanja_dictionary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users"
  ON public.hanja_dictionary FOR SELECT
  USING (true);


-- 2. 작명 이력 테이블
-- 통계 목적 및 Supabase 무료 플랜 일시 중지 방지(핑) 겸용
CREATE TABLE IF NOT EXISTS public.naming_history (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_name   VARCHAR(10)  NOT NULL,
  selected_name VARCHAR(20)  NOT NULL,
  english_name  VARCHAR(50),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: 누구나 INSERT 가능 (비회원 서비스)
ALTER TABLE public.naming_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for all users"
  ON public.naming_history FOR INSERT
  WITH CHECK (true);

-- 통계 조회용: 서비스 관리자만 SELECT 가능 (Supabase 대시보드에서 직접 조회)
-- 필요 시 아래 정책 추가:
-- CREATE POLICY "Enable read for service_role"
--   ON public.naming_history FOR SELECT
--   USING (auth.role() = 'service_role');
