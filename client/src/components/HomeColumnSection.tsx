import { Link } from 'wouter';
import { ArrowRight, BookOpenText, Clock3 } from 'lucide-react';
import { HOME_COLUMNS_PREVIEW } from '@/generated/content-snapshots';
import { getGuidePath } from '@/lib/guide-url';

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
  const previewColumns = HOME_COLUMNS_PREVIEW.slice(0, 5);
  return (
    <section className="mu-home-content-section" aria-labelledby="home-columns-title">
      <div className="mu-home-content-section__head">
        <div>
          <p className="mu-section-eyebrow"><BookOpenText size={12} /> 무운사주 칼럼</p>
          <h2 id="home-columns-title" className="muun-section-title">더 깊이 읽는 사주 이야기</h2>
        </div>
        <Link href="/guide" className="muun-see-all">더보기 <ArrowRight size={12} /></Link>
      </div>
      <div className="flex flex-col gap-3">
        {previewColumns.length > 0 ? previewColumns.map((column) => (
          <Link
            key={column.slug}
            href={getGuidePath(column.slug, column.id)}
            className="flex flex-col bg-white rounded-[14px] overflow-hidden transition-transform hover:-translate-y-0.5"
            style={{ border: '0.5px solid #e9e5fa', boxShadow: '0 2px 12px rgba(80,71,140,0.06)' }}
          >
            {/* 썸네일: 16:9 가로형 */}
            <div className="relative w-full bg-[#ede9ff]" style={{ paddingTop: '56.25%' }}>
              {column.thumbnail ? (
                <img
                  src={column.thumbnail}
                  alt={cleanTitle(column.title)}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpenText size={32} className="text-[#6B5FFF] opacity-40" />
                </div>
              )}
            </div>
            {/* 텍스트 */}
            <div className="px-4 py-3">
              <span
                className="inline-block rounded-full px-2 py-0.5 font-semibold mb-1.5"
                style={{ fontSize: '11px', background: '#f0eeff', color: '#6B5FFF' }}
              >
                {column.categoryLabel || '운세 칼럼'}
              </span>
              <h3
                className="font-bold leading-snug tracking-[-0.03em] line-clamp-2 mb-1.5"
                style={{ fontSize: '14px', color: '#1e2340' }}
              >
                {cleanTitle(column.title)}
              </h3>
              <p className="flex items-center gap-1" style={{ fontSize: '12px', color: '#a0a0bc' }}>
                <Clock3 size={11} />
                {formatDate(column.publishedDate)} · {column.readTime}분
              </p>
            </div>
          </Link>
        )) : <div className="bg-white rounded-[14px] p-4 text-sm text-slate-400">칼럼 데이터를 준비 중입니다.</div>}
      </div>
    </section>
  );
}
