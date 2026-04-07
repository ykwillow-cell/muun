import { Link } from 'wouter';
import { ArrowUpRight, BookOpenText, Clock3 } from 'lucide-react';
import { HOME_COLUMNS_PREVIEW } from '@/generated/content-snapshots';

function formatDate(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export function HomeColumnSection() {
  return (
    <section className="mu-glass-panel p-5 sm:p-6" aria-label="운세 칼럼">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="mu-section-eyebrow"><BookOpenText size={14} aria-hidden="true" /> 운세 칼럼</span>
          <h2 className="mt-4 text-[26px] font-extrabold tracking-[-0.05em] text-slate-900">지금 읽기 좋은 사주·운세 읽을거리</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">사주 기초 개념, 관계 운, 건강운, 재물운 같은 주제를 짧고 명확하게 정리한 칼럼 모음입니다.</p>
        </div>
      </div>

      <div className="mt-5 mu-auto-grid-220">
        {HOME_COLUMNS_PREVIEW.length > 0 ? (
          HOME_COLUMNS_PREVIEW.map((column) => (
            <Link key={column.slug} href={`/guide/${column.slug}`} className="mu-link-card overflow-hidden p-0">
              {column.thumbnail ? (
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img src={column.thumbnail} alt={column.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ) : (
                <div className="aspect-[16/10] bg-[linear-gradient(135deg,#17114c_0%,#352597_55%,#5f4bcb_100%)]" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex rounded-full bg-[#6B5FFF]/10 px-2.5 py-1 text-[11px] font-bold text-[#5648db]">{column.categoryLabel}</span>
                  <ArrowUpRight size={16} className="text-slate-400" aria-hidden="true" />
                </div>
                <h3 className="mt-4 line-clamp-2 text-[18px] font-extrabold tracking-[-0.04em] text-slate-900">{column.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{column.description}</p>
                <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-slate-400">
                  <span>{formatDate(column.publishedDate)}</span>
                  <span className="inline-flex items-center gap-1"><Clock3 size={12} aria-hidden="true" />{column.readTime}분</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/75 px-4 py-8 text-sm text-slate-500">칼럼 데이터를 준비 중입니다.</div>
        )}
      </div>

      <Link href="/guide" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#5748db]">
        운세 칼럼 전체보기 <ArrowUpRight size={14} />
      </Link>
    </section>
  );
}
