import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SajuResult, calculateElementBalance, STEM_ELEMENTS, ELEMENT_LUCKY_DATA, FiveElement } from "@/lib/saju";
import { STEM_PERSONALITY, ELEMENT_READINGS, analyzeElementBalance } from "@/lib/saju-reading";
import { shareContent } from "@/lib/share";
import { trackCustomEvent } from "@/lib/ga4";

interface FortuneShareCardProps {
  result: SajuResult;
  userName: string;
  type: 'yearly' | 'lifelong';
}

// 일간 오행 기반 키워드 생성
function generateKeywords(result: SajuResult): string[] {
  const dayElement = STEM_ELEMENTS[result.dayPillar.stem];
  const yearElement = STEM_ELEMENTS[result.yearPillar.stem];
  const monthElement = STEM_ELEMENTS[result.monthPillar.stem];

  const keywordMap: Record<string, string[]> = {
    '木': ['성장', '도약', '새로운 시작', '발전', '창의력'],
    '火': ['열정', '성공', '인기 상승', '활력', '빛나는 한 해'],
    '土': ['안정', '신뢰', '기반 다지기', '내실', '든든한 한 해'],
    '金': ['결실', '재물운 상승', '성취', '정리', '보상'],
    '水': ['지혜', '새로운 만남', '유연함', '소통', '흐름을 타다'],
  };

  const elementBalance = calculateElementBalance(result);
  const balanceAnalysis = analyzeElementBalance(elementBalance);
  const strongest = balanceAnalysis.strongest;

  const keywords = keywordMap[dayElement] || keywordMap['木'];
  const yearKeywords = keywordMap[yearElement] || [];
  const strongKeywords = keywordMap[strongest] || [];

  // 일간 키워드 2개 + 세운 키워드 1개 + 강한 오행 키워드 1개 (중복 제거)
  const selected: string[] = [];
  if (keywords[0]) selected.push(keywords[0]);
  if (keywords[1]) selected.push(keywords[1]);
  if (yearKeywords[2] && !selected.includes(yearKeywords[2])) selected.push(yearKeywords[2]);
  else if (yearKeywords[0] && !selected.includes(yearKeywords[0])) selected.push(yearKeywords[0]);
  if (strongKeywords[3] && !selected.includes(strongKeywords[3])) selected.push(strongKeywords[3]);
  else if (strongKeywords[1] && !selected.includes(strongKeywords[1])) selected.push(strongKeywords[1]);

  return selected.slice(0, 4);
}

// 가장 강한 오행 한글 이름
function getStrongestElementKorean(result: SajuResult): string {
  const elementBalance = calculateElementBalance(result);
  const balanceAnalysis = analyzeElementBalance(elementBalance);
  const elementKorean: Record<string, string> = { '木': '목(木)', '火': '화(火)', '土': '토(土)', '金': '금(金)', '水': '수(水)' };
  return elementKorean[balanceAnalysis.strongest] || '화(火)';
}

// 행운의 색상
function getLuckyColors(result: SajuResult): string {
  const dayElement = STEM_ELEMENTS[result.dayPillar.stem] as FiveElement;
  const luckyData = ELEMENT_LUCKY_DATA[dayElement];
  return luckyData?.colors?.slice(0, 2).join(' & ') || '레드 & 골드';
}

// 조심할 달 (오행 상극 기반)
function getCautionMonths(result: SajuResult): string {
  const dayElement = STEM_ELEMENTS[result.dayPillar.stem];
  const cautionMap: Record<string, string> = {
    '木': '7월, 8월',
    '火': '10월, 11월',
    '土': '1월, 2월',
    '金': '4월, 5월',
    '水': '6월, 7월',
  };
  return cautionMap[dayElement] || '7월, 8월';
}

// 추천 활동
function getRecommendedActivity(result: SajuResult): string {
  const dayElement = STEM_ELEMENTS[result.dayPillar.stem] as FiveElement;
  const luckyData = ELEMENT_LUCKY_DATA[dayElement];
  return luckyData?.activities?.[0] || '새로운 도전 시작';
}

// 일간 기반 핵심 키워드 문구
function getMainKeywordPhrase(result: SajuResult): string {
  const dayElement = STEM_ELEMENTS[result.dayPillar.stem];
  const phraseMap: Record<string, string> = {
    '木': '끊임없는 성장',
    '火': '불타는 열정',
    '土': '흔들리지 않는 안정',
    '金': '빛나는 결실',
    '水': '흐르는 지혜',
  };
  return phraseMap[dayElement] || '불타는 열정';
}

