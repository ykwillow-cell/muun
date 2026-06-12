import { useState, useEffect } from 'react';
import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Share2, Sparkles, User, Calendar,
  ScrollText, Home, MapPin, Compass, CheckSquare,
  AlertTriangle, RefreshCw, ChevronRight, Clock, Info,
  TrendingUp,
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
  ELEMENT_LUCKY_DATA, calculateElementBalance,
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
  // 이사 목적
  movingReason: z.enum(['new_home', 'job', 'marriage', 'school', 'etc']).default('new_home'),
});

type FormValues = z.infer<typeof formSchema>;

const MOVING_REASON_LABELS: Record<string, string> = {
  new_home: '새 보금자리',
  job: '직장 이동',
  marriage: '결혼·독립',
  school: '학업',
  etc: '기타',
};

// ─── 결과 타입 ──────────────────────────────────────────────────────────────
interface MovingResult {
  name: string;
  dayElement: string;
  dayStem: string;
  score: number;
  headline: string;
  summary: string;
  overallText: string;
  luckyDirections: { label: string; note: string }[];
  avoidDirections: { label: string; note: string }[];
  goodMonths: { label: string; note: string }[];
  badMonths: { label: string; note: string }[];
  homeFeatures: string;
  actionItems: string[];
  warningText: string;
}

