import { useState, useEffect } from 'react';
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Share2, Sparkles, User, Calendar,
  ScrollText, Briefcase, Target, TrendingUp, Building2,
  CheckSquare, AlertTriangle, RefreshCw, ChevronRight,
  Clock, Info,
} from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BirthTimeSelect } from '@/components/ui/birth-time-select';
import DatePickerInput from '@/components/DatePickerInput';
import RelatedServices from '@/components/RelatedServices';
import { shareContent } from '@/lib/share';
import { getHeroBirthForForm, isHeroBirthFresh } from '@/lib/user-birth';
import { convertToSolarDate } from '@/lib/lunar-converter';
import {
  calculateSaju, SajuResult, STEM_ELEMENTS,
  calculateElementBalance,
} from '@/lib/saju';
import { trackCustomEvent } from '@/lib/ga4';

// ─── 폼 스키마 ──────────────────────────────────────────────────────────────
const formSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  gender: z.enum(['male', 'female']),
  birthDate: z.string().min(1, '생년월일을 입력해주세요'),
  birthTime: z.string().default('12:00'),
  birthTimeUnknown: z.boolean().default(false),
  calendarType: z.enum(['solar', 'lunar']).default('solar'),
  isLeapMonth: z.boolean().default(false),
  // 재직 중 | 구직 중
  jobStatus: z.enum(['employed', 'seeking']).default('employed'),
});

type FormValues = z.infer<typeof formSchema>;

// ─── 결과 타입 ──────────────────────────────────────────────────────────────
interface CareerResult {
  name: string;
  gender: string;
  birthDate: string;
  jobStatus: 'employed' | 'seeking';
  dayElement: string;
  dayStem: string;
  score: number;
  headline: string;
  summary: string;
  overallText: string;
  goodMonths: { label: string; note: string }[];
  badMonths: { label: string; note: string }[];
  suitableFields: string;
  actionItems: string[];
  warningText: string;
}

