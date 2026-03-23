/**
 * CallToAction.tsx
 * 콘텐츠 상세 페이지(꿈해몽, 칼럼, 운세 사전) 하단에 표시되는 CTA 섹션
 * - 40~60대 여성 타겟: 정중하고 신뢰감 있는 톤앤매너
 * - 골드/퍼플 테마 버튼으로 시인성 확보
 * - 모바일 최적화 (최소 높이 48px 이상)
 *
 * [개선 2026-03-23]
 * - 별점(☆☆★) 제거 → 신뢰도 저하 요소 제거
 * - 텍스트 배지 3개(무료·가입없이·바로 확인)로 교체
 * - 운세 사전 페이지에서는 평생사주 CTA로 변경 (검색 의도 일치)
 */
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { trackCustomEvent } from '@/lib/ga4';
import { useLocation } from 'wouter';

interface CallToActionProps {
  /** CTA 위 커스텀 메시지 (기본값 사용 가능) */
  message?: string;
  /** 연결할 운세 페이지 경로 (기본: /lifelong-saju) */
  targetPath?: string;
  /** 버튼 레이블 */
  buttonLabel?: string;
  /** CTA 변형: 'daily'(오늘운세) | 'lifelong'(평생사주, 기본) */
  variant?: 'daily' | 'lifelong';
}

const VARIANTS = {
  daily: {
    badge: '무운(MuUn) 무료 운세',
    message: '오늘 나의 운세도 확인해 보세요',
    description: '생년월일만 입력하시면 오늘의 총운, 재물운, 애정운을 무료로 확인하실 수 있습니다.',
    buttonLabel: '무료 운세 보러가기',
    targetPath: '/daily-fortune',
  },
  lifelong: {
    badge: '무운(MuUn) 평생사주',
    message: '타고난 기질과 운명, 지금 확인해 보세요',
    description: '생년월일만 입력하시면 타고난 성격, 직업운, 재물운, 대인관계를 무료로 확인하실 수 있습니다.',
    buttonLabel: '평생사주 무료로 보기',
    targetPath: '/lifelong-saju',
  },
};

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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="my-10"
    >
      <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-purple-500/10 to-indigo-500/5 p-7 md:p-9 text-center shadow-lg">
        {/* 배경 장식 */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 메시지 */}
        <div className="relative z-10 space-y-2 mb-5">
          <p className="text-xs font-bold tracking-widest text-yellow-600/80 uppercase">
            {config.badge}
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-[#1a1a18] leading-snug">
            {finalMessage}
          </h3>
          <p className="text-sm text-[#5a5a56] leading-relaxed max-w-sm mx-auto">
            {config.description}
          </p>
        </div>

        {/* 신뢰 배지 3개 (별점 대체) */}
        <div className="relative z-10 flex items-center justify-center gap-3 mb-6 flex-wrap">
          {['무료', '가입 없이', '바로 확인'].map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white/70 border border-black/10 rounded-full text-xs font-semibold text-[#4E5968] shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6B5FFF]" />
              {label}
            </span>
          ))}
        </div>

        {/* CTA 버튼 */}
        <div className="relative z-10">
          <Link href={finalTargetPath}>
            <button
              onClick={handleClick}
              className="inline-flex items-center justify-center gap-2 w-full max-w-xs h-14 px-8 rounded-2xl font-bold text-base text-white shadow-xl shadow-yellow-500/20 transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #d97706 0%, #7c3aed 100%)',
              }}
            >
              <Sparkles className="w-5 h-5" />
              {finalButtonLabel}
            </button>
          </Link>
          <p className="mt-3 text-[11px] text-[#999891]">
            회원가입 없이 바로 이용 가능합니다
          </p>
        </div>
      </div>
    </motion.section>
  );
}
