import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { Download, Share2, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SajuResult, calculateElementBalance, STEM_ELEMENTS, ELEMENT_LUCKY_DATA, FiveElement } from "@/lib/saju";
import { STEM_PERSONALITY, ELEMENT_READINGS, analyzeElementBalance } from "@/lib/saju-reading";
import { shareContent } from "@/lib/share";
import { trackCustomEvent } from "@/lib/ga4";

// ===== 공통 타입 =====
interface BaseProps {
  userName: string;
}

interface YearlyProps extends BaseProps {
  type: 'yearly';
  result: SajuResult;
}

interface LifelongProps extends BaseProps {
  type: 'lifelong';
  result: SajuResult;
}

interface CompatibilityProps extends BaseProps {
  type: 'compatibility';
  result: SajuResult;
  result2?: SajuResult;
  name1: string;
  name2: string;
  score: number;
  loveScore?: number;
  familyScore?: number;
}

interface FamilyProps extends BaseProps {
  type: 'family';
  result: SajuResult;
  memberNames: string[];
  overallScore: number;
  harmony: string;
  luckyActivity: string;
}

type FortuneShareCardProps = YearlyProps | LifelongProps | CompatibilityProps | FamilyProps;

// ===== 유틸리티 함수들 =====

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

  const selected: string[] = [];
  if (keywords[0]) selected.push(keywords[0]);
  if (keywords[1]) selected.push(keywords[1]);
  if (yearKeywords[2] && !selected.includes(yearKeywords[2])) selected.push(yearKeywords[2]);
  else if (yearKeywords[0] && !selected.includes(yearKeywords[0])) selected.push(yearKeywords[0]);
  if (strongKeywords[3] && !selected.includes(strongKeywords[3])) selected.push(strongKeywords[3]);
  else if (strongKeywords[1] && !selected.includes(strongKeywords[1])) selected.push(strongKeywords[1]);

  return selected.slice(0, 4);
}

function getStrongestElementKorean(result: SajuResult): string {
  const elementBalance = calculateElementBalance(result);
  const balanceAnalysis = analyzeElementBalance(elementBalance);
  const elementKorean: Record<string, string> = { '木': '목(木)', '火': '화(火)', '土': '토(土)', '金': '금(金)', '水': '수(水)' };
  return elementKorean[balanceAnalysis.strongest] || '화(火)';
}

function getLuckyColors(result: SajuResult): string {
  const dayElement = STEM_ELEMENTS[result.dayPillar.stem] as FiveElement;
  const luckyData = ELEMENT_LUCKY_DATA[dayElement];
  return luckyData?.colors?.slice(0, 2).join(' & ') || '레드 & 골드';
}

function getCautionMonths(result: SajuResult): string {
  const dayElement = STEM_ELEMENTS[result.dayPillar.stem];
  const cautionMap: Record<string, string> = {
    '木': '7월, 8월', '火': '10월, 11월', '土': '1월, 2월', '金': '4월, 5월', '水': '6월, 7월',
  };
  return cautionMap[dayElement] || '7월, 8월';
}

function getRecommendedActivity(result: SajuResult): string {
  const dayElement = STEM_ELEMENTS[result.dayPillar.stem] as FiveElement;
  const luckyData = ELEMENT_LUCKY_DATA[dayElement];
  return luckyData?.activities?.[0] || '새로운 도전 시작';
}

function getMainKeywordPhrase(result: SajuResult): string {
  const dayElement = STEM_ELEMENTS[result.dayPillar.stem];
  const phraseMap: Record<string, string> = {
    '木': '끊임없는 성장', '火': '불타는 열정', '土': '흔들리지 않는 안정', '金': '빛나는 결실', '水': '흐르는 지혜',
  };
  return phraseMap[dayElement] || '불타는 열정';
}

