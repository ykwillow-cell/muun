/**
 * CallToAction.tsx
 * 콘텐츠 상세 페이지(꿈해몽, 칼럼, 운세 사전) 하단에 표시되는 CTA 섹션
 * - 40~60대 여성 타겟: 정중하고 신뢰감 있는 톤앤매너
 * - 골드/퍼플 테마 버튼으로 시인성 확보
 * - 모바일 최적화 (최소 높이 48px 이상)
 */
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { trackCustomEvent } from '@/lib/ga4';
import { useLocation } from 'wouter';

interface CallToActionProps {
  /** CTA 위 커스텀 메시지 (기본값 사용 가능) */
  message?: string;
  /** 연결할 운세 페이지 경로 (기본: /daily-fortune) */
  targetPath?: string;
  /** 버튼 레이블 */
  buttonLabel?: string;
}

export default function CallToAction({
  message = '오늘 나의 운세도 확인해 보세요',
  targetPath = '/daily-fortune',
  buttonLabel = '무료 운세 보러가기',
}: CallToActionProps) {
  const [location] = useLocation();

  const handleClick = () => {
    trackCustomEvent('click_cta_to_fortune', {
      source_page: location,
      cta_location: 'content_bottom',
      target_path: targetPath,
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

        {/* 아이콘 */}
        <div className="relative z-10 flex justify-center mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-600 fill-yellow-400" />
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <Star className="w-4 h-4 text-yellow-600 fill-yellow-400" />
          </div>
        </div>

        {/* 메시지 */}
        <div className="relative z-10 space-y-2 mb-6">
          <p className="text-xs font-bold tracking-widest text-yellow-600/80 uppercase">
            무운(MuUn) 무료 운세
          </p>
          <h3 className="text-xl md:text-2xl font-bold text-[#1a1a18] leading-snug">
            {message}
          </h3>
          <p className="text-sm text-[#5a5a56] leading-relaxed max-w-sm mx-auto">
            생년월일만 입력하시면 오늘의 총운, 재물운, 애정운을<br className="hidden md:block" />
            무료로 확인하실 수 있습니다.
          </p>
        </div>

        {/* CTA 버튼 */}
        <div className="relative z-10">
          <Link href={targetPath}>
            <button
              onClick={handleClick}
              className="inline-flex items-center justify-center gap-2 w-full max-w-xs h-14 px-8 rounded-2xl font-bold text-base text-[#1a1a18] shadow-xl shadow-yellow-500/20 transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #d97706 0%, #7c3aed 100%)',
              }}
            >
              <Sparkles className="w-5 h-5" />
              {buttonLabel}
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