// ─── 사주 기반 직업운 계산 ───────────────────────────────────────────────────
function generateCareerFortune(
  saju: SajuResult,
  name: string,
  gender: string,
  birthDate: string,
  jobStatus: 'employed' | 'seeking',
): CareerResult {
  const dayElement = STEM_ELEMENTS[saju.dayPillar.stem] ?? '木';
  const dayStem = saju.dayPillar.stem;
  const balance = calculateElementBalance(saju);

  // 관성(官星) 강도로 직업운 점수 추산 (55~95 범위)
  const guanScore = Math.min(95, Math.max(55, 65 + (balance.officialCount ?? 0) * 8 - (balance.conflictCount ?? 0) * 6));
  const score = guanScore;

  // 오행별 텍스트 맵
  const elementMap: Record<string, {
    headline: string; summary: string; overallText: string;
    goodMonths: { label: string; note: string }[];
    badMonths: { label: string; note: string }[];
    suitableFields: string;
    actionItems: string[];
    warningText: string;
  }> = {
    '木': {
      headline: score >= 75 ? '관운 상승 중 · 움직일 만한 시기' : '기반 다지기 · 준비가 먼저',
      summary: score >= 75
        ? '지금은 직업적 변화에 긍정적인 흐름입니다'
        : '성급한 이동보다 역량을 키우는 시기입니다',
      overallText: `목(木) 일간이신 ${name}님은 성장과 기획 분야에서 두각을 나타내는 기운을 타고나셨습니다. 올해 관성(官星)의 흐름이 ${score >= 75 ? '강해지면서 직업 변화에 유리한' : '약해진 상태로 섣부른 이동은 주의가 필요한'} 시기입니다. ${jobStatus === 'employed' ? '현재 직장에서의 성과를 인정받을 가능성이 높아지며, 이직 협상력도 높은 편입니다.' : '면접 운이 봄과 가을에 집중되어 있으므로 이 시기에 지원을 집중하면 좋습니다.'}`,
      goodMonths: [
        { label: '3 · 4월', note: '봄 기운 상승 · 적극 추천' },
        { label: '9 · 10월', note: '결실의 시기 · 추천' },
      ],
      badMonths: [
        { label: '6 · 7월', note: '충(沖) 주의 · 결정 보류' },
        { label: '12월', note: '동면기 · 탐색만' },
      ],
      suitableFields: '기획·교육·IT·콘텐츠·스타트업 환경에서 특히 강점을 발휘합니다. 규모보다 성장 가능성이 있는 조직이 잘 맞으며, 동쪽·남동쪽 방향의 직장이 유리합니다.',
      actionItems: jobStatus === 'employed'
        ? ['충(沖)이 드는 달엔 최종 결정을 미루고 탐색만 진행하세요', '계약서 서명은 3월·9월 중 길일을 골라 진행하면 좋습니다', '인맥보다 공개 채용 루트가 더 오래 이어지는 경향이 있습니다']
        : ['지원서는 3~4월 사이에 집중 발송하는 전략이 유효합니다', '면접 전날 충분한 수면과 수분 섭취로 목(木) 기운을 보충하세요', '자격증·포트폴리오 보완은 겨울(12~2월)에 완료해두면 좋습니다'],
      warningText: '목(木) 기운이 강한 분은 조급함이 단점입니다. 좋은 조건처럼 보여도 계약 조건을 꼼꼼히 확인하고, 구두 약속보다 서면으로 확인하는 습관을 들이세요.',
    },
    '火': {
      headline: score >= 75 ? '명예운 상승 · 커리어 도약 시기' : '열정 관리 · 번아웃 주의',
      summary: score >= 75 ? '리더십을 발휘할 기회가 찾아옵니다' : '에너지를 한 곳에 집중할 때입니다',
      overallText: `화(火) 일간이신 ${name}님은 리더십과 표현력이 뛰어난 기운을 지니고 있습니다. 올해 ${score >= 75 ? '명예운이 상승하면서 승진·이직 모두 좋은 흐름입니다.' : '에너지 소모가 크므로 한 가지에 집중하는 전략이 필요합니다.'} ${jobStatus === 'employed' ? '팀을 이끄는 역할을 맡게 되거나 스카우트 제안이 들어올 가능성이 있습니다.' : '영업·발표가 있는 직종에서 면접 인상이 특히 좋습니다.'}`,
      goodMonths: [
        { label: '4 · 5월', note: '화 기운 절정 · 적극 추천' },
        { label: '8 · 9월', note: '결실 시기 · 추천' },
      ],
      badMonths: [
        { label: '11 · 12월', note: '수극화(水剋火) · 신중' },
        { label: '1월', note: '기운 약화 · 준비만' },
      ],
      suitableFields: '영업·마케팅·방송·스타트업 창업·강의 분야가 잘 맞습니다. 남쪽 방향의 직장이나 밝고 활기찬 조직 문화를 가진 곳에서 빠르게 성과를 냅니다.',
      actionItems: jobStatus === 'employed'
        ? ['4~5월 사이에 연봉협상이나 이직 제안을 적극 진행하세요', '겨울철엔 에너지가 낮아지므로 중요한 결정은 봄으로 미루세요', '번아웃 신호가 오면 즉시 충전 시간을 확보하는 것이 장기 커리어에 유리합니다']
        : ['면접 시 열정과 성과 중심으로 어필하는 전략이 효과적입니다', '지원 시기는 4~5월이 가장 인상이 좋습니다', '직군보다 팀 문화·리더십을 꼼꼼히 확인하세요'],
      warningText: '화(火) 기운이 강한 분은 충동적인 이직 결정에 주의가 필요합니다. 좋은 조건에 흥분하기보다 3개월 후 본인의 모습을 차분히 그려보세요.',
    },
    '土': {
      headline: score >= 75 ? '안정 속 성장 · 신뢰 기반 이직 유리' : '내실 다지기 · 지금은 기다릴 때',
      summary: score >= 75 ? '신뢰를 쌓아온 결실이 나타납니다' : '묵묵히 실력을 쌓을 시기입니다',
      overallText: `토(土) 일간이신 ${name}님은 안정감과 신뢰가 강점인 기운을 지니고 있습니다. ${score >= 75 ? '올해는 그동안 쌓아온 신뢰가 직업적 기회로 연결되는 흐름입니다.' : '조급하게 움직이기보다 현재 위치에서 실력을 더 다져두는 것이 유리합니다.'} ${jobStatus === 'employed' ? '이직보다 현재 조직에서의 역할 확장이나 내부 승진이 더 유리할 수 있습니다.' : '장기 근속이 가능한 안정적인 조직을 선택하는 안목이 중요합니다.'}`,
      goodMonths: [
        { label: '5 · 6월', note: '토 기운 절정 · 적극 추천' },
        { label: '9 · 10월', note: '결실 시기 · 추천' },
      ],
      badMonths: [
        { label: '3 · 4월', note: '목극토(木剋土) · 신중' },
        { label: '11월', note: '기운 전환기 · 탐색만' },
      ],
      suitableFields: '금융·법무·행정·제조·부동산 분야가 잘 맞습니다. 안정적인 대기업이나 공공기관에서 지속적인 성장이 가능하며, 중앙·북동쪽 방향의 직장이 유리합니다.',
      actionItems: jobStatus === 'employed'
        ? ['현재 팀 내에서 신뢰를 쌓고 있다면 내부 이동을 먼저 검토해보세요', '이직을 결심했다면 레퍼런스 체크에 강한 지원자임을 어필하세요', '5~6월 사이에 움직이는 것이 가장 안정적인 결과를 냅니다']
        : ['지원 전 기업 안정성과 재무 상태를 꼼꼼히 확인하는 것이 중요합니다', '장기 근속 비율이 높은 조직이 본인에게 잘 맞습니다', '5~6월에 지원을 집중하면 합격 가능성이 올라갑니다'],
      warningText: '토(土) 기운이 강한 분은 변화 자체를 두려워해 기회를 놓치는 경우가 있습니다. 좋은 제안이 들어왔을 때 지나치게 오래 고민하지 않도록 의사결정 기한을 미리 정해두세요.',
    },
    '金': {
      headline: score >= 75 ? '결단의 시기 · 과감한 이동 유리' : '원칙 점검 · 무리한 도전은 자제',
      summary: score >= 75 ? '예리한 판단력이 빛을 발합니다' : '현재를 견고히 하는 데 집중하세요',
      overallText: `금(金) 일간이신 ${name}님은 판단력과 원칙이 강점인 기운을 지니고 있습니다. ${score >= 75 ? '올해는 과감한 결단이 좋은 결과로 이어지는 흐름입니다.' : '무리한 확장보다 현재 포지션을 단단히 하는 것이 나은 시기입니다.'} ${jobStatus === 'employed' ? '협상 테이블에서 본인 가치를 명확히 제시하는 것이 유리합니다.' : '기술력·전문성을 수치로 증명할 수 있는 포트폴리오 준비가 핵심입니다.'}`,
      goodMonths: [
        { label: '7 · 8월', note: '금 기운 절정 · 적극 추천' },
        { label: '10 · 11월', note: '추진력 시기 · 추천' },
      ],
      badMonths: [
        { label: '6월', note: '화극금(火剋金) · 결정 보류' },
        { label: '2 · 3월', note: '기운 약화 · 준비만' },
      ],
      suitableFields: 'IT·법률·금융·컨설팅·제조 엔지니어링 분야가 잘 맞습니다. 전문직 위주의 조직에서 두각을 나타내며, 서쪽·북서쪽 방향의 직장이 유리합니다.',
      actionItems: jobStatus === 'employed'
        ? ['연봉협상은 7~8월 사이가 가장 유리합니다', '원칙에 어긋나는 제안은 거절할 수 있는 배짱이 오히려 협상력을 높입니다', '직책보다 실질적 역할과 성장 가능성을 우선 확인하세요']
        : ['전문 자격증·수치화된 성과 중심으로 서류를 작성하세요', '7~8월 지원 집중 전략이 효과적입니다', '면접 시 지나치게 딱딱한 인상을 주지 않도록 유의하세요'],
      warningText: '금(金) 기운이 강한 분은 자존심으로 인해 좋은 기회를 스스로 차버리는 경우가 있습니다. 자신의 가치를 지키되, 유연하게 대화하는 연습이 필요합니다.',
    },
    '水': {
      headline: score >= 75 ? '지혜로운 선택 · 흐름을 타는 시기' : '깊이 있는 준비 · 때를 기다릴 때',
      summary: score >= 75 ? '직관과 네트워크가 기회를 만듭니다' : '지금은 배움과 탐색의 시기입니다',
      overallText: `수(水) 일간이신 ${name}님은 지혜와 직관이 뛰어난 기운을 지니고 있습니다. ${score >= 75 ? '올해는 인맥과 직관이 커리어 기회로 이어지는 흐름입니다.' : '새로운 것을 배우고 네트워크를 조용히 넓히는 시기로 활용하세요.'} ${jobStatus === 'employed' ? '뜻밖의 인맥을 통해 좋은 이직 제안이 들어올 가능성이 있습니다.' : '커뮤니티 활동이나 오픈소스·SNS 활동이 취업으로 연결될 수 있습니다.'}`,
      goodMonths: [
        { label: '11 · 12월', note: '수 기운 절정 · 적극 추천' },
        { label: '1 · 2월', note: '지혜 발동 시기 · 추천' },
      ],
      badMonths: [
        { label: '5 · 6월', note: '토극수(土剋水) · 결정 보류' },
        { label: '9월', note: '기운 전환 · 탐색만' },
      ],
      suitableFields: 'R&D·데이터·철학·심리·금융분석·글로벌 비즈니스 분야가 잘 맞습니다. 자율적이고 지적 자극이 있는 환경에서 최고 성과를 냅니다. 북쪽·북서쪽 방향이 유리합니다.',
      actionItems: jobStatus === 'employed'
        ? ['11~12월에 이직 활동을 집중하면 연말 채용 시즌과 맞닿아 유리합니다', '인맥을 통한 이직이 조건이나 문화 적합성 면에서 더 좋은 결과를 낳는 경향이 있습니다', '조용히 움직이되 결정적인 순간엔 과감하게 행동하세요']
        : ['커뮤니티·스터디·오픈소스를 통한 간접 어필 전략이 잘 맞습니다', '서류보다 과정과 맥락을 설명하는 포트폴리오가 더 효과적입니다', '11~12월 집중 지원 전략을 추천합니다'],
      warningText: '수(水) 기운이 강한 분은 너무 많은 가능성을 열어두다가 결정을 미루는 경향이 있습니다. 탐색 기간을 미리 정하고 그 이후엔 과감하게 선택하는 훈련이 필요합니다.',
    },
  };

  const config = elementMap[dayElement] ?? elementMap['木'];

  return {
    name,
    gender,
    birthDate,
    jobStatus,
    dayElement,
    dayStem,
    score,
    ...config,
  };
}

