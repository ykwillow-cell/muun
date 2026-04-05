import { Link, useLocation } from 'wouter';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { trackCustomEvent } from '@/lib/ga4';

interface CallToActionProps {
  message?: string;
  targetPath?: string;
  buttonLabel?: string;
  variant?: 'daily' | 'lifelong';
}

const VARIANTS = {
  daily: {
    eyebrow: '오늘의 무료 운세',
    message: '오늘 하루의 흐름도 함께 확인해 보세요',
    description: '생년월일만 입력하면 오늘의 총운, 재물운, 애정운을 간단하게 확인할 수 있습니다.',
    buttonLabel: '오늘의 운세 보기',
    targetPath: '/daily-fortune',
  },
  lifelong: {
    eyebrow: '무운 평생사주',
    message: '타고난 기질과 인생의 흐름을 차분히 확인해 보세요',
    description: '평생사주 결과와 칼럼, 사전 콘텐츠를 함께 보면 이해가 훨씬 쉬워집니다.',
    buttonLabel: '평생사주 바로 보기',
    targetPath: '/lifelong-saju',
  },
} as const;

const trustBadges = ['무료', '회원가입 없음', '모바일 최적화'] as const;

export default function CallToAction({
  message,
  targetPath,
  buttonLabel,
  variant = 'lifelong',
}: CallToActionProps) {
  const [location] = useLocation();
  const config = VARIANTS[variant];

  const finalMessage = message ?? config.message;
  const finalTargetPath = targetPath ?? config.targetPath;
  const finalButtonLabel = buttonLabel ?? config.buttonLabel;

  const handleClick = () => {
    trackCustomEvent('click_cta_to_fortune', {
      source_page: location,
      cta_location: 'content_bottom',
      target_path: finalTargetPath,
      variant,
    });
  };

  return (
    <section className="my-10">
      <div className="mu-glass-panel overflow-hidden p-6 sm:p-7">
        <div className="grid gap-6 md:grid-cols-[1.3fr_0.9fr] md:items-end">
          <div>
            <span className="mu-section-eyebrow">{config.eyebrow}</span>
            <h3 className="mt-4 text-[28px] font-extrabold tracking-[-0.05em] text-slate-900">{finalMessage}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{config.description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {trustBadges.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/85 px-3 py-1.5 text-xs font-bold text-slate-500"
                >
                  <CheckCircle2 size={13} className="text-[#5648db]" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#6B5FFF]/15 bg-gradient-to-br from-[#6B5FFF]/10 via-white to-[#a48cff]/10 p-5">
            <div className="flex items-center gap-3 text-[#5648db]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Sparkles size={20} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">추천 이동</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">핵심 결과 페이지로 바로 이동</div>
              </div>
            </div>

            <Link
              href={finalTargetPath}
              onClick={handleClick}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6B5FFF] px-5 py-4 text-sm font-bold text-white shadow-[0_16px_30px_rgba(107,95,255,0.26)] transition-transform hover:-translate-y-0.5"
            >
              <span>{finalButtonLabel}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <p className="mt-3 text-center text-[11px] leading-5 text-slate-400">개인정보를 저장하지 않는 흐름으로 설계했습니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