// 궁합 키워드 생성
function generateCompatibilityKeywords(result1: SajuResult, result2?: SajuResult): string[] {
  const elem1 = STEM_ELEMENTS[result1.dayPillar.stem];
  const elem2 = result2 ? STEM_ELEMENTS[result2.dayPillar.stem] : elem1;
  
  const compatKeywords: Record<string, Record<string, string[]>> = {
    '木': { '木': ['동반성장', '함께 도약'], '火': ['열정적 사랑', '서로 빛나는'], '土': ['안정적 관계', '성장의 기반'], '金': ['긴장과 성장', '서로 다듬는'], '水': ['깊은 이해', '자연스러운 흐름'] },
    '火': { '木': ['열정적 사랑', '서로 빛나는'], '火': ['뜨거운 열정', '함께 빛나는'], '土': ['따뜻한 안정', '든든한 사랑'], '金': ['극과 극의 매력', '강렬한 끌림'], '水': ['균형과 조화', '서로 채우는'] },
    '土': { '木': ['안정적 관계', '성장의 기반'], '火': ['따뜻한 안정', '든든한 사랑'], '土': ['깊은 신뢰', '변함없는 사랑'], '金': ['풍요로운 관계', '결실의 사랑'], '水': ['유연한 조화', '서로 보완'] },
    '金': { '木': ['긴장과 성장', '서로 다듬는'], '火': ['극과 극의 매력', '강렬한 끌림'], '土': ['풍요로운 관계', '결실의 사랑'], '金': ['단단한 유대', '함께 빛나는'], '水': ['흐르는 조화', '자연스러운 인연'] },
    '水': { '木': ['깊은 이해', '자연스러운 흐름'], '火': ['균형과 조화', '서로 채우는'], '土': ['유연한 조화', '서로 보완'], '金': ['흐르는 조화', '자연스러운 인연'], '水': ['깊은 공감', '마음이 통하는'] },
  };

  const keywords = compatKeywords[elem1]?.[elem2] || ['서로 이해', '함께 성장'];
  return [...keywords, '소울메이트', '운명적 만남'].slice(0, 4);
}

// 궁합 등급 텍스트
function getCompatibilityGrade(score: number): string {
  if (score >= 90) return '천생연분';
  if (score >= 80) return '최고의 궁합';
  if (score >= 70) return '좋은 궁합';
  if (score >= 60) return '보통의 궁합';
  if (score >= 50) return '노력이 필요한 궁합';
  return '상극의 궁합';
}

// 가족 조화 키워드 생성
function generateFamilyKeywords(memberNames: string[]): string[] {
  const keywords = ['가족 화합', '오행 조화', '함께 성장', '든든한 유대'];
  return keywords.slice(0, 4);
}

// ===== 카드 콘텐츠 생성 함수 =====

function getCardContent(props: FortuneShareCardProps) {
  const { type, result, userName } = props;

  if (type === 'compatibility') {
    const { name1, name2, score, loveScore, familyScore } = props;
    return {
      title: '궁합 분석 요약',
      subtitle: `${name1} ♥ ${name2}`,
      mainKeyword: getCompatibilityGrade(score),
      mainKeywordPrefix: '두 사람의 궁합은',
      mainKeywordSuffix: '입니다.',
      middleInfo: `궁합 점수: ${score}점`,
      keywords: generateCompatibilityKeywords(result, props.result2),
      bottomItems: [
        { label: '연애 궁합', value: `${loveScore || score}점` },
        { label: '가정 궁합', value: `${familyScore || score}점` },
        { label: '추천 활동', value: '함께 여행' },
      ],
      fileName: `muun_compatibility_${name1}_${name2}`,
      gaPage: 'compatibility',
    };
  }

  if (type === 'family') {
    const { memberNames, overallScore, harmony, luckyActivity } = props;
    const namesDisplay = memberNames.length > 3 
      ? `${memberNames.slice(0, 3).join(' · ')} 외 ${memberNames.length - 3}명`
      : memberNames.join(' · ');
    // 점수에 따른 짧은 키워드 생성
    const familyGrade = overallScore >= 90 ? '완벽한 조화'
      : overallScore >= 80 ? '최고의 가족'
      : overallScore >= 70 ? '따뜻한 가족'
      : overallScore >= 60 ? '성장하는 가족'
      : overallScore >= 50 ? '다채로운 가족'
      : '노력하는 가족';
    return {
      title: '가족사주 분석 요약',
      subtitle: namesDisplay,
      mainKeyword: familyGrade,
      mainKeywordPrefix: '우리 가족의 키워드는',
      mainKeywordSuffix: '입니다.',
      middleInfo: `가족 조화 점수: ${overallScore}점`,
      keywords: generateFamilyKeywords(memberNames),
      bottomItems: [
        { label: '조화 점수', value: `${overallScore}점` },
        { label: '추천 활동', value: luckyActivity || '가족 나들이' },
        { label: '가족 수', value: `${memberNames.length}명` },
      ],
      fileName: `muun_family_${memberNames.join('_')}`,
      gaPage: 'family_saju',
    };
  }

  // yearly / lifelong
  const yearLabel = type === 'yearly' ? '2026년 운세 요약' : '평생 사주 요약';
  return {
    title: yearLabel,
    subtitle: userName,
    mainKeyword: getMainKeywordPhrase(result),
    mainKeywordPrefix: `${userName}님의 키워드는`,
    mainKeywordSuffix: '입니다.',
    middleInfo: `오행 균형: ${getStrongestElementKorean(result)} 강함`,
    keywords: generateKeywords(result),
    bottomItems: [
      { label: '행운의 색', value: getLuckyColors(result) },
      { label: '조심할 달', value: getCautionMonths(result) },
      { label: '추천활동', value: getRecommendedActivity(result) },
    ],
    fileName: `muun_${type}_${userName}`,
    gaPage: type === 'yearly' ? 'yearly_fortune' : 'lifelong_saju',
  };
}

