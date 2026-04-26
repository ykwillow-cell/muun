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

export function HomeColumnSection() {
  const previewColumns = HOME_COLUMNS_PREVIEW.slice(0, 2);
  return (
    <section className="mu-home-content-section" aria-labelledby="home-columns-title">
      <div className="mu-home-content-section__head">
        <div>
          <p className="mu-section-eyebrow"><BookOpenText size={12} /> 무운사주 칼럼</p>
          <h2 id="home-columns-title" className="muun-section-title">더 깊이 읽는 사주 이야기</h2>
        </div>
        <Link href="/guide" className="muun-see-all">더보기 <ArrowRight size={12} /></Link>
      </div>
      <div className="mu-home-content-list">
        {previewColumns.length > 0 ? previewColumns.map((column, index) => (
          <Link key={column.slug} href={`/guide/${column.slug}`} className="mu-home-content-card">
            <div className={`mu-home-content-card__thumb is-${index % 2 === 0 ? 'lavender' : 'mint'}`} aria-hidden="true">
              <BookOpenText size={28} />
            </div>
            <div className="mu-home-content-card__body">
              <span className="mu-home-content-card__badge">{column.categoryLabel || '운세 칼럼'}</span>
              <h3>{cleanTitle(column.title)}</h3>
              <p className="mu-home-content-card__meta"><Clock3 size={12} /> {formatDate(column.publishedDate)} · {column.readTime}분</p>
            </div>
          </Link>
        )) : <div className="mu-home-content-card">칼럼 데이터를 준비 중입니다.</div>}
      </div>
    </section>
  );
}
