import { ShieldCheck, Sparkles, Users } from 'lucide-react';

const trustItems = [
  { value: '100%', label: '무료 서비스', desc: '회원가입 없이 바로 이용', Icon: Sparkles },
  { value: '모바일', label: '최적화 UI', desc: '작은 화면에서 더 빠르게 탐색', Icon: Users },
  { value: 'SEO', label: '콘텐츠 구조', desc: '칼럼·사전·상세 연결 강화', Icon: ShieldCheck },
] as const;

export function TrustBar() {
  return (
    <section className="mu-hero-shell text-white">
      <div className="mu-container-narrow px-4 pb-4 pt-5">
        <div className="mu-auto-grid-180">
          {trustItems.map(({ value, label, desc, Icon }) => (
            <div key={label} className="mu-soft-card px-4 py-4 text-slate-900">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[22px] font-extrabold tracking-[-0.05em] text-slate-900">{value}</div>
                  <div className="mt-1 text-sm font-bold text-slate-800">{label}</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6B5FFF]/10 text-[#5648db]">
                  <Icon size={18} aria-hidden="true" />
                </div>
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
