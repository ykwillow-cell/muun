import { ShieldCheck, Sparkles, Users } from 'lucide-react';

const trustItems = [
  {
    value: '1만+',
    label: '누적 이용자',
    desc: '회원가입 없이 빠르게 사용',
    Icon: Users,
  },
  {
    value: '13+',
    label: '무료 서비스',
    desc: '사주·궁합·타로·꿈해몽',
    Icon: Sparkles,
  },
  {
    value: 'SEO 중심',
    label: '콘텐츠 구조',
    desc: '칼럼·사전·상세 연결 강화',
    Icon: ShieldCheck,
  },
] as const;

export function TrustBar() {
  return (
    <section className="bg-[linear-gradient(180deg,#17124f_0%,#261a73_100%)] text-white">
      <div className="mu-container-narrow py-4">
        <div className="grid gap-3 md:grid-cols-3">
          {trustItems.map(({ value, label, desc, Icon }) => (
            <div
              key={label}
              className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[20px] font-extrabold tracking-[-0.05em] text-white">{value}</div>
                  <div className="mt-1 text-sm font-bold text-white/85">{label}</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white/90">
                  <Icon size={18} aria-hidden="true" />
                </div>
              </div>
              <p className="mt-3 text-xs leading-6 text-white/60">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
