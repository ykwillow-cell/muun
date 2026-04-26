import { Link } from 'wouter';
import { ArrowRight, BookOpenText, Clock3 } from 'lucide-react';
import { HOME_COLUMNS_PREVIEW } from '@/generated/content-snapshots';

function formatDate(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

function cleanTitle(title: string) {
  return title.replace(/\s*요약:.+$/u, '').replace(/\s*URL 슬러그:.+$/u, '').trim();
}

const COLUMN_ICONS = [
  // 첫 번째 칼럼 아이콘 (보라색 계열)
  <svg key="icon0" viewBox="0 0 28 28" fill="none" stroke="#7F77DD" strokeWidth="1.5" strokeLinecap="round">
    <path d="M4 22l6-6 4 4 8-10" />
    <circle cx="20" cy="8" r="3" />
  </svg>,
  // 두 번째 칼럼 아이콘 (파란색 계열)
  <svg key="icon1" viewBox="0 0 28 28" fill="none" stroke="#378ADD" strokeWidth="1.5" strokeLinecap="round">
    <rect x="4" y="4" width="20" height="20" rx="3" />
    <line x1="9" y1="12" x2="19" y2="12" />
    <line x1="9" y1="16" x2="15" y2="16" />
  </svg>,
];

export function HomeColumnSection() {
  const previewColumns = HOME_COLUMNS_PREVIEW.slice(0, 2);
  return (
    <section className="muun-column-section" aria-labelledby="home-columns-title">
      <div className="muun-section-row muun-section-row--compact">
        <div>
          <p className="muun-section-eyebrow"><BookOpenText size={12} aria-hidden="true" /> 운세 칼럼</p>
          <h2 id="home-columns-title" className="muun-section-title">칼럼</h2>
        </div>
        <Link href="/guide" className="muun-see-all">전체 <ArrowRight size={12} aria-hidden="true" /></Link>
      </div>
      <div className="muun-content-grid">
        {previewColumns.length > 0 ? (
          previewColumns.map((column, index) => (
            <Link key={column.slug} href={`/guide/${column.slug}`} className="muun-content-card">
              <div
                className="muun-content-img"
                style={{ background: index % 2 === 0 ? '#e8e4f7' : '#e1f0fa' }}
              >
                {COLUMN_ICONS[index % 2]}
              </div>
              <div className="muun-content-body">
                <span
                  className="muun-content-cat"
                  style={index % 2 === 1 ? { background: '#e6f1fb', color: '#0C447C' } : undefined}
                >
                  {column.categoryLabel || '개운법'}
                </span>
                <h3 className="muun-content-title">{cleanTitle(column.title)}</h3>
                <p className="muun-content-meta">
                  <span>{formatDate(column.publishedDate)}</span>
                  <span>·</span>
                  <Clock3 size={10} aria-hidden="true" />
                  {column.readTime}분
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="muun-empty-card">칼럼 데이터를 준비 중입니다.</div>
        )}
      </div>
    </section>
  );
}
