import { Link } from 'wouter';
import { ArrowRight, BookOpenText, Clock3, Feather, Sparkles } from 'lucide-react';
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

const CATEGORIES = [
  { label: '사주 기초', tone: 'purple', Icon: BookOpenText },
  { label: '운세 활용법', tone: 'gold', Icon: Sparkles },
  { label: '전통 문화', tone: 'rose', Icon: Sparkles },
  { label: '전문가 칼럼', tone: 'mint', Icon: Feather },
] as const;

export function HomeColumnSection() {
  const previewColumns = HOME_COLUMNS_PREVIEW.slice(0, 2);
  return (
    <section className="col-sec" aria-labelledby="home-columns-title">
      <div className="col-hd">
        <div>
          <div className="col-eyebrow"><BookOpenText size={11} /><span className="col-ey">운세 칼럼</span></div>
          <h2 id="home-columns-title" className="col-ht">칼럼</h2>
        </div>
        <Link href="/guide" className="col-more">전체 <ArrowRight size={12} /></Link>
      </div>

      <div className="col-cats">
        {CATEGORIES.map(({ label, tone, Icon }, index) => (
          <div key={label} className={`cat ${index === 0 ? 'on' : ''}`}>
            <div className={`catic is-${tone}`}><Icon size={12} /></div>
            <span className="catla">{label}</span>
          </div>
        ))}
      </div>

      <div className="col-grid">
        {previewColumns.map((column, index) => (
          <Link key={column.slug} href={`/guide/${column.slug}`} className="col-card">
            <div className={`col-thumb is-${index % 2 === 0 ? 'lavender' : 'sky'}`}>
              <div className="col-thumb__moon" />
            </div>
            <div className="col-body">
              <span className="col-chip">{column.categoryLabel || '운세 칼럼'}</span>
              <p className="col-title">{cleanTitle(column.title)}</p>
              <div className="col-meta"><Clock3 size={10} /> <span>{formatDate(column.publishedDate)}</span><span>·</span><span>{column.readTime}분</span></div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