// ─── 이사운 계산 ─────────────────────────────────────────────────────────────
function generateMovingFortune(
  saju: SajuResult,
  name: string,
  movingReason: string,
): MovingResult {
  const dayElement = STEM_ELEMENTS[saju.dayPillar.stem] ?? '木';
  const dayStem = saju.dayPillar.stem;
  const balance = calculateElementBalance(saju);
  const luckyData = ELEMENT_LUCKY_DATA[dayElement as keyof typeof ELEMENT_LUCKY_DATA];

  // 재성·인성 강도로 이사운 점수 추산 (55~95)
  const baseScore = Math.min(95, Math.max(55,
    68 + (balance.resourceCount ?? 0) * 6 - (balance.conflictCount ?? 0) * 5
  ));

  const elementMap: Record<string, {
    headline: string; summary: string; overallText: string;
    luckyDirections: { label: string; note: string }[];
    avoidDirections: { label: string; note: string }[];
    goodMonths: { label: string; note: string }[];
    badMonths: { label: string; note: string }[];
    homeFeatures: string;
    actionItems: string[];
    warningText: string;
  }> = {
    '木': {
      headline: baseScore >= 75 ? '새 터전에서 성장할 기운 · 이사 길조' : '환경 변화는 신중히 · 준비 후 이동',
      summary: baseScore >= 75 ? '동쪽·남동쪽으로 향하는 이사가 기운을 키웁니다' : '이사보다 현재 환경을 정비하는 것이 먼저입니다',
      overallText: `목(木) 일간이신 ${name}님은 성장과 상승의 기운을 지니고 있습니다. ${baseScore >= 75 ? '올해 인성(印星)의 흐름이 좋아 새로운 환경으로의 이동이 안정적인 정착으로 이어질 가능성이 높습니다.' : '재성(財星)이 약해진 시기로, 이사 비용·계약 조건을 꼼꼼히 살피는 것이 중요합니다.'} ${movingReason === 'marriage' ? '혼인을 앞두고 이사한다면 신혼집 방향을 동쪽으로 잡는 것이 두 사람의 기운을 모두 살려줍니다.' : movingReason === 'job' ? '직장 이동으로 인한 이사라면 직장과의 거리가 가까울수록 목(木) 기운이 활성화됩니다.' : '새 보금자리에서 나무나 식물을 두면 목 기운이 보강됩니다.'}`,
      luckyDirections: [
        { label: '동쪽', note: '목 기운 강화 · 1순위 추천' },
        { label: '남동쪽', note: '성장·재물 연결 · 2순위' },
      ],
      avoidDirections: [
        { label: '서쪽', note: '금극목(金剋木) · 충돌 기운' },
        { label: '북서쪽', note: '기운 억제 · 피하는 것이 좋음' },
      ],
      goodMonths: [
        { label: '3 · 4월', note: '목 기운 절정 · 적극 추천' },
        { label: '9 · 10월', note: '결실 시기 · 추천' },
      ],
      badMonths: [
        { label: '7 · 8월', note: '화기 과다 · 체력 소모 주의' },
        { label: '12월', note: '동면기 · 이사 보류 권장' },
      ],
      homeFeatures: '채광이 좋고 녹색 공간(공원·나무)이 가까운 집이 목(木) 일간에게 가장 잘 맞습니다. 층수는 중간층 이상이 좋으며, 거실이 동향·남향을 바라보는 구조를 우선하세요. 인테리어는 목재·식물을 활용한 내추럴 톤이 기운을 살려줍니다.',
      actionItems: movingReason === 'new_home'
        ? ['이사 날짜는 3월·9월 중 손 없는 날을 택하면 좋습니다', '집들이는 이사 후 1주일 이내 가까운 지인과 함께 하면 기운이 안정됩니다', '현관에 작은 화분이나 식물을 놓으면 목 기운을 보충해줍니다']
        : movingReason === 'marriage'
        ? ['혼인 신고와 이사 날짜를 같은 달 안에 맞추면 기운이 겹쳐 좋습니다', '신혼집 침실은 동향이나 남향을 우선하세요', '새 집에 처음 들어갈 때 소금을 현관 근처에 잠시 뿌려두면 이물 기운을 정화하는 풍습이 있습니다']
        : ['이사 전 현재 집을 깨끗이 청소하고 불필요한 물건을 버리세요', '계약서 서명은 3월·9월 길일을 택하면 좋습니다', '이사 당일 아침에 간단한 새 소금·쌀 정화 의식을 하는 전통이 있습니다'],
      warningText: '목(木) 기운이 강한 분은 마음에 드는 집을 보면 충동적으로 계약하는 경향이 있습니다. 계약 전 반드시 등기부등본·전입세대 열람으로 권리 관계를 확인하세요.',
    },
    '火': {
      headline: baseScore >= 75 ? '남향 밝은 집 · 명예운과 함께 상승' : '과열 주의 · 조용한 환경이 우선',
      summary: baseScore >= 75 ? '밝고 활기찬 남향 집이 기운을 극대화합니다' : '복잡한 환경보다 조용한 곳에서 재충전이 필요합니다',
      overallText: `화(火) 일간이신 ${name}님은 열정과 표현력이 강점인 기운을 지니고 있습니다. ${baseScore >= 75 ? '올해 관성(官星)의 흐름이 좋아 이사가 새로운 도약의 발판이 될 수 있습니다.' : '에너지 소모가 큰 시기이므로 이사 준비 과정에서 무리하지 않도록 주의하세요.'} ${movingReason === 'marriage' ? '신혼집은 남향·남동향의 밝은 공간이 두 사람의 에너지를 더해줍니다.' : '주변에 활기 있는 커뮤니티가 있는 동네가 화 기운을 살려줍니다.'}`,
      luckyDirections: [
        { label: '남쪽', note: '화 기운 강화 · 1순위 추천' },
        { label: '동쪽', note: '목생화(木生火) · 2순위' },
      ],
      avoidDirections: [
        { label: '북쪽', note: '수극화(水剋火) · 기운 억제' },
        { label: '북서쪽', note: '냉한 기운 · 피하는 것이 좋음' },
      ],
      goodMonths: [
        { label: '4 · 5월', note: '화 기운 절정 · 적극 추천' },
        { label: '9 · 10월', note: '안정 시기 · 추천' },
      ],
      badMonths: [
        { label: '11 · 12월', note: '수기 강화 · 기운 충돌' },
        { label: '1월', note: '기운 약화 · 이사 보류' },
      ],
      homeFeatures: '햇빛이 잘 드는 남향·남동향 집이 화(火) 일간에게 최적입니다. 층수는 고층일수록 좋으며, 주변에 학교·상권·공원처럼 활기 있는 시설이 가까운 곳을 선호합니다. 인테리어는 따뜻한 레드·오렌지 포인트와 조명을 적극 활용하세요.',
      actionItems: movingReason === 'new_home'
        ? ['이사 날짜는 4월·5월 손 없는 날을 최우선으로 고려하세요', '집들이는 가까운 분들과 즐겁고 활기차게 진행하면 기운이 올라갑니다', '거실에 붉은 꽃이나 따뜻한 조명을 두면 화 기운이 보강됩니다']
        : ['이사 전 오래된 물건을 과감하게 정리해 새 기운이 들어올 공간을 만드세요', '계약은 4월·5월 중 길한 날을 선택하세요', '이사 당일 창문을 활짝 열어 새 공기가 들어오게 하는 것이 좋습니다'],
      warningText: '화(火) 기운이 강한 분은 한번 마음에 들면 단점을 보지 못하는 경향이 있습니다. 계약 전 냉정하게 주변 소음·일조량·관리비를 체크하는 시간을 반드시 가지세요.',
    },
    '土': {
      headline: baseScore >= 75 ? '안정과 뿌리 내림 · 정착하기 좋은 시기' : '서두르지 않는 것이 최선 · 현재 유지',
      summary: baseScore >= 75 ? '중심 잡힌 안정적인 이사가 가능한 흐름입니다' : '급하게 움직이기보다 더 좋은 집이 나올 때까지 기다리세요',
      overallText: `토(土) 일간이신 ${name}님은 안정감과 신뢰가 강점인 기운을 지니고 있습니다. ${baseScore >= 75 ? '올해 재성(財星)이 풍부해 부동산 관련 결정이 유리한 흐름입니다.' : '조급하게 이사를 결정하기보다 충분한 시간을 두고 탐색하는 것이 좋습니다.'} ${movingReason === 'marriage' ? '신혼집은 넓고 여유 있는 구조의 집이 토 기운을 살려줍니다.' : '중앙에 가깝거나 주요 교통망이 잘 갖춰진 곳이 토 일간에게 잘 맞습니다.'}`,
      luckyDirections: [
        { label: '중앙', note: '토 기운 중심 · 1순위 추천' },
        { label: '남서쪽', note: '안정·재물 연결 · 2순위' },
      ],
      avoidDirections: [
        { label: '동쪽', note: '목극토(木剋土) · 충돌 기운' },
        { label: '동남쪽', note: '기운 억제 · 피하는 것이 좋음' },
      ],
      goodMonths: [
        { label: '5 · 6월', note: '토 기운 절정 · 적극 추천' },
        { label: '9 · 10월', note: '결실 시기 · 추천' },
      ],
      badMonths: [
        { label: '3 · 4월', note: '목극토 · 계약 분쟁 주의' },
        { label: '11월', note: '기운 전환기 · 이사 보류' },
      ],
      homeFeatures: '넓은 주방·거실과 수납공간이 풍부한 집이 토(土) 일간에게 이상적입니다. 1층보다는 중간층, 시끄러운 상업지역보다 조용한 주거지가 잘 맞습니다. 노란색·베이지 계열 인테리어가 토 기운을 북돋아 줍니다.',
      actionItems: movingReason === 'new_home'
        ? ['이사 날짜는 5월·6월 손 없는 날을 우선 고려하세요', '집들이 전 집 안 구석구석을 청소하고 소금으로 정화하는 전통이 있습니다', '안방에 황토·도자기 소품을 두면 토 기운이 안정됩니다']
        : ['계약 전 해당 주소의 실거래가와 공시지가를 반드시 확인하세요', '5월·6월 중 길일에 계약·잔금을 맞추는 것이 좋습니다', '이사 후 한 달간은 새로운 환경에 적응하는 시간을 충분히 가지세요'],
      warningText: '토(土) 기운이 강한 분은 변화 자체를 불편해 좋은 기회를 놓치는 경우가 있습니다. 이미 마음에 드는 집이 있다면 지나치게 오래 고민하지 말고 결단하세요.',
    },
    '金': {
      headline: baseScore >= 75 ? '깔끔하고 명확한 이사 · 결단력이 빛을 발할 때' : '꼼꼼한 점검이 먼저 · 서두르면 후회',
      summary: baseScore >= 75 ? '서쪽·북서쪽 방향의 쾌적한 집이 기운을 높입니다' : '철저한 확인 없이 계약하면 문제가 생길 수 있습니다',
      overallText: `금(金) 일간이신 ${name}님은 판단력과 정밀함이 강점인 기운을 지니고 있습니다. ${baseScore >= 75 ? '올해 인성(印星)이 강해 부동산 계약에서 유리한 협상력을 발휘할 수 있습니다.' : '계약 조건에 빈틈이 있을 수 있으니 법률 전문가의 도움을 받는 것을 권장합니다.'} ${movingReason === 'marriage' ? '신혼집은 깔끔하고 관리가 잘 된 신축이나 준신축이 금 기운과 잘 어울립니다.' : '수납이 잘 되는 정돈된 구조의 집이 금 일간에게 가장 편안한 환경입니다.'}`,
      luckyDirections: [
        { label: '서쪽', note: '금 기운 강화 · 1순위 추천' },
        { label: '북서쪽', note: '안정·명예 연결 · 2순위' },
      ],
      avoidDirections: [
        { label: '남쪽', note: '화극금(火剋金) · 기운 충돌' },
        { label: '남동쪽', note: '기운 억제 · 피하는 것이 좋음' },
      ],
      goodMonths: [
        { label: '7 · 8월', note: '금 기운 절정 · 적극 추천' },
        { label: '10 · 11월', note: '추진력 상승 · 추천' },
      ],
      badMonths: [
        { label: '6월', note: '화극금 · 계약 분쟁 주의' },
        { label: '2 · 3월', note: '기운 약화 · 이사 보류' },
      ],
      homeFeatures: '흰색·회색 계열의 모던하고 깔끔한 인테리어 집이 금(金) 일간에게 최적입니다. 수납공간이 충분하고 동선이 효율적인 구조를 우선하세요. 금속 소품과 화이트 톤 인테리어가 기운을 살려줍니다.',
      actionItems: movingReason === 'new_home'
        ? ['이사 날짜는 7월·10월 중 손 없는 날을 택하세요', '계약서의 특약사항을 반드시 꼼꼼히 확인하세요', '이사 후 안방 방향을 서쪽으로 맞추면 금 기운이 안정됩니다']
        : ['계약 전 등기부등본·건축물대장을 직접 열람하세요', '계약은 7월·8월 중 길일에 진행하면 좋습니다', '이사 당일 불필요한 감정 소모 없이 효율적으로 진행하세요'],
      warningText: '금(金) 기운이 강한 분은 자존심 때문에 마음에 안 드는 부분이 있어도 말하지 못하는 경우가 있습니다. 계약 전 불합리한 조건은 반드시 협상하세요.',
    },
    '水': {
      headline: baseScore >= 75 ? '흐름을 타는 이사 · 물처럼 자연스럽게 안착' : '시기 조율이 핵심 · 무리한 이동은 자제',
      summary: baseScore >= 75 ? '북쪽 방향의 조용하고 지적인 환경이 잘 맞습니다' : '지금보다 한 시즌 뒤에 이사하는 것이 더 안정적입니다',
      overallText: `수(水) 일간이신 ${name}님은 지혜와 직관이 뛰어난 기운을 지니고 있습니다. ${baseScore >= 75 ? '올해 인성(印星)과 재성의 흐름이 조화를 이루어 이사가 새로운 시작의 전환점이 될 수 있습니다.' : '재성이 약한 시기이므로 이사 비용 계획을 철저히 세우고 무리한 지출은 피하세요.'} ${movingReason === 'marriage' ? '신혼집은 도서관·공원 등 조용한 문화시설이 가까운 곳이 수 기운을 살려줍니다.' : '창문이 크고 바람이 잘 통하는 구조의 집이 수 일간에게 편안한 환경입니다.'}`,
      luckyDirections: [
        { label: '북쪽', note: '수 기운 강화 · 1순위 추천' },
        { label: '북서쪽', note: '지혜·안정 연결 · 2순위' },
      ],
      avoidDirections: [
        { label: '중앙·남서쪽', note: '토극수(土剋水) · 기운 막힘' },
        { label: '남쪽', note: '기운 과열 · 피하는 것이 좋음' },
      ],
      goodMonths: [
        { label: '11 · 12월', note: '수 기운 절정 · 적극 추천' },
        { label: '1 · 2월', note: '지혜 발동 · 추천' },
      ],
      badMonths: [
        { label: '5 · 6월', note: '토극수 · 계약 분쟁 주의' },
        { label: '9월', note: '기운 전환기 · 이사 보류' },
      ],
      homeFeatures: '채광보다 통풍이 좋은 집, 물이 가까운 환경(강변·호수 근처)이 수(水) 일간에게 이상적입니다. 지하철 등 대중교통이 편리한 곳을 우선하세요. 블루·그레이 계열 인테리어가 수 기운을 안정시킵니다.',
      actionItems: movingReason === 'new_home'
        ? ['이사 날짜는 11월·1월 중 손 없는 날을 우선 고려하세요', '이사 전 집 안의 오래된 물건을 과감히 정리해 새 기운을 위한 공간을 만드세요', '주방·욕실 청결 유지가 수 기운을 안정시키는 핵심입니다']
        : ['계약 전 주변 소음·일조량을 직접 방문해 확인하세요', '11월·12월 중 길일에 계약을 진행하면 좋습니다', '이사 후 새 집에서 좋아하는 책이나 음악으로 첫날 밤을 보내면 수 기운이 정착됩니다'],
      warningText: '수(水) 기운이 강한 분은 결정을 너무 오래 미루다 좋은 매물을 놓치는 경향이 있습니다. 탐색 기간을 미리 정해두고 그 안에 결단을 내리는 연습이 필요합니다.',
    },
  };

  const config = elementMap[dayElement] ?? elementMap['木'];

  return {
    name,
    dayElement,
    dayStem,
    score: baseScore,
    ...config,
  };
}