// ─── 점수 색상 ────────────────────────────────────────────────────────────
function getScoreColor(s: number) {
  if (s >= 85) return '#059669';
  if (s >= 70) return '#d97706';
  return '#dc2626';
}

function getScoreLabel(s: number) {
  if (s >= 85) return '매우 유리';
  if (s >= 70) return '양호';
  if (s >= 55) return '보통';
  return '주의';
}

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────
export default function CareerFortune() {
  useCanonical('/career-fortune');

  const [result, setResult] = useState<CareerResult | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      gender: 'male',
      birthDate: '',
      birthTime: '12:00',
      birthTimeUnknown: false,
      calendarType: 'solar',
      isLeapMonth: false,
      jobStatus: 'employed',
    },
  });

  const watchedBirthDate = form.watch('birthDate');
  const watchedGender = form.watch('gender');
  const watchedCalendarType = form.watch('calendarType');
  useEffect(() => {
    if (!initialLoadDone) return;
    setResult(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedBirthDate, watchedGender, watchedCalendarType]);

  // localStorage 복원
  useEffect(() => {
    const heroBirth = getHeroBirthForForm();
    if (heroBirth && isHeroBirthFresh()) {
      form.setValue('birthDate', heroBirth.birthDate);
      form.setValue('calendarType', heroBirth.calendarType);
      form.setValue('birthTime', heroBirth.birthTime);
      form.setValue('birthTimeUnknown', heroBirth.birthTimeUnknown);
      setTimeout(() => setInitialLoadDone(true), 100);
      return;
    }
    const savedData = localStorage.getItem('muun_user_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset({
          ...form.getValues(),
          ...parsed,
          birthDate: /^\d{4}-\d{2}-\d{2}$/.test(parsed.birthDate) ? parsed.birthDate : '',
          birthTime: /^\d{2}:\d{2}$/.test(parsed.birthTime) ? parsed.birthTime : '12:00',
        });
        setTimeout(() => setInitialLoadDone(true), 100);
        return;
      } catch { /* skip */ }
    }
    if (heroBirth) {
      form.setValue('birthDate', heroBirth.birthDate);
      form.setValue('calendarType', heroBirth.calendarType);
      form.setValue('birthTime', heroBirth.birthTime);
      form.setValue('birthTimeUnknown', heroBirth.birthTimeUnknown);
    }
    setTimeout(() => setInitialLoadDone(true), 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: FormValues) => {
    let birthDateStr = data.birthDate;
    if (typeof birthDateStr === 'string') {
      birthDateStr = birthDateStr.replace(/[./]/g, '-').replace(/\s/g, '');
      if (/^\d{8}$/.test(birthDateStr)) {
        birthDateStr = `${birthDateStr.slice(0, 4)}-${birthDateStr.slice(4, 6)}-${birthDateStr.slice(6, 8)}`;
      }
    }
    const dateParts = String(birthDateStr).match(/\d+/g);
    if (!dateParts || dateParts.length < 3) {
      form.setError('birthDate', { message: '생년월일 형식이 올바르지 않습니다' });
      return;
    }
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);
    const birthDateObj = new Date(year, month, day);
    if (isNaN(birthDateObj.getTime())) {
      form.setError('birthDate', { message: '올바른 날짜를 입력해주세요' });
      return;
    }

    localStorage.setItem('muun_user_data', JSON.stringify(data));

    trackCustomEvent('check_fortune_result', {
      fortune_type: '취업이직운',
      gender: data.gender,
      birth_year: birthDateObj.getFullYear(),
      calendar_type: data.calendarType,
      job_status: data.jobStatus,
    });

    const rawTime = data.birthTimeUnknown ? '12:00' : data.birthTime;
    const time = /^\d{2}:\d{2}$/.test(rawTime) ? rawTime : '12:00';
    const birthDateStrForConverter = `${birthDateObj.getFullYear()}-${String(birthDateObj.getMonth() + 1).padStart(2, '0')}-${String(birthDateObj.getDate()).padStart(2, '0')}`;
    const date = convertToSolarDate(birthDateStrForConverter, time, data.calendarType, data.isLeapMonth);
    const sajuResult = calculateSaju(date, data.gender);
    const careerResult = generateCareerFortune(sajuResult, data.name, data.gender, birthDateStr, data.jobStatus);

    setResult(careerResult);
    window.scrollTo(0, 0);
  };

  const commonMaxWidth = 'w-full';

  // ─── 입력 폼 화면 ────────────────────────────────────────────────────────
  if (!result) {
    return (
      <>
        <Helmet>
          <title>취업·이직운 - 사주로 보는 직업운과 이직 적기 | 무운 (MuUn)</title>
          <meta name="description" content="사주팔자로 보는 2026년 취업·이직운. 지금 움직여도 될까요? 이직 적기·주의 시기·잘 맞는 직종까지 무료로 확인하세요." />
          <meta name="keywords" content="취업운, 이직운, 직업운, 사주 이직, 취업 사주, 이직 적기, 무운" />
          <link rel="canonical" href="https://muunsaju.com/career-fortune" />
          <meta property="og:title" content="취업·이직운 - 사주로 보는 직업운과 이직 적기 | 무운 (MuUn)" />
          <meta property="og:description" content="사주팔자로 보는 2026년 취업·이직운. 이직 적기·주의 시기·잘 맞는 직종까지 무료로 확인하세요." />
          <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
          <meta property="og:type" content="website" />
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: '무료 취업·이직운 사주',
              description: '사주팔자로 보는 취업·이직운과 직업 적기 분석 서비스',
              provider: { '@type': 'Organization', name: '무운 (MuUn)', url: 'https://muunsaju.com' },
              url: 'https://muunsaju.com/career-fortune',
              serviceType: '취업이직운 사주',
              areaServed: 'KR',
              isAccessibleForFree: true,
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
            })}
          </script>
        </Helmet>

        <div className="mu-subpage-screen min-h-screen bg-[#F5F4F8] text-foreground pb-16 antialiased">
          <header className="mu-subpage-header sticky top-[82px] z-50 bg-white border-b border-black/[0.06]">
            <div className="w-full px-4 h-14 flex items-center">
              <Link href="/">
                <Button variant="ghost" className="mr-2 text-[#191F28] hover:bg-black/[0.06] -ml-2 flex items-center gap-1 text-sm font-medium">
                  <ChevronLeft className="h-5 w-5" />
                  <span>홈</span>
                </Button>
              </Link>
              <h2 className="text-base font-bold text-[#191F28]">취업·이직운</h2>
            </div>
          </header>

          <main className="mu-service-main relative z-10 w-full px-4 py-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`${commonMaxWidth} space-y-5`}
            >
              {/* 히어로 */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#6B5FFF]/20 text-[#6B5FFF] text-xs font-medium">
                  <Briefcase className="w-3 h-3" />
                  <span>사주로 보는 직업운</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#191F28]">취업·이직운</h2>
                <p className="text-muted-foreground text-xs md:text-sm">
                  지금 움직이면 될까요? 이직 적기와 잘 맞는 직종을 사주로 확인하세요
                </p>
              </div>

              {/* 입력 카드 */}
              <Card className="bg-white rounded-2xl shadow-sm border border-black/[0.06] overflow-hidden">
                <CardHeader className="border-b border-black/[0.06] px-4 py-3 md:px-6">
                  <CardTitle className="text-[#191F28] flex items-center gap-2 text-base">
                    <div className="w-8 h-8 rounded-lg bg-[#6B5FFF]/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#6B5FFF]" />
                    </div>
                    운세 정보 입력
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* 현재 상황 선택 */}
                    <div className="space-y-1.5">
                      <Label className="text-[#191F28] text-sm font-medium flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#6B5FFF]" />
                        현재 상황
                      </Label>
                      <ToggleGroup
                        type="single"
                        value={form.watch('jobStatus')}
                        onValueChange={(value) => { if (value) form.setValue('jobStatus', value as 'employed' | 'seeking'); }}
                        className="w-full h-11 grid grid-cols-2 gap-[3px] bg-[#EDE8E8] rounded-xl p-[3px]"
                      >
                        <ToggleGroupItem
                          value="employed"
                          className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-[#6B5FFF] data-[state=on]:shadow-sm text-[#4E5968] transition-all font-medium text-sm flex items-center gap-1.5"
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          재직 중 (이직)
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="seeking"
                          className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-[#6B5FFF] data-[state=on]:shadow-sm text-[#4E5968] transition-all font-medium text-sm flex items-center gap-1.5"
                        >
                          <Target className="w-3.5 h-3.5" />
                          구직 중 (취업)
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    {/* 이름 + 성별 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-[#191F28] text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#6B5FFF]" />
                          이름
                        </Label>
                        <Input
                          id="name"
                          placeholder="이름"
                          {...form.register('name')}
                          className="h-11 bg-[#F7F5F3] border-[#E8E5E0] text-[#191F28] placeholder:text-[#b0ada6] rounded-xl focus:ring-[#6B5FFF]/30 focus:border-[#6B5FFF] transition-all text-sm"
                        />
                        {form.formState.errors.name && (
                          <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[#191F28] text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#6B5FFF]" />
                          성별
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch('gender')}
                          onValueChange={(value) => { if (value) form.setValue('gender', value as 'male' | 'female'); }}
                          className="w-full h-11 grid grid-cols-2 gap-[3px] bg-[#EDE8E8] rounded-xl p-[3px]"
                        >
                          <ToggleGroupItem value="male" className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-[#6B5FFF] data-[state=on]:shadow-sm text-[#4E5968] transition-all font-medium text-sm">남성</ToggleGroupItem>
                          <ToggleGroupItem value="female" className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-[#6B5FFF] data-[state=on]:shadow-sm text-[#4E5968] transition-all font-medium text-sm">여성</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>

                    {/* 생년월일 + 양음력 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthDate" className="text-[#191F28] text-sm font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#6B5FFF]" />
                          생년월일
                        </Label>
                        <DatePickerInput
                          id="birthDate"
                          {...form.register('birthDate')}
                          value={form.watch('birthDate')}
                          accentColor="purple"
                        />
                        {form.formState.errors.birthDate && (
                          <p className="text-xs text-red-500">{form.formState.errors.birthDate.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[#191F28] text-sm font-medium flex items-center gap-1.5">
                          <ScrollText className="w-3.5 h-3.5 text-[#6B5FFF]" />
                          날짜 구분
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch('calendarType')}
                          onValueChange={(value) => {
                            if (value) {
                              form.setValue('calendarType', value as 'solar' | 'lunar');
                              if (value === 'solar') form.setValue('isLeapMonth', false);
                            }
                          }}
                          className="w-full h-11 grid grid-cols-2 gap-[3px] bg-[#EDE8E8] rounded-xl p-[3px]"
                        >
                          <ToggleGroupItem value="solar" className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-[#6B5FFF] data-[state=on]:shadow-sm text-[#4E5968] transition-all font-medium text-sm">양력</ToggleGroupItem>
                          <ToggleGroupItem value="lunar" className="h-full rounded-lg data-[state=on]:bg-white data-[state=on]:text-[#6B5FFF] data-[state=on]:shadow-sm text-[#4E5968] transition-all font-medium text-sm">음력</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>

                    {/* 윤달 */}
                    {form.watch('calendarType') === 'lunar' && (
                      <div className="flex items-center gap-2 px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <Checkbox
                            checked={form.watch('isLeapMonth') || false}
                            onCheckedChange={(checked) => form.setValue('isLeapMonth', checked === true)}
                            className="data-[state=checked]:bg-[#6B5FFF] data-[state=checked]:border-[#6B5FFF]"
                          />
                          <span className="text-sm text-[#191F28] group-hover:text-[#6B5FFF] transition-colors">윤달인 경우 체크</span>
                        </label>
                      </div>
                    )}

                    {/* 태어난 시간 */}
                    <div className="space-y-1.5">
                      <Label className="text-[#191F28] text-sm font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#6B5FFF]" />
                        태어난 시간
                      </Label>
                      <BirthTimeSelect
                        value={form.watch('birthTime')}
                        onChange={(val) => form.setValue('birthTime', val)}
                        onUnknownChange={(isUnknown) => {
                          form.setValue('birthTimeUnknown', isUnknown);
                          if (isUnknown) form.setValue('birthTime', '12:00');
                        }}
                        isUnknown={form.watch('birthTimeUnknown')}
                        accentClass="focus:ring-[#6B5FFF]/30 focus:border-[#6B5FFF]"
                      />
                    </div>

                    {/* 안내 */}
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-[#6B5FFF]/5 border border-[#6B5FFF]/10">
                      <Info className="w-3.5 h-3.5 text-[#6B5FFF] mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-[#4E5968] leading-relaxed">
                        사주는 고정된 미래가 아닌 <strong className="text-[#6B5FFF]">운의 흐름</strong>을 보는 것입니다. 현명한 선택을 위한 참고 자료로 활용해보세요.
                      </p>
                    </div>

                    {/* 제출 버튼 */}
                    <Button
                      type="submit"
                      style={{ background: 'linear-gradient(135deg, #6B5FFF, #4F46E5)' }}
                      className="w-full h-12 text-white font-bold text-sm rounded-xl shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      취업·이직운 보기
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* 특징 카드 3개 */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {[
                  { icon: TrendingUp, label: '이직 적기', desc: '월별 흐름 분석' },
                  { icon: Building2, label: '적합 직종', desc: '오행 기반 매칭' },
                  { icon: CheckSquare, label: '행동 지침', desc: '구체적 가이드' },
                ].map(({ icon: Icon, label, desc }) => (
                  <Card key={label} className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                    <CardContent className="p-2.5 md:p-3 text-center space-y-1">
                      <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#6B5FFF]/10 flex items-center justify-center mx-auto">
                        <Icon className="w-4 h-4 text-[#6B5FFF]" />
                      </div>
                      <p className="text-xs font-medium text-[#191F28]">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </main>
        </div>
      </>
    );
  }

  // ─── 결과 화면 ──────────────────────────────────────────────────────────
  const scoreColor = getScoreColor(result.score);
  const scoreLabel = getScoreLabel(result.score);

  return (
    <>
      <Helmet>
        <title>{result.name}님의 취업·이직운 결과 - 무운</title>
        <meta name="description" content={`${result.name}님의 사주로 보는 취업·이직운 분석 결과입니다. ${result.headline}`} />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mu-subpage-screen min-h-screen bg-[#F5F4F8] text-foreground pb-16 antialiased">
        <header className="mu-subpage-header sticky top-[82px] z-50 bg-white border-b border-black/[0.06]">
          <div className="w-full px-4 h-14 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="mr-2 text-[#191F28] hover:bg-black/[0.06] -ml-2 flex items-center gap-1 text-sm font-medium"
                onClick={() => setResult(null)}
              >
                <ChevronLeft className="h-5 w-5" />
                <span>다시입력</span>
              </Button>
              <h1 className="text-base font-bold text-[#191F28]">취업·이직운 결과</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#6B5FFF] min-w-[44px] min-h-[44px]"
              onClick={() => shareContent({ title: '무운 취업·이직운', text: `${result.name}님의 직업운 분석 결과`, page: 'career-fortune', buttonType: 'icon' })}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="mu-service-main relative z-10 px-4 py-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${commonMaxWidth} space-y-5`}
          >
            {/* 결과 히어로 */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#6B5FFF]/20 text-[#6B5FFF] text-xs font-medium">
                <Briefcase className="w-3 h-3" />
                <span>{result.jobStatus === 'employed' ? '이직운' : '취업운'} · {result.dayElement}({result.dayStem}) 일간</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#191F28]">
                {result.name}님의 {result.jobStatus === 'employed' ? '이직' : '취업'} 사주 풀이
              </h2>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
            </div>

            {/* 점수 카드 */}
            <Card className="bg-white border border-black/[0.06] rounded-2xl shadow-sm overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-3 border-b border-black/[0.06]"
                style={{ background: `${scoreColor}12` }}
              >
                <div className="flex items-center gap-2 text-sm font-bold" style={{ color: scoreColor }}>
                  <TrendingUp className="w-4 h-4" />
                  직업운 점수
                </div>
                <div
                  className="px-3 py-1 rounded-full text-sm font-bold text-white"
                  style={{ background: scoreColor }}
                >
                  {result.score}점 · {scoreLabel}
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                {/* 헤드라인 + 게이지 */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${scoreColor}15` }}
                  >
                    <TrendingUp className="w-5 h-5" style={{ color: scoreColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-[#191F28] mb-2">{result.headline}</p>
                    <div className="h-2 rounded-full bg-black/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-2 rounded-full"
                        style={{ background: scoreColor }}
                      />
                    </div>
                  </div>
                </div>
                {/* 총평 본문 — text-base로 통일 */}
                <p className="text-base text-[#4E5968] leading-relaxed">{result.overallText}</p>
              </CardContent>
            </Card>

            {/* 이직/취업 적기 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-black/10 pb-3">
                <div className="w-8 h-8 rounded-lg bg-[#6B5FFF]/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#6B5FFF]" />
                </div>
                <h3 className="text-base font-bold text-[#191F28]">
                  {result.jobStatus === 'employed' ? '이직' : '취업'} 적기 · 주의 시기
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {result.goodMonths.map((m) => (
                  <Card key={m.label} className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                    <CardContent className="p-3 text-center space-y-1">
                      <p className="text-base font-bold text-emerald-600">{m.label}</p>
                      <p className="text-sm text-muted-foreground">{m.note}</p>
                    </CardContent>
                  </Card>
                ))}
                {result.badMonths.map((m) => (
                  <Card key={m.label} className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                    <CardContent className="p-3 text-center space-y-1">
                      <p className="text-base font-bold text-rose-500">{m.label}</p>
                      <p className="text-sm text-muted-foreground">{m.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* 잘 맞는 직종 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-black/10 pb-3">
                <div className="w-8 h-8 rounded-lg bg-[#6B5FFF]/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-[#6B5FFF]" />
                </div>
                <h3 className="text-base font-bold text-[#191F28]">잘 맞는 직종 · 방향</h3>
              </div>
              <Card className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <p className="text-base text-[#4E5968] leading-relaxed">{result.suitableFields}</p>
                </CardContent>
              </Card>
            </section>

            {/* 행동 지침 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-black/10 pb-3">
                <div className="w-8 h-8 rounded-lg bg-[#6B5FFF]/20 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-[#6B5FFF]" />
                </div>
                <h3 className="text-base font-bold text-[#191F28]">
                  {result.jobStatus === 'employed' ? '이직 전 챙겨야 할 것' : '취업 준비 포인트'}
                </h3>
              </div>
              <div className="space-y-2">
                {result.actionItems.map((item, i) => (
                  <Card key={i} className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                    <CardContent className="p-3 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#6B5FFF] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-base text-[#4E5968] leading-relaxed">{item}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* 주의 사항 */}
            <Card className="bg-[#6B5FFF]/5 border-[#6B5FFF]/20 rounded-xl overflow-hidden">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-[#6B5FFF] mt-1 flex-shrink-0" />
                <p className="text-sm text-[#4E5968] leading-relaxed">{result.warningText}</p>
              </CardContent>
            </Card>

            {/* 연계 서비스 배너 — Link>a 중첩 제거 */}
            <Link href="/lifelong-saju"
              className="rounded-2xl p-4 flex items-center gap-4 block"
              style={{ background: 'linear-gradient(135deg, #2D1B5E, #1A0F3C)' }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/60 mb-0.5">더 깊이 알고 싶다면</p>
                <p className="text-sm font-bold text-white">평생사주로 직업운 상세 분석 보기</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </Link>

            {/* 다시 분석 + 공유 */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-11 font-bold text-sm rounded-xl border-black/[0.12] text-[#191F28]"
                onClick={() => setResult(null)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다시 분석하기
              </Button>
              <Button
                className="flex-1 h-11 font-bold text-sm rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #6B5FFF, #4F46E5)' }}
                onClick={() => shareContent({ title: '무운 취업·이직운', text: `${result.name}님의 직업운 분석 결과 — ${result.headline}`, page: 'career-fortune', buttonType: 'text_button' })}
              >
                <Share2 className="w-4 h-4 mr-2" />
                결과 공유하기
              </Button>
            </div>

            <RelatedServices
              title="함께 보면 좋은 서비스"
              services={[
                { href: '/lifelong-saju', emoji: '✨', label: '평생사주', description: '타고난 직업운과 재물운을 사주팔자로 더 깊이 살펴보세요.' },
                { href: '/daily-fortune', emoji: '📅', label: '오늘의 운세', description: '오늘 면접·업무에 임하는 기운의 흐름을 확인해보세요.' },
                { href: '/compatibility', emoji: '💞', label: '궁합', description: '직장 상사·동료와의 관계 운도 함께 확인해보세요.' },
                { href: '/yearly-fortune', emoji: '📆', label: '신년운세', description: '올해 전체적인 운의 흐름과 커리어 방향을 확인하세요.' },
              ]}
            />
          </motion.div>
        </main>
      </div>
    </>
  );
}
