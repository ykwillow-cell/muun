import { Link } from 'wouter';
import { ArrowUpRight, BookMarked, Hash } from 'lucide-react';

const FEATURED_TERMS = [
  { label: '일주', desc: '나를 나타내는 핵심 기둥', slug: 'il-ju' },
  { label: '용신', desc: '내 사주에 필요한 오행', slug: 'yong-sin' },
  { label: '대운', desc: '10년 흐름으로 보는 운세', slug: 'dae-un' },
  { label: '십신', desc: '관계와 역할을 읽는 기준', slug: 'sip-sin' },
  { label: '천간', desc: '하늘의 기운 10가지', slug: 'cheon-gan' },
  { label: '지지', desc: '땅의 기운 12가지', slug: 'ji-ji' },
] as const;

export function HomeDictionarySection() {
  return (
    <section className="mu-glass-panel p-5 sm:p-6" aria-label="운세 사전">
      <div>
        <span className="mu-section-eyebrow"><BookMarked size={14} aria-hidden="true" /> 운세 사전</span>
        <h2 className="mt-4 text-[26px] font-extrabold tracking-[-0.05em] text-slate-900">사주 용어를 처음 보는 사람도 이해하기 쉽게</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">오행, 십신, 용신, 대운처럼 헷갈리기 쉬운 용어를 짧고 선명한 설명으로 정리했습니다.</p>
      </div>

      <div className="mt-5 mu-auto-grid-180">
        {FEATURED_TERMS.map((term) => (
          <Link key={term.slug} href={`/dictionary/${term.slug}`} className="mu-link-card p-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6B5FFF]/10 text-[#5648db]">
              <Hash size={18} aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-[18px] font-extrabold tracking-[-0.04em] text-slate-900">{term.label}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{term.desc}</p>
          </Link>
        ))}
      </div>

      <Link href="/fortune-dictionary" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#5748db]">
        운세 사전 전체보기 <ArrowUpRight size={14} />
      </Link>
    </section>
  );
}
