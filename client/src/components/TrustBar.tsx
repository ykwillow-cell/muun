import { ShieldCheck, Smartphone, Sparkles } from 'lucide-react';

const trustItems = [
  { value: '100% 무료', label: '회원가입 없이 시작', desc: '생년월일만 입력하면 바로 확인', Icon: Sparkles },
  { value: '모바일 중심', label: '한 손으로 빠르게 이동', desc: '작은 화면에서도 먼저 보여야 할 정보만 정리', Icon: Smartphone },
  { value: '검색 친화', label: '칼럼·사전·상세 연결', desc: '서비스 이후 더 읽을 콘텐츠까지 자연스럽게 탐색', Icon: ShieldCheck },
] as const;

export function TrustBar() {
  return (
    <section className="mu-container-narrow relative z-10 -mt-6 pb-6">
      <div className="mu-glass-panel px-3 py-3 sm:px-4">
        <div className="no-scrollbar flex gap-3 overflow-x-auto sm:grid sm:grid-cols-3 sm:overflow-visible">
          {trustItems.map(({ value, label, desc, Icon }) => (
            <div key={label} className="min-w-[220px] rounded-[22px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_12px_26px_rgba(15,23,42,0.05)] sm:min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#5748db]">{value}</div>
                  <div className="mt-2 text-[17px] font-extrabold tracking-[-0.04em] text-slate-900">{label}</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6B5FFF]/10 text-[#5648db]">
                  <Icon size={18} aria-hidden="true" />
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-6 text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
