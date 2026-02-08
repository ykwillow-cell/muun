import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SajuResult, calculateElementBalance, STEM_ELEMENTS, ELEMENT_LUCKY_DATA, FiveElement } from "@/lib/saju";
import { STEM_PERSONALITY, ELEMENT_READINGS, analyzeElementBalance } from "@/lib/saju-reading";
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

      // 모바일 환경 감지
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        // 모바일: blob으로 변환 후 다운로드 또는 새 탭 열기
        canvas.toBlob((blob) => {
          if (!blob) {
            alert('이미지 생성에 실패했습니다.');
            setIsCapturing(false);
            return;
          }
          
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${content.fileName}_${Date.now()}.png`;
          
          // iOS Safari는 download 속성을 지원하지 않으므로 새 탭에서 열기
          if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.open(url, '_blank');
          } else {
            link.click();
          }
          
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 'image/png');
      } else {
        // PC: 기존 방식
        const link = document.createElement('a');
        link.download = `${content.fileName}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }

      trackCustomEvent('share_card_download', {
        page: content.gaPage,
        user_name: props.userName,
        device: isMobile ? 'mobile' : 'desktop',
      });
    } catch (error) {
      console.error('이미지 캡처 실패:', error);
      alert('이미지 생성에 실패했습니다. 스크린샷으로 저장해주세요.');
    } finally {
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
    <div className="w-full max-w-4xl mx-auto space-y-6 py-8">
      {/* 운세 카드 직접 노출 */}
      <div
        ref={cardRef}
        style={{
          width: '100%',
          maxWidth: '420px',
          margin: '0 auto',
          aspectRatio: '9/16',
          background: getBgGradient(),
          borderRadius: '24px',
          border: `2px solid ${accentColor}`,
          boxShadow: `0 0 40px ${accentColor}40`,
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 별 효과 */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>

        {/* 상단: 로고 + 제목 */}
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{ fontSize: '32px', fontWeight: 900, color: accentColor, marginBottom: '8px', letterSpacing: '2px' }}>
            MUUN
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#f5f5f5', opacity: 0.9 }}>
            {content.title}
          </div>
          <div style={{ fontSize: '14px', color: '#aaa', marginTop: '4px' }}>
            {content.subtitle}
          </div>
        </div>

        {/* 중앙: 메인 키워드 */}
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '12px' }}>
            {content.mainKeywordPrefix}
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 900,
              color: accentColor,
              textShadow: `0 0 20px ${accentColor}`,
              marginBottom: '12px',
              lineHeight: 1.3,
            }}
          >
            '{content.mainKeyword}'
          </div>
          <div style={{ fontSize: '14px', color: '#ccc' }}>
            {content.mainKeywordSuffix}
          </div>
          <div style={{ fontSize: '13px', color: '#999', marginTop: '16px' }}>
            {content.middleInfo}
          </div>
        </div>

        {/* 키워드 태그 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', zIndex: 1 }}>
          {content.keywords.map((kw, idx) => (
            <div
              key={idx}
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: `${accentColor}20`,
                border: `1px solid ${accentColor}60`,
                color: accentColor,
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              #{kw}
            </div>
          ))}
        </div>

        {/* 하단: 상세 정보 */}
        <div style={{ zIndex: 1 }}>
          {content.bottomItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: idx < content.bottomItems.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}
            >
              <span style={{ fontSize: '13px', color: '#aaa' }}>🔮 {item.label}:</span>
              <span style={{ fontSize: '13px', color: '#f5f5f5', fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* 푸터 */}
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#666', zIndex: 1 }}>
          더 자세한 내용은 <span style={{ color: accentColor }}>muunsaju.com</span>에서
        </div>
      </div>

      {/* 이미지 저장 버튼 */}
      <div className="flex justify-center">
        <Button
          onClick={captureAndDownload}
          disabled={isCapturing}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 min-h-[48px]"
        >
          {isCapturing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              이미지 생성 중...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              운세 카드 이미지 저장
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
