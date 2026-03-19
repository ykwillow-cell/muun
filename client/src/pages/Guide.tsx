import { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, Search, Check, ChevronDown } from 'lucide-react';
import { getAllColumns, COLUMN_CATEGORIES, ColumnData } from '@/lib/column-data-api';

// ── 카테고리 칩 목록 (와이어프레임 기준 순서) ──
const CHIP_CATEGORIES = [
  { id: null,           label: '전체' },
  { id: 'luck',         label: '개운법' },
  { id: 'basic',        label: '사주 기초' },
  { id: 'relationship', label: '관계 & 궁합' },
  { id: 'health',       label: '건강 & 운' },
  { id: 'money',        label: '재물운' },
  { id: 'flow',         label: '운명의 흐름' },
  { id: 'career',       label: '취업 & 커리어' },
  { id: 'love',         label: '연애 & 결혼' },
  { id: 'family',       label: '가족 & 자녀' },
];

// ── 카테고리별 칩 색상 (라이트 파스텔) ──
const CHIP_COLORS: Record<string, string> = {
  luck:         'bg-[#FFF8E1] text-[#B8860B]',
  basic:        'bg-[#E3F2FD] text-[#1565C0]',
  relationship: 'bg-[#FCE4EC] text-[#C2185B]',
  health:       'bg-[#E8F5E9] text-[#2E7D32]',
  money:        'bg-[#F3E5F5] text-[#7B1FA2]',
  flow:         'bg-[#E8EAF6] text-[#3949AB]',
  career:       'bg-[#FFF3E0] text-[#E65100]',
  love:         'bg-[#FCE4EC] text-[#AD1457]',
  family:       'bg-[#E0F2F1] text-[#00695C]',
};

// ── 날짜 포맷 헬퍼 ──
function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day   = d.getDate();
  return `${month}월 ${day}일`;
}

const PAGE_SIZE = 10;

