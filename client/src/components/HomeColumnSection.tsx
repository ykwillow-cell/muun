import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, Clock, BookOpen } from 'lucide-react';
import { getLatestColumns, ColumnData, COLUMN_CATEGORIES } from '@/lib/column-data-api';

export function HomeColumnSection() {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestColumns(3).then((data) => {
      setColumns(data);
      setLoading(false);
    });
  }, []);

  // 카테고리 태그 색상 — 라이트 배경용
  const getCategoryStyle = (category: string) => {
    const map: Record<string, string> = {
      luck:         'bg-yellow-100 text-yellow-700',
      basic:        'bg-blue-100 text-blue-700',
      relationship: 'bg-pink-100 text-pink-700',
      health:       'bg-green-100 text-green-700',
      money:        'bg-purple-100 text-purple-700',
      flow:         'bg-indigo-100 text-indigo-700',
      career:       'bg-orange-100 text-orange-700',
      love:         'bg-rose-100 text-rose-700',
      family:       'bg-teal-100 text-teal-700',
    };
    return map[category] ?? 'bg-gray-100 text-gray-600';
  };

  return (
    <section style={{ padding: '0 16px 8px' }}>
      {/* 섹션 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BookOpen size={16} style={{ color: '#6B5FFF' }} />
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#191F28', fontFamily: 'Pretendard Variable, Pretendard, sans-serif' }}>
            운세 칼럼
          </span>
        </div>
        <Link href="/guide">
          <span style={{
            display: 'flex', alignItems: 'center', gap: '2px',
            fontSize: '13px', color: '#4E5968', cursor: 'pointer',
            fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
          }}>
            전체보기 <ChevronRight size={14} />
          </span>
        </Link>
      </div>

      {/* 카드 목록 */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        {loading ? (
          // 스켈레톤
          [0, 1, 2].map((i) => (
            <div key={i} style={{
              display: 'flex', gap: '12px', padding: '14px 16px',
              borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.06)' : 'none',
            }}>
              <div style={{ width: 64, height: 64, borderRadius: 10, background: '#F2F4F6', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ height: 12, borderRadius: 6, background: '#F2F4F6', width: '40%' }} />
                <div style={{ height: 14, borderRadius: 6, background: '#F2F4F6', width: '85%' }} />
                <div style={{ height: 12, borderRadius: 6, background: '#F2F4F6', width: '60%' }} />
              </div>
            </div>
          ))
        ) : columns.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', color: '#8B95A1', fontSize: 14 }}>
            등록된 칼럼이 없습니다.
          </div>
        ) : (
          columns.map((col, i) => (
            <Link key={col.id} href={`/guide/${col.slug || col.id}`}>
              <div style={{
                display: 'flex', gap: '12px', padding: '14px 16px',
                borderBottom: i < columns.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F8F9FA')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* 썸네일 */}
                {col.thumbnail ? (
                  <img
                    src={col.thumbnail}
                    alt={col.title}
                    style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0, background: '#F2F4F6' }}
                  />
                ) : (
                  <div style={{
                    width: 64, height: 64, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(107,95,255,0.12) 0%, rgba(107,95,255,0.06) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <BookOpen size={22} style={{ color: '#6B5FFF' }} />
                  </div>
                )}

                {/* 텍스트 */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center' }}>
                  {/* 카테고리 태그 */}
                  <span style={{
                    display: 'inline-block', width: 'fit-content',
                    fontSize: '11px', fontWeight: 500, padding: '2px 7px',
                    borderRadius: '20px',
                    fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
                  }} className={getCategoryStyle(col.category)}>
                    {col.categoryLabel || COLUMN_CATEGORIES[col.category]?.label || col.category}
                  </span>
                  {/* 제목 */}
                  <p style={{
                    fontSize: '14px', fontWeight: 600, color: '#191F28',
                    margin: 0, lineHeight: '1.4',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
                  }}>
                    {col.title}
                  </p>
                  {/* 메타 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8B95A1', fontSize: '11px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={10} />
                      {col.readTime}분
                    </span>
                    <span>{col.publishedDate?.slice(0, 10)}</span>
                  </div>
                </div>

                <ChevronRight size={16} style={{ color: '#C5CBD3', flexShrink: 0, alignSelf: 'center' }} />
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