// ─── 점수 색상 ───────────────────────────────────────────────────────────────
function getScoreColor(s: number) {
  if (s >= 85) return '#059669';
  if (s >= 70) return '#d97706';
  return '#dc2626';
}
function getScoreLabel(s: number) {
  if (s >= 85) return '매우 길조';
  if (s >= 70) return '양호';
  if (s >= 55) return '보통';
  return '주의';
}

// ─── 컴포넌트 ────────────────────────────────────────────────────────────────
export default function MovingFortune() {
  useCanonical('/moving-fortune');

  const [result, setResult] = useState<MovingResult | null>(null);
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
      movingReason: 'new_home',
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
      fortune_type: '이사운',
      gender: data.gender,
      birth_year: birthDateObj.getFullYear(),
      calendar_type: data.calendarType,
      moving_reason: data.movingReason,
    });

    const rawTime = data.birthTimeUnknown ? '12:00' : data.birthTime;
    const time = /^\d{2}:\d{2}$/.test(rawTime) ? rawTime : '12:00';
    const birthDateStrForConverter = `${birthDateObj.getFullYear()}-${String(birthDateObj.getMonth() + 1).padStart(2, '0')}-${String(birthDateObj.getDate()).padStart(2, '0')}`;
    const date = convertToSolarDate(birthDateStrForConverter, time, data.calendarType, data.isLeapMonth);
    const sajuResult = calculateSaju(date, data.gender);
    const movingResult = generateMovingFortune(sajuResult, data.name, data.movingReason);

    setResult(movingResult);
    window.scrollTo(0, 0);
  };

  const commonMaxWidth = 'w-full';

  // ─── 입력 폼 ─────────────────────────────────────────────────────────────
  if (!result) {
    return (
      <>
        <Helmet>
          <title>이사운 - 사주로 보는 이사 방향과 이사 날짜 | 무운 (MuUn)</title>
          <meta name="description" content="사주팔자로 보는 2026년 이사운. 이사 좋은 방향·날짜·집 특징까지 무료로 확인하세요. 회원가입·저장 없이 바로 확인." />
          <meta name="keywords" content="이사운, 이사 방향, 이사 날짜, 이사 사주, 손 없는 날, 이사 풍수, 무운" />
          <link rel="canonical" href="https://muunsaju.com/moving-fortune" />
          <meta property="og:title" content="이사운 - 사주로 보는 이사 방향과 이사 날짜 | 무운 (MuUn)" />
          <meta property="og:description" content="사주팔자로 보는 2026년 이사운. 이사 방향·날짜·집 특징까지 무료로 확인하세요." />
          <meta property="og:image" content="https://muunsaju.com/images/horse_mascot.png" />
          <meta property="og:type" content="website" />
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: '무료 이사운 사주',
              description: '사주팔자로 보는 이사운과 이사 방향·날짜 분석 서비스',
              provider: { '@type': 'Organization', name: '무운 (MuUn)', url: 'https://muunsaju.com' },
              url: 'https://muunsaju.com/moving-fortune',
              serviceType: '이사운 사주',
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
              <h2 className="text-base font-bold text-[#191F28]">이사운</h2>
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
                  <Home className="w-3 h-3" />
                  <span>사주로 보는 이사운</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#191F28]">이사운</h2>
                <p className="text-muted-foreground text-xs md:text-sm">
                  어디로, 언제 이사해야 할까요? 사주로 나에게 맞는 방향과 시기를 확인하세요
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

                    {/* 이사 목적 */}
                    <div className="space-y-1.5">
                      <Label className="text-[#191F28] text-sm font-medium flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-[#6B5FFF]" />
                        이사 목적
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {(Object.entries(MOVING_REASON_LABELS)).map(([value, label]) => {
                          const isActive = form.watch('movingReason') === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => form.setValue('movingReason', value as FormValues['movingReason'])}
                              className="h-10 rounded-xl text-sm font-medium transition-all"
                              style={isActive
                                ? { background: '#6B5FFF', color: '#fff', border: '1.5px solid #6B5FFF' }
                                : { background: '#F7F5F3', color: '#4E5968', border: '1.5px solid #E8E5E0' }
                              }
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
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
                          onValueChange={(v) => { if (v) form.setValue('gender', v as 'male' | 'female'); }}
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
                          onValueChange={(v) => {
                            if (v) {
                              form.setValue('calendarType', v as 'solar' | 'lunar');
                              if (v === 'solar') form.setValue('isLeapMonth', false);
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
                        이사운은 <strong className="text-[#6B5FFF]">오행(五行) 기운</strong>을 바탕으로 방향·시기·집 특징을 분석합니다. 실제 이사 결정 시 전문가 상담을 병행하는 것을 권장합니다.
                      </p>
                    </div>

                    {/* 제출 */}
                    <Button
                      type="submit"
                      style={{ background: 'linear-gradient(135deg, #6B5FFF, #4F46E5)' }}
                      className="w-full h-12 text-white font-bold text-sm rounded-xl shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      이사운 보기
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* 특징 카드 */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {[
                  { icon: Compass, label: '이사 방향', desc: '오행 기반 분석' },
                  { icon: Calendar, label: '이사 시기', desc: '길월·흉월 안내' },
                  { icon: Home, label: '집 특징', desc: '맞는 환경 가이드' },
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

  // ─── 결과 화면 ───────────────────────────────────────────────────────────
  const scoreColor = getScoreColor(result.score);
  const scoreLabel = getScoreLabel(result.score);

  return (
    <>
      <Helmet>
        <title>{result.name}님의 이사운 결과 - 무운</title>
        <meta name="description" content={`${result.name}님의 사주로 보는 이사운 분석 결과입니다. ${result.headline}`} />
        <meta name="robots" content="index, follow" />
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
              <h1 className="text-base font-bold text-[#191F28]">이사운 결과</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#6B5FFF] min-w-[44px] min-h-[44px]"
              onClick={() => shareContent({ title: '무운 이사운', text: `${result.name}님의 이사운 분석 결과`, page: 'moving-fortune', buttonType: 'icon' })}
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
                <Home className="w-3 h-3" />
                <span>이사운 · {result.dayElement}({result.dayStem}) 일간</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#191F28]">{result.name}님의 이사운 풀이</h2>
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
                  이사운 점수
                </div>
                <div className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: scoreColor }}>
                  {result.score}점 · {scoreLabel}
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${scoreColor}15` }}>
                    <Home className="w-5 h-5" style={{ color: scoreColor }} />
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
                <p className="text-base text-[#4E5968] leading-relaxed">{result.overallText}</p>
              </CardContent>
            </Card>

            {/* 이사 방향 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-black/10 pb-3">
                <div className="w-8 h-8 rounded-lg bg-[#6B5FFF]/20 flex items-center justify-center">
                  <Compass className="w-4 h-4 text-[#6B5FFF]" />
                </div>
                <h3 className="text-base font-bold text-[#191F28]">이사 방향</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {result.luckyDirections.map((d) => (
                  <Card key={d.label} className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                    <CardContent className="p-3 text-center space-y-1">
                      <p className="text-base font-bold text-emerald-600">{d.label} ↑</p>
                      <p className="text-sm text-muted-foreground">{d.note}</p>
                    </CardContent>
                  </Card>
                ))}
                {result.avoidDirections.map((d) => (
                  <Card key={d.label} className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                    <CardContent className="p-3 text-center space-y-1">
                      <p className="text-base font-bold text-rose-500">{d.label} ↓</p>
                      <p className="text-sm text-muted-foreground">{d.note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* 이사 시기 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-black/10 pb-3">
                <div className="w-8 h-8 rounded-lg bg-[#6B5FFF]/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#6B5FFF]" />
                </div>
                <h3 className="text-base font-bold text-[#191F28]">이사 좋은 달 · 피할 달</h3>
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

            {/* 나에게 맞는 집 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-black/10 pb-3">
                <div className="w-8 h-8 rounded-lg bg-[#6B5FFF]/20 flex items-center justify-center">
                  <Home className="w-4 h-4 text-[#6B5FFF]" />
                </div>
                <h3 className="text-base font-bold text-[#191F28]">나에게 맞는 집 특징</h3>
              </div>
              <Card className="bg-white border border-black/[0.06] rounded-xl shadow-sm">
                <CardContent className="p-4">
                  <p className="text-base text-[#4E5968] leading-relaxed">{result.homeFeatures}</p>
                </CardContent>
              </Card>
            </section>

            {/* 이사 준비 체크리스트 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-black/10 pb-3">
                <div className="w-8 h-8 rounded-lg bg-[#6B5FFF]/20 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-[#6B5FFF]" />
                </div>
                <h3 className="text-base font-bold text-[#191F28]">이사 준비 체크리스트</h3>
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

            {/* 연계 배너 */}
            <Link href="/lifelong-saju"
              className="rounded-2xl p-4 flex items-center gap-4 block"
              style={{ background: 'linear-gradient(135deg, #2D1B5E, #1A0F3C)' }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/60 mb-0.5">더 깊이 알고 싶다면</p>
                <p className="text-sm font-bold text-white">평생사주로 재물·주거운 상세 분석 보기</p>
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
                onClick={() => shareContent({ title: '무운 이사운', text: `${result.name}님의 이사운 분석 결과 — ${result.headline}`, page: 'moving-fortune', buttonType: 'text_button' })}
              >
                <Share2 className="w-4 h-4 mr-2" />
                결과 공유하기
              </Button>
            </div>

            <RelatedServices
              title="함께 보면 좋은 서비스"
              services={[
                { href: '/lifelong-saju', emoji: '✨', label: '평생사주', description: '타고난 주거운과 재물운을 사주팔자로 더 깊이 살펴보세요.' },
                { href: '/career-fortune', emoji: '💼', label: '취업·이직운', description: '이사와 함께 직장 이동도 계획 중이라면 함께 확인하세요.' },
                { href: '/compatibility', emoji: '💞', label: '궁합', description: '함께 이사하는 가족·파트너와의 기운도 확인해보세요.' },
                { href: '/daily-fortune', emoji: '📅', label: '오늘의 운세', description: '이사 당일의 운의 흐름을 미리 확인해보세요.' },
              ]}
            />
          </motion.div>
        </main>
      </div>
    </>
  );
}