// ===== 메인 컴포넌트 =====

export default function FortuneShareCard(props: FortuneShareCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const content = getCardContent(props);

  const html2canvasOptions = useCallback((element: HTMLDivElement) => ({
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#0a0a1a',
    logging: false,
    width: element.offsetWidth,
    height: element.offsetHeight,
    onclone: (clonedDoc: Document) => {
      const root = clonedDoc.documentElement;
      root.style.setProperty('--background', '#0f1729');
      root.style.setProperty('--foreground', '#f5f5f5');
      root.style.setProperty('--card', 'rgba(25, 30, 55, 0.7)');
      root.style.setProperty('--card-foreground', '#f5f5f5');
      root.style.setProperty('--primary', '#ffd700');
      root.style.setProperty('--primary-foreground', '#0f1729');
      root.style.setProperty('--border', 'rgba(245, 245, 245, 0.08)');
      root.style.setProperty('--muted', 'rgba(40, 45, 70, 0.3)');
      root.style.setProperty('--muted-foreground', '#8888aa');
    },
  }), []);

  const captureAndDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);

    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(cardRef.current, html2canvasOptions(cardRef.current));

      const link = document.createElement('a');
      link.download = `${content.fileName}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      trackCustomEvent('share_card_download', {
        page: content.gaPage,
        user_name: props.userName,
      });
    } catch (error) {
      console.error('이미지 캡처 실패:', error);
      alert('이미지 생성에 실패했습니다. 스크린샷으로 저장해주세요.');
    } finally {
      setIsCapturing(false);
    }
  }, [props, content, html2canvasOptions]);

  const handleShareImage = useCallback(async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);

    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(cardRef.current, html2canvasOptions(cardRef.current));

      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) {
          setIsCapturing(false);
          return;
        }
        const file = new File([blob], `muun_fortune.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `무운 - ${content.title}`,
              text: `${content.subtitle}의 운세를 확인해보세요!`,
              files: [file],
            });
            trackCustomEvent('share_card_native_share', { page: content.gaPage });
          } catch (e) {
            // 사용자가 공유 취소
          }
        } else {
          const link = document.createElement('a');
          link.download = `${content.fileName}.png`;
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
  }, [props, content, html2canvasOptions]);

  // 카드 배경색 (타입별)
  const getBgGradient = () => {
    if (props.type === 'compatibility') return 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 30%, #1a0a2e 70%, #0d0520 100%)';
    if (props.type === 'family') return 'linear-gradient(135deg, #0a1a2e 0%, #1b2d4e 30%, #0a1a2e 70%, #05101d 100%)';
    return '#0a0a1a';
  };

  // 강조색 (타입별)
  const getAccentColor = () => {
    if (props.type === 'compatibility') return '#ff6b9d';
    if (props.type === 'family') return '#4ecdc4';
    return '#ffd700';
  };

  const accentColor = getAccentColor();

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
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.92)',
            overflowY: 'auto',
          }}
        >
          {/* 상단 닫기 버튼 */}
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
            >
              <X style={{ width: 24, height: 24 }} />
            </button>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>운세 카드 미리보기</span>
            <div style={{ width: '44px' }} />
          </div>

          {/* 카드 미리보기 - html2canvas 캡처 대상 */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '0 16px 16px' }}>
            <div
              ref={cardRef}
              style={{
                position: 'relative',
                width: '360px',
                overflow: 'hidden',
                borderRadius: '16px',
                fontFamily: "'Noto Serif KR', 'Nanum Myeongjo', serif",
                background: getBgGradient(),
              }}
            >
              {/* 배경 이미지 */}
              <img
                src="/assets/share-card-bg.png"
                alt=""
                style={{ width: '100%', height: 'auto', display: 'block' }}
                crossOrigin="anonymous"
              />

              {/* 텍스트 오버레이 */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8% 10%',
                }}
              >
                {/* 상단: 로고 + 타이틀 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '2%' }}>
                  <span
                    style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      color: '#d4a853',
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    MUUN
                  </span>
                  <h2
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      marginTop: '4px',
                      color: '#f0d78c',
                    }}
                  >
                    나의 {content.title}
                  </h2>
                </div>

                {/* 중앙: 핵심 키워드 문구 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '-5%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '4px' }}>
                      {content.mainKeywordPrefix}
                    </p>
                    <p
                      style={{
                        fontSize: '28px',
                        fontWeight: 800,
                        lineHeight: 1.2,
                        color: accentColor,
                        textShadow: `0 0 20px ${accentColor}44`,
                      }}
                    >
                      '{content.mainKeyword}'
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginTop: '4px' }}>{content.mainKeywordSuffix}</p>
                  </div>

                  {/* 중간 정보 */}
                  <div style={{ textAlign: 'center', marginTop: '8px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                      {content.middleInfo}
                    </p>
                  </div>

                  {/* 키워드 태그들 */}
                  <div style={{ textAlign: 'center', marginTop: '8px', lineHeight: '2.4' }}>
                    {content.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          padding: '8px 16px',
                          borderRadius: '9999px',
                          fontSize: '14px',
                          fontWeight: 700,
                          background: `linear-gradient(135deg, ${accentColor}33 0%, ${accentColor}18 100%)`,
                          border: `1px solid ${accentColor}66`,
                          color: '#f0d78c',
                          margin: '0 4px',
                        }}
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 하단: 요약 정보 + 푸터 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '2%', width: '100%' }}>
                  {/* 요약 정보 */}
                  <div
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      fontSize: '14px',
                      background: 'rgba(0,0,0,0.3)',
                      border: `1px solid ${accentColor}22`,
                    }}
                  >
                    {content.bottomItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: idx < content.bottomItems.length - 1 ? '8px' : '0' }}>
                        <span style={{ color: accentColor }}>●</span>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{item.label}:</span>
                        <span style={{ color: '#ffffff', fontWeight: 700 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* 푸터 */}
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '0.05em' }}>
                    더 자세한 내용은 <span style={{ color: '#d4a853' }}>muunsaju.com</span>에서
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 액션 버튼 */}
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '8px 16px 32px',
              display: 'flex',
              gap: '12px',
              position: 'sticky',
              bottom: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,1) 60%, rgba(0,0,0,0.9) 80%, transparent 100%)',
            }}
          >
            <button
              onClick={handleShareImage}
              disabled={isCapturing}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontWeight: 700,
                padding: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '48px',
                cursor: isCapturing ? 'not-allowed' : 'pointer',
                opacity: isCapturing ? 0.6 : 1,
                fontSize: '15px',
              }}
            >
              {isCapturing ? (
                <>
                  <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} />
                  이미지 생성 중...
                </>
              ) : (
                <>
                  <Share2 style={{ width: 20, height: 20 }} />
                  공유
                </>
              )}
            </button>
            <button
              onClick={captureAndDownload}
              disabled={isCapturing}
              style={{
                flex: 1,
                background: 'linear-gradient(to right, #7c3aed, #4f46e5)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                padding: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '48px',
                cursor: isCapturing ? 'not-allowed' : 'pointer',
                opacity: isCapturing ? 0.6 : 1,
                fontSize: '15px',
              }}
            >
              {isCapturing ? (
                <>
                  <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} />
                  이미지 생성 중...
                </>
              ) : (
                <>
                  <Download style={{ width: 20, height: 20 }} />
                  저장
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