export default function FortuneShareCard({ result, userName, type }: FortuneShareCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const keywords = generateKeywords(result);
  const strongestElement = getStrongestElementKorean(result);
  const luckyColors = getLuckyColors(result);
  const cautionMonths = getCautionMonths(result);
  const recommendedActivity = getRecommendedActivity(result);
  const mainKeyword = getMainKeywordPhrase(result);
  const yearLabel = type === 'yearly' ? '2026년 운세 요약' : '평생 사주 요약';

  const captureAndDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);

    try {
      // 웹폰트 로딩 대기
      await document.fonts.ready;
      // 약간의 딜레이로 렌더링 안정화
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });

      const link = document.createElement('a');
      link.download = `muun_${type}_${userName}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      trackCustomEvent('share_card_download', {
        page: type === 'yearly' ? 'yearly_fortune' : 'lifelong_saju',
        user_name: userName,
      });
    } catch (error) {
      console.error('이미지 캡처 실패:', error);
      alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsCapturing(false);
    }
  }, [result, userName, type]);

  const handleShareImage = useCallback(async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);

    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });

      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) return;
        const file = new File([blob], `muun_fortune.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `무운 - ${userName}님의 ${yearLabel}`,
              text: `${userName}님의 2026년 운세 키워드를 확인해보세요!`,
              files: [file],
            });
            trackCustomEvent('share_card_native_share', {
              page: type === 'yearly' ? 'yearly_fortune' : 'lifelong_saju',
            });
          } catch (e) {
            // 사용자가 공유 취소
          }
        } else {
          // 네이티브 공유 미지원 시 다운로드
          const link = document.createElement('a');
          link.download = `muun_${type}_${userName}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        }
        setIsCapturing(false);
      }, 'image/png');
    } catch (error) {
      console.error('이미지 공유 실패:', error);
      setIsCapturing(false);
    }
  }, [result, userName, type, yearLabel]);

  return (
    <>
      {/* 이미지 저장 버튼 */}
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 min-h-[48px]"
      >
        <ImageIcon className="h-5 w-5" />
        운세 카드 이미지 저장
      </Button>

      {/* 모달 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center bg-black/90 overflow-y-auto">
          {/* 상단 닫기 버튼 */}
          <div className="w-full max-w-[420px] flex justify-between items-center p-4 sticky top-0 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
            >
              <X className="h-6 w-6" />
            </Button>
            <span className="text-white/60 text-sm">운세 카드 미리보기</span>
            <div className="w-[44px]" />
          </div>

          {/* 카드 미리보기 */}
          <div className="flex-1 flex items-start justify-center px-4 pb-4">
            <div
              ref={cardRef}
              className="relative w-[360px] overflow-hidden rounded-2xl"
              style={{ fontFamily: "'Noto Serif KR', 'Nanum Myeongjo', serif" }}
            >
              {/* 배경 이미지 */}
              <img
                src="/assets/share-card-bg.png"
                alt=""
                className="w-full h-auto block"
                crossOrigin="anonymous"
              />

              {/* 텍스트 오버레이 */}
              <div className="absolute inset-0 flex flex-col items-center justify-between py-[8%] px-[10%]">
                {/* 상단: 로고 + 타이틀 */}
                <div className="flex flex-col items-center gap-1 mt-[2%]">
                  <span
                    className="text-2xl font-bold tracking-[0.15em]"
                    style={{ color: '#d4a853', fontFamily: "'Playfair Display', serif" }}
                  >
                    MUUN
                  </span>
                  <h2
                    className="text-xl font-bold mt-1"
                    style={{ color: '#f0d78c' }}
                  >
                    나의 {yearLabel}
                  </h2>
                </div>

                {/* 중앙: 핵심 키워드 문구 */}
                <div className="flex flex-col items-center gap-4 -mt-[5%]">
                  <div className="text-center">
                    <p className="text-white/80 text-base mb-1">{userName}님의 키워드는</p>
                    <p
                      className="text-3xl font-extrabold leading-tight"
                      style={{ color: '#ffd700', textShadow: '0 0 20px rgba(255,215,0,0.3)' }}
                    >
                      '{mainKeyword}'
                    </p>
                    <p className="text-white/80 text-base mt-1">입니다.</p>
                  </div>

                  {/* 오행 균형 */}
                  <div className="text-center mt-2">
                    <p className="text-white/70 text-sm">
                      오행 균형: <span style={{ color: '#f0d78c' }} className="font-bold">{strongestElement}</span> 강함
                    </p>
                  </div>

                  {/* 키워드 태그들 */}
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-full text-sm font-bold"
                        style={{
                          background: 'linear-gradient(135deg, rgba(212,168,83,0.3) 0%, rgba(240,215,140,0.15) 100%)',
                          border: '1px solid rgba(212,168,83,0.5)',
                          color: '#f0d78c',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 하단: 요약 정보 + 푸터 */}
                <div className="flex flex-col items-center gap-3 mb-[2%] w-full">
                  {/* 요약 정보 */}
                  <div
                    className="w-full rounded-xl px-5 py-4 text-sm space-y-2"
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(212,168,83,0.2)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#d4a853' }}>●</span>
                      <span className="text-white/70">행운의 색:</span>
                      <span className="text-white font-bold">{luckyColors}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#d4a853' }}>●</span>
                      <span className="text-white/70">조심할 달:</span>
                      <span className="text-white font-bold">{cautionMonths}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: '#d4a853' }}>●</span>
                      <span className="text-white/70">추천활동:</span>
                      <span className="text-white font-bold">{recommendedActivity}</span>
                    </div>
                  </div>

                  {/* 푸터 */}
                  <p className="text-white/50 text-xs tracking-wide">
                    더 자세한 내용은 <span style={{ color: '#d4a853' }}>muunsaju.com</span>에서
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 액션 버튼 */}
          <div className="w-full max-w-[420px] px-4 pb-8 pt-2 flex gap-3 sticky bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent">
            <Button
              onClick={handleShareImage}
              disabled={isCapturing}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 min-h-[48px] border border-white/20"
            >
              {isCapturing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  이미지 생성 중...
                </>
              ) : (
                <>
                  <Share2 className="h-5 w-5" />
                  공유
                </>
              )}
            </Button>
            <Button
              onClick={captureAndDownload}
              disabled={isCapturing}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 min-h-[48px]"
            >
              {isCapturing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  이미지 생성 중...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  저장
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
