import { Link } from 'wouter';
import { ArrowRight, BookOpenText, Clock3, TrendingUp } from 'lucide-react';
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
              <div className={`muun-content-img muun-content-img--${index % 2 === 0 ? 'purple' : 'blue'}`}>
                {column.thumbnail ? (
                  <img src={column.thumbnail} alt="" loading="lazy" />
                ) : index % 2 === 0 ? (
                  <TrendingUp size={28} aria-hidden="true" />
                ) : (
                  <BookOpenText size={28} aria-hidden="true" />
                )}
              </div>
              <div className="muun-content-body">
                <span className={`muun-content-cat${index % 2 === 1 ? ' muun-content-cat--blue' : ''}`}>{column.categoryLabel || '개운법'}</span>
                <h3 className="muun-content-title">{cleanTitle(column.title)}</h3>
                <p className="muun-content-meta"><span>{formatDate(column.publishedDate)}</span><span>·</span><Clock3 size={10} aria-hidden="true" />{column.readTime}분</p>
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