export default function Guide() {
  useCanonical('/guide');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allColumns, setAllColumns]             = useState<ColumnData[]>([]);
  const [isLoading, setIsLoading]               = useState(true);
  const [searchQuery, setSearchQuery]           = useState('');
  const [sortOrder, setSortOrder]               = useState<'newest' | 'oldest'>('newest');
  const [showSortMenu, setShowSortMenu]         = useState(false);
  const [visibleCount, setVisibleCount]         = useState(PAGE_SIZE);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const cols = await getAllColumns();
      setAllColumns(cols);
      setIsLoading(false);
    })();
  }, []);

  // 필터 + 검색 + 정렬
  const filtered = useMemo(() => {
    let list = selectedCategory
      ? allColumns.filter(c => c.category === selectedCategory)
      : allColumns;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.categoryLabel.toLowerCase().includes(q)
      );
    }

    if (sortOrder === 'oldest') {
      list = [...list].reverse();
    }

    return list;
  }, [allColumns, selectedCategory, searchQuery, sortOrder]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore   = visibleCount < filtered.length;

  // 카테고리 변경 시 페이지 리셋
  const handleCategoryChange = (id: string | null) => {
    setSelectedCategory(id);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="min-h-screen bg-[#F7F7FA]">
      <Helmet>
        <title>운세 칼럼 - 사주 전문가의 깊이 있는 운세 이야기 | 무운 (MuUn)</title>
        <meta name="description" content="사주 기초부터 개운법, 재물운, 자녀운, 인연까지. 40대 여성을 위한 깊이 있는 사주 칼럼을 회원가입 없이 100% 무료로 읽어보세요." />
        <meta name="keywords" content="사주칼럼, 운세칼럼, 사주이야기, 개운법, 재물운, 자녀운, 인연, 사주기초, 사주공부" />
        <meta property="og:title" content="운세 칼럼 - 사주 전문가의 깊이 있는 운세 이야기 | 무운 (MuUn)" />
        <meta property="og:description" content="사주 기초부터 개운법, 재물운, 자녀운, 인연까지. 40대 여성을 위한 깊이 있는 사주 칼럼을 회원가입 없이 100% 무료로 읽어보세요." />
        <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무운 (MuUn)" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://muunsaju.com/images/horse_mascot.png" />
        <link rel="canonical" href="https://muunsaju.com/guide" />
      </Helmet>

      {/* ── 헤더 ── */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#EBEBEB]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link href="/">
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/[0.05] transition-colors -ml-2" aria-label="뒤로가기">
                <ChevronLeft className="w-5 h-5 text-[#1a1a18]" />
              </button>
            </Link>
            <h1 className="text-[17px] font-bold text-[#1a1a18] tracking-[-0.3px]">운세 칼럼</h1>
          </div>
          {/* 헤더 우측 검색 아이콘은 글로벌 검색 사용 */}
        </div>
      </div>

      {/* ── 히어로 배너 ── */}
      <div className="bg-[#1E0F4A] px-4 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold text-[#A78BFA] uppercase tracking-widest mb-1">
              무운의 운세 지혜
            </p>
            <p className="text-[16px] font-bold text-white leading-snug">
              역술인이 전하는 사주 조언 · 개운법
            </p>
          </div>
          <div className="flex-shrink-0 bg-white/15 border border-white/25 rounded-xl px-4 py-2 text-center min-w-[72px]">
            <p className="text-[11px] text-white/60 mb-0.5">총</p>
            <p className="text-[20px] font-extrabold text-white leading-none">{allColumns.length}</p>
            <p className="text-[11px] text-white/60 mt-0.5">기편</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">

        {/* ── 검색 바 ── */}
        <div className="mt-4 mb-3">
          <div className="flex items-center gap-3 bg-[#EEE9FF] rounded-2xl px-4 h-[52px]">
            <Search className="w-5 h-5 text-[#7C3AED] flex-shrink-0" />
            <input
              type="search"
              placeholder="칼럼 검색…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
              className="flex-1 bg-transparent text-[15px] text-[#1a1a18] placeholder-[#9B8FC4] outline-none"
            />
          </div>
        </div>

        {/* ── 카테고리 필터 칩 ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-hide">
          {CHIP_CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={String(cat.id)}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 h-9 rounded-full text-[13px] font-semibold border transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#6D28D9] border-[#6D28D9] text-white shadow-sm'
                    : 'bg-white border-[#E0D9F5] text-[#5a5a56] hover:border-[#6D28D9]/40'
                }`}
              >
                {isActive && <Check className="w-3.5 h-3.5" />}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ── 결과 수 + 정렬 ── */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] text-[#5a5a56]">
            전체 <span className="font-bold text-[#1a1a18]">{filtered.length}</span>편
          </p>
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(v => !v)}
              className="flex items-center gap-1 text-[13px] font-semibold text-[#6D28D9] py-1"
            >
              {sortOrder === 'newest' ? '최신순' : '오래된순'}
              <ChevronDown className={`w-4 h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-[#EBEBEB] rounded-xl shadow-lg overflow-hidden z-20 w-[120px]">
                {(['newest', 'oldest'] as const).map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSortOrder(opt); setShowSortMenu(false); setVisibleCount(PAGE_SIZE); }}
                    className={`w-full text-left px-4 py-3 text-[13px] transition-colors ${
                      sortOrder === opt ? 'font-bold text-[#6D28D9] bg-[#F3EEFF]' : 'text-[#1a1a18] hover:bg-[#F7F7FA]'
                    }`}
                  >
                    {opt === 'newest' ? '최신순' : '오래된순'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 칼럼 카드 리스트 ── */}
        <div className="space-y-3 pb-6">
          {isLoading ? (
            /* 스켈레톤 */
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden flex h-[108px] animate-pulse">
                <div className="w-[108px] flex-shrink-0 bg-[#EBEBEB]" />
                <div className="flex-1 p-4 space-y-2">
                  <div className="h-3 w-16 bg-[#EBEBEB] rounded-full" />
                  <div className="h-4 w-full bg-[#EBEBEB] rounded-full" />
                  <div className="h-4 w-3/4 bg-[#EBEBEB] rounded-full" />
                  <div className="h-3 w-24 bg-[#EBEBEB] rounded-full mt-1" />
                </div>
              </div>
            ))
          ) : displayed.length > 0 ? (
            displayed.map(column => {
              const chipColor = CHIP_COLORS[column.category] || 'bg-[#F3EEFF] text-[#6D28D9]';
              return (
                <Link key={column.id} href={`/guide/${column.slug || column.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden flex items-stretch border border-[#F0EDF8] hover:border-[#C4B5FD] hover:shadow-sm transition-all active:scale-[0.99] cursor-pointer">
                    {/* 썸네일 */}
                    <div className="w-[108px] flex-shrink-0 bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE] relative overflow-hidden">
                      {column.thumbnail ? (
                        <img
                          src={column.thumbnail}
                          alt={column.title}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : null}
                    </div>

                    {/* 콘텐츠 */}
                    <div className="flex-1 px-4 py-3 flex flex-col justify-between min-w-0">
                      <div>
                        {/* 카테고리 칩 */}
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-1.5 ${chipColor}`}>
                          {column.categoryLabel}
                        </span>
                        {/* 제목 */}
                        <p className="text-[14px] font-bold text-[#1a1a18] leading-snug line-clamp-2 tracking-[-0.2px]">
                          {column.title}
                        </p>
                      </div>
                      {/* 날짜 · 읽기 시간 */}
                      <p className="text-[12px] text-[#999891] mt-1.5">
                        {formatDate(column.publishedDate)} · {column.readTime}분 읽기
                      </p>
                    </div>

                    {/* 화살표 */}
                    <div className="flex items-center pr-3 flex-shrink-0">
                      <ChevronRight className="w-4 h-4 text-[#C4B5FD]" />
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="py-16 text-center text-[#999891] text-[14px]">
              {searchQuery ? `"${searchQuery}"에 해당하는 칼럼이 없습니다.` : '해당 카테고리의 칼럼이 없습니다.'}
            </div>
          )}
        </div>

        {/* ── 더보기 버튼 ── */}
        {!isLoading && hasMore && (
          <div className="pb-8">
            <button
              onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
              className="w-full h-[52px] bg-white border border-[#E0D9F5] rounded-2xl text-[15px] font-semibold text-[#1a1a18] hover:bg-[#F3EEFF] hover:border-[#C4B5FD] transition-all active:scale-[0.99]"
            >
              칼럼 더보기
            </button>
          </div>
        )}

        {/* ── 모두 표시됐을 때 끝 메시지 ── */}
        {!isLoading && !hasMore && displayed.length > 0 && (
          <p className="text-center text-[12px] text-[#C4B5FD] pb-8">
            모든 칼럼을 확인했습니다
          </p>
        )}

      </div>

      {/* 정렬 메뉴 닫기용 오버레이 */}
      {showSortMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
      )}
    </div>
  );
}
