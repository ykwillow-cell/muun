import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, Clock, BookOpen } from 'lucide-react';
import { getLatestColumns, ColumnData, COLUMN_CATEGORIES } from '@/lib/column-data-api';

/* 카테고리 태그 스타일 (라이트 배경 최적화) */
const CATEGORY_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  luck:         { bg: '#FFF9E6', color: '#B45309', label: '개운법' },
  basic:        { bg: '#EFF6FF', color: '#1D4ED8', label: '기초 명리' },
  relationship: { bg: '#FDF2F8', color: '#9D174D', label: '인간관계' },
  health:       { bg: '#F0FDF4', color: '#166534', label: '건강운' },
  money:        { bg: '#F5F3FF', color: '#6D28D9', label: '재물운' },
  flow:         { bg: '#EEF2FF', color: '#3730A3', label: '운의 흐름' },
  career:       { bg: '#FFF7ED', color: '#C2410C', label: '직업운' },
  love:         { bg: '#FFF1F2', color: '#BE123C', label: '연애운' },
  family:       { bg: '#F0FDFA', color: '#0F766E', label: '가족 & 자녀' },
};

function getCategoryStyle(category: string) {
  return CATEGORY_STYLES[category] ?? { bg: '#F2F4F6', color: '#4E5968', label: category };
}

/* 썸네일 배경색 (카테고리별) */
const THUMB_BG: Record<string, string> = {
  money:        '#E8F0FF',
  family:       '#E8F8EE',
  luck:         '#F0EDFF',
  love:         '#FFF1F2',
  career:       '#FFF3E0',
  health:       '#E8FFF0',
  relationship: '#FDF2F8',
  basic:        '#EFF6FF',
  flow:         '#EEF2FF',
};

export function HomeColumnSection() {
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestColumns(3).then((data) => {
      setColumns(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="mu-column-section" aria-label="운세 칼럼">

      {/* 섹션 헤더 */}
      <div className="mu-column-section__header">
        <span className="mu-column-section__title">
          <BookOpen size={16} aria-hidden="true" />
          운세 칼럼
        </span>
        <Link href="/guide" className="mu-column-section__more">
          전체보기 <ChevronRight size={13} aria-hidden="true" />
        </Link>
      </div>

      {/* 카드 목록 */}
      <div className="mu-column-list">
        {loading ? (
          [0, 1, 2].map((i) => (
            <div key={i} className={`mu-column-item mu-column-item--skeleton${i < 2 ? ' mu-column-item--border' : ''}`}>
              <div className="mu-column-item__thumb mu-skeleton-box" />
              <div className="mu-column-item__body">
                <div className="mu-skeleton-line" style={{ width: '40%', height: 11 }} />
                <div className="mu-skeleton-line" style={{ width: '85%', height: 14, marginTop: 4 }} />
                <div className="mu-skeleton-line" style={{ width: '55%', height: 11, marginTop: 4 }} />
              </div>
            </div>
          ))
        ) : columns.length === 0 ? (
          <div className="mu-column-empty">등록된 칼럼이 없습니다.</div>
        ) : (
          columns.map((col, i) => {
            const catStyle = getCategoryStyle(col.category);
            const thumbBg = THUMB_BG[col.category] ?? '#F0EDFF';
            return (
              <Link key={col.id} href={`/guide/${col.slug || col.id}`} className={`mu-column-item${i < columns.length - 1 ? ' mu-column-item--border' : ''}`}>
                {/* 썸네일 */}
                {col.thumbnail ? (
                  <img
                    src={col.thumbnail}
                    alt={col.title}
                    className="mu-column-item__thumb mu-column-item__thumb--img"
                  />
                ) : (
                  <div className="mu-column-item__thumb" style={{ background: thumbBg }} aria-hidden="true">
                    <BookOpen size={22} style={{ color: '#6B5FFF' }} />
                  </div>
                )}

                {/* 텍스트 영역 */}
                <div className="mu-column-item__body">
                  {/* 카테고리 태그 */}
                  <span
                    className="mu-column-item__tag"
                    style={{ background: catStyle.bg, color: catStyle.color }}
                  >
                    {col.categoryLabel || COLUMN_CATEGORIES[col.category]?.label || catStyle.label}
                  </span>
                  {/* 제목 */}
                  <p className="mu-column-item__title">{col.title}</p>
                  {/* 메타 */}
                  <div className="mu-column-item__meta">
                    <span className="mu-column-item__meta-item">
                      <Clock size={10} aria-hidden="true" />
                      {col.readTime}분
                    </span>
                    <span className="mu-column-item__meta-dot" aria-hidden="true" />
                    <span>{col.publishedDate?.slice(0, 10)}</span>
                  </div>
                </div>

                <ChevronRight size={15} className="mu-column-item__arrow" aria-hidden="true" />
              </Link>
            );
          })
        )}
      </div>

      <style>{`
        /* ── 운세 칼럼 섹션 ── */
        .mu-column-section {
          padding: 20px 16px 8px;
          background: #f2f4f6;
        }
        .mu-column-section__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .mu-column-section__title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 18px;
          font-weight: 800;
          color: #191f28;
          letter-spacing: -0.03em;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-column-section__title svg { color: #6B5FFF; }
        .mu-column-section__more {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 12px;
          font-weight: 600;
          color: #8b95a1;
          text-decoration: none;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-column-section__more:hover { color: #4e5968; }

        /* ── 카드 목록 ── */
        .mu-column-list {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e5e8eb;
        }

        /* ── 칼럼 아이템 ── */
        .mu-column-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          text-decoration: none;
          transition: background 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .mu-column-item:hover { background: #f8f9fa; }
        .mu-column-item--border {
          border-bottom: 1px solid #e5e8eb;
        }

        /* ── 썸네일 ── */
        .mu-column-item__thumb {
          width: 68px;
          height: 68px;
          border-radius: 12px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .mu-column-item__thumb--img {
          object-fit: cover;
          background: #f2f4f6;
        }

        /* ── 텍스트 영역 ── */
        .mu-column-item__body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          justify-content: center;
        }

        /* ── 카테고리 태그 ── */
        .mu-column-item__tag {
          display: inline-block;
          width: fit-content;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── 제목 ── */
        .mu-column-item__title {
          font-size: 14px;
          font-weight: 600;
          color: #191f28;
          margin: 0;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        /* ── 메타 ── */
        .mu-column-item__meta {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #8b95a1;
          font-size: 11px;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-column-item__meta-item {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .mu-column-item__meta-dot {
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: #b0b8c1;
          flex-shrink: 0;
        }

        /* ── 화살표 ── */
        .mu-column-item__arrow {
          color: #c5ccd4;
          flex-shrink: 0;
        }

        /* ── 스켈레톤 ── */
        .mu-skeleton-box {
          background: #f2f4f6 !important;
          animation: skeleton-pulse 1.4s ease-in-out infinite;
        }
        .mu-skeleton-line {
          border-radius: 6px;
          background: #f2f4f6;
          animation: skeleton-pulse 1.4s ease-in-out infinite;
        }
        .mu-column-empty {
          padding: 32px 16px;
          text-align: center;
          color: #8b95a1;
          font-size: 14px;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }

        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
