'use client';

import { useCanonical } from '@/lib/use-canonical';
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BirthTimeSelect } from "@/components/ui/birth-time-select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft, Heart, User, Calendar, Clock, Sparkles, Users, Brain, Star,
  Zap, Shield, MessageCircle, Home as HomeIcon, Lightbulb, ChevronDown,
  TrendingUp, Download, Share2, Palette, Gift, AlertCircle, CheckCircle2
} from "lucide-react";
import DatePickerInput from "@/components/DatePickerInput";
import { calculateSaju, SajuResult, STEM_ELEMENTS, calculateElementBalance } from "@/lib/saju";
import { convertToSolarDate } from "@/lib/lunar-converter";
import { STEM_PERSONALITY, analyzeElementBalance } from "@/lib/saju-reading";
import { MBTIType, MBTI_TYPES, MBTI_INFO } from "@/lib/mbti-compatibility";
import { analyzeHybridCompatibility, HybridCompatResult } from "@/lib/hybrid-compatibility";
import { trackEvent, trackCustomEvent } from "@/lib/ga4";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} from "recharts";
// import html2canvas from "html2canvas";

const formSchema = z.object({
  name1: z.string().min(1, "첫 번째 이름을 입력해주세요"),
  gender1: z.enum(["male", "female"]),
  birthDate1: z.string().min(1, "첫 번째 생년월일을 입력해주세요"),
  birthTime1: z.string().min(1, "첫 번째 태어난 시간을 입력해주세요"),
  calendarType1: z.enum(["solar", "lunar"]),
  isLeapMonth1: z.boolean().optional(),
  mbti1: z.string().min(1, "첫 번째 MBTI를 선택해주세요"),
  name2: z.string().min(1, "두 번째 이름을 입력해주세요"),
  gender2: z.enum(["male", "female"]),
  birthDate2: z.string().min(1, "두 번째 생년월일을 입력해주세요"),
  birthTime2: z.string().min(1, "두 번째 태어난 시간을 입력해주세요"),
  calendarType2: z.enum(["solar", "lunar"]),
  isLeapMonth2: z.boolean().optional(),
  mbti2: z.string().min(1, "두 번째 MBTI를 선택해주세요"),
});

type FormValues = z.infer<typeof formSchema>;

// ─── 에너지 저울 컴포넌트 ─────────────────────────────────────────────────────
function EnergyScale({
  person1Energy, person2Energy, balanceScore,
  person1Role, person2Role, elem1Color, elem2Color, mbti1, mbti2
}: {
  person1Energy: number; person2Energy: number; balanceScore: number;
  person1Role: string; person2Role: string;
  elem1Color: string; elem2Color: string;
  mbti1: string; mbti2: string;
}) {
  const controls = useAnimation();
  const tiltDeg = Math.max(-25, Math.min(25, balanceScore * 6));

  useEffect(() => {
    controls.start({ rotate: tiltDeg, transition: { type: "spring", stiffness: 60, damping: 15, delay: 0.3 } });
  }, [tiltDeg, controls]);

  const leftDown = balanceScore > 0;
  const rightDown = balanceScore < 0;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* 저울 SVG */}
      <div className="relative w-full max-w-xs mx-auto h-40">
        {/* 저울 기둥 */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-2 h-28 bg-gradient-to-b from-white/30 to-white/10 rounded-full" />
        {/* 저울 받침 */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-16 h-3 bg-white/20 rounded-full" />
        {/* 저울 팔 (회전) */}
        <motion.div
          animate={controls}
          className="absolute left-1/2 top-8 -translate-x-1/2 w-56 h-2 rounded-full origin-center"
          style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.6), rgba(255,255,255,0.3))' }}
        >
          {/* 왼쪽 접시 */}
          <motion.div
            animate={{ y: leftDown ? 20 : rightDown ? -20 : 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.5 }}
            className="absolute -left-2 top-0 flex flex-col items-center"
          >
            <div className="w-px h-8 bg-white/40" />
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border border-white/20"
              style={{ background: `radial-gradient(circle, ${elem1Color}40, ${elem1Color}20)`, color: elem1Color }}
            >
              {mbti1}
            </div>
          </motion.div>
          {/* 오른쪽 접시 */}
          <motion.div
            animate={{ y: rightDown ? 20 : leftDown ? -20 : 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.5 }}
            className="absolute -right-2 top-0 flex flex-col items-center"
          >
            <div className="w-px h-8 bg-white/40" />
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border border-white/20"
              style={{ background: `radial-gradient(circle, ${elem2Color}40, ${elem2Color}20)`, color: elem2Color }}
            >
              {mbti2}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 뱃지 */}
      <div className="flex justify-between w-full max-w-xs">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-1"
        >
          <Badge
            className="text-xs font-bold px-3 py-1"
            style={{ background: `${elem1Color}30`, color: elem1Color, border: `1px solid ${elem1Color}50` }}
          >
            {person1Role}
          </Badge>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-1"
        >
          <Badge
            className="text-xs font-bold px-3 py-1"
            style={{ background: `${elem2Color}30`, color: elem2Color, border: `1px solid ${elem2Color}50` }}
          >
            {person2Role}
          </Badge>
        </motion.div>
      </div>
    </div>
  );
}

// ─── 점수 원형 게이지 ─────────────────────────────────────────────────────────
function ScoreCircle({ score, label, color, size = 96 }: { score: number; label: string; color: string; size?: number }) {
  const radius = (size / 2) - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white leading-none">{score}</span>
          <span className="text-[10px] text-white/50">/ 100</span>
        </div>
      </div>
      <span className="text-xs text-white/60 text-center">{label}</span>
    </div>
  );
}

// ─── 아코디언 섹션 ────────────────────────────────────────────────────────────
const DIMENSION_CONFIG = {
  communication: { icon: MessageCircle, color: '#60a5fa', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: '대화와 소통' },
  conflictResolution: { icon: Shield, color: '#f87171', bg: 'bg-red-500/10', border: 'border-red-500/20', label: '싸움과 화해' },
  valuesAndReality: { icon: TrendingUp, color: '#34d399', bg: 'bg-green-500/10', border: 'border-green-500/20', label: '현실과 가치관' },
  dailyRhythm: { icon: HomeIcon, color: '#fbbf24', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: '일상의 리듬' },
};

function DimensionAccordion({
  id, title, data, isExpanded, onToggle, config
}: {
  id: string; title: string;
  data: { summary: string; score: number; advice: string };
  isExpanded: boolean; onToggle: () => void;
  config: typeof DIMENSION_CONFIG[keyof typeof DIMENSION_CONFIG];
}) {
  const Icon = config.icon;
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${config.border} ${isExpanded ? config.bg : 'border-white/10'}`}>
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${config.color}20` }}>
            <Icon className="w-4 h-4" style={{ color: config.color }} />
          </div>
          <span className="font-semibold text-white text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold" style={{ color: config.color }}>{data.score}점</span>
          <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-white/10 space-y-4">
              {/* 점수 바 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-white/50">
                  <span>궁합 점수</span>
                  <span style={{ color: config.color }}>{data.score}/100</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${config.color}80, ${config.color})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${data.score}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
              {/* 요약 텍스트 */}
              <p className="text-sm text-white/70 leading-relaxed">{data.summary}</p>
              {/* 조언 박스 */}
              <div className="p-3 rounded-lg border" style={{ background: `${config.color}08`, borderColor: `${config.color}30` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5" style={{ color: config.color }} />
                  <span className="text-xs font-semibold" style={{ color: config.color }}>무운의 조언</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{data.advice}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── 타임라인 그래프 ──────────────────────────────────────────────────────────
function TimelineGraph({ timeline }: { timeline: HybridCompatResult['timeline'] }) {
  const data = [
    { phase: '썸', score: timeline.썸, desc: timeline.phaseDescriptions.썸 },
    { phase: '연애', score: timeline.연애, desc: timeline.phaseDescriptions.연애 },
    { phase: '장기 안정기', score: timeline.장기안정기, desc: timeline.phaseDescriptions.장기안정기 },
  ];

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill="#a78bfa" stroke="#7c3aed" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={12} fill="rgba(167,139,250,0.2)" />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = data.find(d => d.phase === label);
      return (
        <div className="bg-[#1a1a2e] border border-purple-500/30 rounded-xl p-3 max-w-[200px] shadow-xl">
          <p className="text-purple-300 font-bold text-sm mb-1">{label}</p>
          <p className="text-white font-bold text-lg">{payload[0].value}점</p>
          {item && <p className="text-white/50 text-xs mt-1 leading-relaxed">{item.desc}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/60 text-center">{timeline.description}</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="phase" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[40, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="timelineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="score"
            stroke="url(#timelineGradient)"
            strokeWidth={3}
            dot={<CustomDot />}
            activeDot={{ r: 8, fill: '#f472b6' }}
          />
        </LineChart>
      </ResponsiveContainer>
      {/* 단계별 설명 */}
      <div className="grid grid-cols-3 gap-2">
        {data.map((item, idx) => (
          <div key={idx} className="text-center p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="text-lg font-bold text-white">{item.score}</div>
            <div className="text-[10px] text-white/50">{item.phase}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 레이더 차트 (4대 영역) ───────────────────────────────────────────────────
function DimensionRadar({ fourDimensions }: { fourDimensions: HybridCompatResult['fourDimensions'] }) {
  const data = [
    { subject: '소통', score: fourDimensions.communication.score },
    { subject: '화해', score: fourDimensions.conflictResolution.score },
    { subject: '가치관', score: fourDimensions.valuesAndReality.score },
    { subject: '일상', score: fourDimensions.dailyRhythm.score },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
        <Radar
          name="궁합"
          dataKey="score"
          stroke="#a78bfa"
          fill="#a78bfa"
          fillOpacity={0.3}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ─── 처방전 컴포넌트 ──────────────────────────────────────────────────────────
function PrescriptionCard({ prescription }: { prescription: HybridCompatResult['prescription'] }) {
  return (
    <div className="space-y-4">
      {/* 행운의 컬러 */}
      <div className="p-4 rounded-xl border border-white/10 bg-white/5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-sm font-semibold text-amber-400">행운의 컬러</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg" style={{ background: prescription.luckyColorHex1 }} />
            <div className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg" style={{ background: prescription.luckyColorHex2 }} />
          </div>
        </div>
        <p className="text-xs text-white/60 leading-relaxed">{prescription.luckyColor}</p>
      </div>

      {/* 행운의 아이템 */}
      <div className="p-4 rounded-xl border border-white/10 bg-white/5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center">
            <Gift className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <span className="text-sm font-semibold text-pink-400">행운의 아이템</span>
        </div>
        <p className="text-xs text-white/60 leading-relaxed">{prescription.luckyItem}</p>
      </div>

      {/* 대화 팁 */}
      <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <MessageCircle className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <span className="text-sm font-semibold text-purple-400">대화 팁</span>
        </div>
        <p className="text-xs text-white/70 leading-relaxed">{prescription.tipForPartner}</p>
      </div>

      {/* 주의 신호 */}
      <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <span className="text-sm font-semibold text-orange-400">주의 신호</span>
        </div>
        <p className="text-xs text-white/60 leading-relaxed">{prescription.warningSign}</p>
      </div>
    </div>
  );
}

// ─── 메인 페이지 컴포넌트 ────────────────────────────────────────────────────
export default function HybridCompatibilityPage() {
  useCanonical();
  const [result, setResult] = useState<HybridCompatResult | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('communication');
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);
  const name1Ref = useRef<HTMLInputElement>(null);
  const birthDate1Ref = useRef<HTMLDivElement>(null);
  const mbti1Ref = useRef<HTMLDivElement>(null);
  const name2Ref = useRef<HTMLInputElement>(null);
  const birthDate2Ref = useRef<HTMLDivElement>(null);
  const mbti2Ref = useRef<HTMLDivElement>(null);
  const errorMsgRef = useRef<HTMLDivElement>(null);

  // 결과 화면 진입 시 최상단으로 스크롤
  useEffect(() => {
    if (result) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [result]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name1: "",
      gender1: "male",
      birthDate1: "2000-01-01",
      birthTime1: "12:00",
      calendarType1: "solar",
      mbti1: "",
      name2: "",
      gender2: "female",
      birthDate2: "2000-01-01",
      birthTime2: "12:00",
      calendarType2: "solar",
      mbti2: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    // 유효성 검사 통과 시 에러 초기화
    setValidationErrors([]);
    try {
      let birthDateStr1 = data.birthDate1;
      if (typeof birthDateStr1 !== 'string') {
        if (birthDateStr1 instanceof Date) birthDateStr1 = birthDateStr1.toISOString().split('T')[0];
        else birthDateStr1 = String(birthDateStr1);
      }
      let birthDateStr2 = data.birthDate2;
      if (typeof birthDateStr2 !== 'string') {
        if (birthDateStr2 instanceof Date) birthDateStr2 = birthDateStr2.toISOString().split('T')[0];
        else birthDateStr2 = String(birthDateStr2);
      }

      const [year1, month1, day1] = birthDateStr1.split('-').map(Number);
      const [year2, month2, day2] = birthDateStr2.split('-').map(Number);
      const birthDateObj1 = new Date(year1, month1 - 1, day1);
      const birthDateObj2 = new Date(year2, month2 - 1, day2);

      const birthDateStrForConverter1 = `${birthDateObj1.getFullYear()}-${String(birthDateObj1.getMonth() + 1).padStart(2, '0')}-${String(birthDateObj1.getDate()).padStart(2, '0')}`;
      const birthDateStrForConverter2 = `${birthDateObj2.getFullYear()}-${String(birthDateObj2.getMonth() + 1).padStart(2, '0')}-${String(birthDateObj2.getDate()).padStart(2, '0')}`;

      const date1 = convertToSolarDate(birthDateStrForConverter1, data.birthTime1, data.calendarType1);
      const date2 = convertToSolarDate(birthDateStrForConverter2, data.birthTime2, data.calendarType2);
      const saju1 = calculateSaju(date1, data.gender1);
      const saju2 = calculateSaju(date2, data.gender2);

      // SEO 보안: 이름은 클라이언트 state에만 존재, URL/메타태그에 절대 노출 안 됨
      const hybrid = analyzeHybridCompatibility(saju1, saju2, data.mbti1 as MBTIType, data.mbti2 as MBTIType, data.name1, data.name2);

      setResult(hybrid);
      setExpandedSection('communication');
      // useEffect에서 result 변경 감지 후 스크롤 처리

      trackCustomEvent("hybrid_compatibility_analyzed", {
        mbti1: data.mbti1,
        mbti2: data.mbti2,
        score: hybrid.totalScore,
      });
    } catch (error) {
      console.error("분석 오류:", error);
      alert(`분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  // 공유하기 기능
  const handleShare = async () => {
    const shareData = {
      title: '무운 사주×MBTI 하이브리드 궁합',
      text: `우리 궁합은 ${result?.totalScore}점! ${result?.totalGrade}이에요. 무운에서 확인해보세요.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        trackCustomEvent("hybrid_shared_native", { score: result?.totalScore });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 복사되었습니다. 원하는 곳에 붙여넣어 공유하세요!');
        trackCustomEvent("hybrid_shared_clipboard", { score: result?.totalScore });
      }
    } catch (err) {
      console.error('공유 실패:', err);
    }
  };

  // 유효성 검사 실패 핸들러
  const handleInvalidSubmit = (errors: any) => {
    const errorMessages: string[] = [];
    const fieldOrder = [
      { key: 'name1', label: '첫 번째 사람 이름', ref: name1Ref },
      { key: 'birthDate1', label: '첫 번째 사람 생년월일', ref: birthDate1Ref },
      { key: 'mbti1', label: '첫 번째 사람 MBTI', ref: mbti1Ref },
      { key: 'name2', label: '두 번째 사람 이름', ref: name2Ref },
      { key: 'birthDate2', label: '두 번째 사람 생년월일', ref: birthDate2Ref },
      { key: 'mbti2', label: '두 번째 사람 MBTI', ref: mbti2Ref },
    ];

    let firstErrorRef: React.RefObject<any> | null = null;
    for (const field of fieldOrder) {
      if (errors[field.key]) {
        errorMessages.push(field.label);
        if (!firstErrorRef) firstErrorRef = field.ref;
      }
    }

    setValidationErrors(errorMessages);

    // 첫 번째 에러 필드로 스크롤
    setTimeout(() => {
      if (firstErrorRef?.current) {
        firstErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (errorMsgRef.current) {
        errorMsgRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const commonMaxWidth = "w-full max-w-2xl mx-auto";

  // ─── 결과 화면 ────────────────────────────────────────────────────────────
  if (result) {
    const { mbti1, mbti2 } = form.getValues();
    const hybrid = result;
    const { elem1, elem2, elem1Color, elem2Color, elem1Korean, elem2Korean } = hybrid.elementInfo;

    const getScoreColor = (score: number) => {
      if (score >= 85) return '#f472b6';
      if (score >= 75) return '#fbbf24';
      if (score >= 65) return '#34d399';
      return '#f87171';
    };

    return (
      <>
        {/* SEO: 개인정보(이름) 절대 노출 금지 - 메타태그에 일주+MBTI 코드만 사용 */}
        <Helmet>
          <title>사주×MBTI 하이브리드 궁합 리포트 - 무운</title>
          <meta name="description" content={`${elem1Korean} 기운(${mbti1})과 ${elem2Korean} 기운(${mbti2})의 하이브리드 궁합 분석. 종합 점수 ${hybrid.totalScore}점 - ${hybrid.totalGrade}`} />
          <meta property="og:title" content="사주×MBTI 하이브리드 궁합 리포트 - 무운" />
          <meta property="og:description" content={`${elem1Korean} 기운(${mbti1})과 ${elem2Korean} 기운(${mbti2})의 하이브리드 궁합. ${hybrid.totalGrade} (${hybrid.totalScore}점)`} />
          {/* 개인정보 인덱싱 방지 */}
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
          {/* 배경 */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: `${elem1Color}15` }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: `${elem2Color}15` }} />
          </div>

          {/* 헤더 */}
          <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
            <div className={`${commonMaxWidth} container mx-auto px-4 py-3 flex items-center justify-between`}>
              <button onClick={() => setResult(null)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">다시 분석</span>
              </button>
              <h1 className="text-base md:text-lg font-bold">하이브리드 궁합 리포트</h1>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
                공유
              </button>
            </div>
          </header>

          <main ref={resultRef} className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
            <div className={`${commonMaxWidth} space-y-5`}>

              {/* ① 에너지 저울 */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                    <CardTitle className="text-white flex items-center gap-2 text-sm md:text-base">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      </div>
                      인연의 에너지 저울
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <EnergyScale
                      person1Energy={hybrid.energyScale.person1Energy}
                      person2Energy={hybrid.energyScale.person2Energy}
                      balanceScore={hybrid.energyScale.balanceScore}
                      person1Role={hybrid.energyBalance.person1Role}
                      person2Role={hybrid.energyBalance.person2Role}
                      elem1Color={elem1Color}
                      elem2Color={elem2Color}
                      mbti1={mbti1}
                      mbti2={mbti2}
                    />
                    <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-white/60 leading-relaxed text-center">{hybrid.energyBalance.description}</p>
                    </div>
                    <p className="mt-3 text-xs text-white/50 leading-relaxed">{hybrid.energyScale.description}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* ② 시너지 카드 */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${elem1Color}10, ${elem2Color}10)` }}>
                  <CardContent className="p-4 md:p-6">
                    <div className="text-center space-y-4">
                      {/* 종합 점수 대형 표시 */}
                      <div className="flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                          className="relative"
                        >
                          <div className="text-7xl md:text-8xl font-black text-white leading-none" style={{ textShadow: `0 0 40px ${elem1Color}60` }}>
                            {hybrid.totalScore}
                          </div>
                          <div className="text-sm text-white/50 mt-1">/ 100점</div>
                        </motion.div>
                        <Badge className="text-sm font-bold px-4 py-1.5" style={{ background: `${getScoreColor(hybrid.totalScore)}20`, color: getScoreColor(hybrid.totalScore), border: `1px solid ${getScoreColor(hybrid.totalScore)}40` }}>
                          {hybrid.totalGrade}
                        </Badge>
                      </div>

                      {/* 별명 */}
                      <div className="flex items-center justify-center gap-3 flex-wrap">
                        <span className="text-xs px-3 py-1.5 rounded-full border font-medium" style={{ background: `${elem1Color}15`, borderColor: `${elem1Color}40`, color: elem1Color }}>
                          {hybrid.synergyCard.nickname1}
                        </span>
                        <Heart className="w-4 h-4 text-pink-400" />
                        <span className="text-xs px-3 py-1.5 rounded-full border font-medium" style={{ background: `${elem2Color}15`, borderColor: `${elem2Color}40`, color: elem2Color }}>
                          {hybrid.synergyCard.nickname2}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-white/80">{hybrid.synergyCard.combinedNickname}</p>
                      <p className="text-xs text-white/50">{hybrid.synergyCard.description}</p>

                      {/* 키워드 */}
                      <div className="flex flex-wrap justify-center gap-2">
                        {hybrid.keywords.map((kw, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/10">
                            #{kw}
                          </span>
                        ))}
                      </div>

                      {/* 세부 점수 */}
                      <div className="grid grid-cols-4 gap-3 pt-2">
                        <ScoreCircle score={hybrid.detailScores.love} label="연애" color="#f472b6" size={72} />
                        <ScoreCircle score={hybrid.detailScores.communication} label="소통" color="#60a5fa" size={72} />
                        <ScoreCircle score={hybrid.detailScores.marriage} label="결혼" color="#34d399" size={72} />
                        <ScoreCircle score={hybrid.detailScores.crisis} label="위기극복" color="#fbbf24" size={72} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* ③ 4대 영역 레이더 + 아코디언 */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                    <CardTitle className="text-white flex items-center gap-2 text-sm md:text-base">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-blue-400" />
                      </div>
                      4대 영역 하이브리드 리포트
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 space-y-4">
                    {/* 레이더 차트 */}
                    <DimensionRadar fourDimensions={hybrid.fourDimensions} />
                    {/* 아코디언 */}
                    <div className="space-y-2">
                      {(Object.entries(hybrid.fourDimensions) as [keyof typeof DIMENSION_CONFIG, any][]).map(([key, data]) => (
                        <DimensionAccordion
                          key={key}
                          id={key}
                          title={data.title}
                          data={data}
                          isExpanded={expandedSection === key}
                          onToggle={() => setExpandedSection(expandedSection === key ? null : key)}
                          config={DIMENSION_CONFIG[key]}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* ④ 인연 타임라인 */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                    <CardTitle className="text-white flex items-center gap-2 text-sm md:text-base">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                      인연 타임라인
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <TimelineGraph timeline={hybrid.timeline} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* ⑤ 처방전 */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                    <CardTitle className="text-white flex items-center gap-2 text-sm md:text-base">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                      </div>
                      무운의 한 줄 처방전
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <PrescriptionCard prescription={hybrid.prescription} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* 공유/다시분석 버튼 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex gap-3"
              >
                <Button
                  onClick={handleShare}
                  className="flex-1 h-12 font-bold rounded-xl flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}
                >
                  <Share2 className="w-4 h-4" />
                  결과 공유하기
                </Button>
                <Button
                  onClick={() => setResult(null)}
                  variant="outline"
                  className="h-12 px-5 rounded-xl border-white/20 text-white/70 hover:text-white"
                >
                  다시 분석
                </Button>
              </motion.div>

            </div>
          </main>
        </div>
      </>
    );
  }

  // ─── 입력 화면 ────────────────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>사주×MBTI 하이브리드 궁합 - 무운</title>
        <meta name="description" content="전통 사주 오행과 MBTI 성격 유형을 결합한 하이브리드 궁합 분석. 에너지 저울, 4대 영역 리포트, 인연 타임라인까지 압도적인 정보량의 전문 궁합 리포트를 무료로 제공합니다." />
        <meta property="og:title" content="사주×MBTI 하이브리드 궁합 - 무운" />
        <meta property="og:description" content="사주 오행(하드웨어)과 MBTI(소프트웨어)를 결합한 960가지 하이브리드 궁합 분석. 에너지 저울, 타임라인 그래프, 처방전까지." />
        <link rel="canonical" href="https://muunsaju.com/hybrid-compatibility" />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground pb-16 relative antialiased">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]" />
        </div>

        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/50 border-b border-white/10">
          <div className={`${commonMaxWidth} container mx-auto px-4 py-3 md:py-4 flex items-center justify-between`}>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">뒤로</span>
            </Link>
            <h1 className="text-lg md:text-xl font-bold">사주×MBTI 궁합</h1>
            <div className="w-[60px]" />
          </div>
        </header>

        <main className="relative z-10 container mx-auto max-w-[1280px] px-4 py-5 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${commonMaxWidth} space-y-6`}
          >
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">사주×MBTI 하이브리드 궁합</h2>
              <p className="text-white/50 text-xs md:text-sm">
                사주는 <span className="text-purple-400 font-medium">하드웨어(타고난 기질)</span>, MBTI는 <span className="text-pink-400 font-medium">소프트웨어(후천적 성격)</span>.<br />
                두 가지를 결합한 960가지 경우의 수 분석으로 진짜 궁합을 알아보세요.
              </p>
            </div>

            <Card className="glass-panel border-white/5 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 px-4 py-3 md:px-6 md:py-4">
                <CardTitle className="text-white flex items-center gap-2 text-base md:text-lg">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  궁합 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <form onSubmit={form.handleSubmit(handleSubmit, handleInvalidSubmit)} className="space-y-5">
                  {/* 첫 번째 사람 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center">1</div>
                      <h3 className="text-white font-bold text-sm">첫 번째 사람</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name1" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-purple-400" /> 이름
                        </Label>
                        <div ref={name1Ref}>
                        <Input id="name1" placeholder="이름" {...form.register("name1")} className={`h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm ${form.formState.errors.name1 ? 'border-red-500/60 ring-1 ring-red-500/40' : ''}`} />
                        {form.formState.errors.name1 && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{form.formState.errors.name1.message}</p>}
                      </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> 성별
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("gender1")}
                          onValueChange={(value) => { if (value) form.setValue("gender1", value as "male" | "female"); }}
                          className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                        >
                          <ToggleGroupItem value="male" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm">남</ToggleGroupItem>
                          <ToggleGroupItem value="female" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm">여</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                    <div className="space-y-1.5" ref={birthDate1Ref}>
                      <Label htmlFor="birthDate1" className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" /> 생년월일
                      </Label>
                      <DatePickerInput id="birthDate1" {...form.register("birthDate1")} accentColor="purple" />
                      {form.formState.errors.birthDate1 && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{form.formState.errors.birthDate1.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthTime1" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-400" /> 태어난 시간
                        </Label>
                        <BirthTimeSelect
                          value={form.watch("birthTime1")}
                          onChange={(val) => form.setValue("birthTime1", val)}
                          accentClass="focus:ring-purple-500/50 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-purple-400" /> 양력/음력
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("calendarType1")}
                          onValueChange={(value) => { if (value) form.setValue("calendarType1", value as "solar" | "lunar"); }}
                          className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                        >
                          <ToggleGroupItem value="solar" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm">양력</ToggleGroupItem>
                          <ToggleGroupItem value="lunar" className="h-full rounded-lg data-[state=on]:bg-purple-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm">음력</ToggleGroupItem>
                        </ToggleGroup>
                        {form.watch("calendarType1") === "lunar" && (
                          <div className="flex items-center justify-end gap-2 pr-1 pt-0.5">
                            <input type="checkbox" id="isLeapMonth1" checked={form.watch("isLeapMonth1") || false} onChange={(e) => form.setValue("isLeapMonth1", e.target.checked)} className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-purple-500" />
                            <Label htmlFor="isLeapMonth1" className="text-white/60 text-[11px] cursor-pointer">윤달입니다</Label>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5" ref={mbti1Ref}>
                      <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-purple-400" /> MBTI
                      </Label>
                      <div className={`grid grid-cols-4 gap-2 p-2 rounded-xl transition-all ${form.formState.errors.mbti1 ? 'ring-1 ring-red-500/40 bg-red-500/5' : ''}`}>
                        {['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'].map((mbti) => (
                          <button key={mbti} type="button" onClick={() => { form.setValue("mbti1", mbti); form.clearErrors("mbti1"); }}
                            className={`h-9 rounded-lg font-medium text-xs transition-all ${form.watch("mbti1") === mbti ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                            {mbti}
                          </button>
                        ))}
                      </div>
                      {form.formState.errors.mbti1 && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{form.formState.errors.mbti1.message}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-white/10 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-pink-400" />
                    </div>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* 두 번째 사람 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center">2</div>
                      <h3 className="text-white font-bold text-sm">두 번째 사람</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="name2" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-pink-400" /> 이름
                        </Label>
                        <div ref={name2Ref}>
                        <Input id="name2" placeholder="이름" {...form.register("name2")} className={`h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:ring-pink-500/50 focus:border-pink-500 transition-all text-sm ${form.formState.errors.name2 ? 'border-red-500/60 ring-1 ring-red-500/40' : ''}`} />
                        {form.formState.errors.name2 && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{form.formState.errors.name2.message}</p>}
                      </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-pink-400" /> 성별
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("gender2")}
                          onValueChange={(value) => { if (value) form.setValue("gender2", value as "male" | "female"); }}
                          className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                        >
                          <ToggleGroupItem value="male" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm">남</ToggleGroupItem>
                          <ToggleGroupItem value="female" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm">여</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                    <div className="space-y-1.5" ref={birthDate2Ref}>
                      <Label htmlFor="birthDate2" className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" /> 생년월일
                      </Label>
                      <DatePickerInput id="birthDate2" {...form.register("birthDate2")} accentColor="pink" />
                      {form.formState.errors.birthDate2 && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{form.formState.errors.birthDate2.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="birthTime2" className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-pink-400" /> 태어난 시간
                        </Label>
                        <BirthTimeSelect
                          value={form.watch("birthTime2")}
                          onChange={(val) => form.setValue("birthTime2", val)}
                          accentClass="focus:ring-pink-500/50 focus:border-pink-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-pink-400" /> 양력/음력
                        </Label>
                        <ToggleGroup
                          type="single"
                          value={form.watch("calendarType2")}
                          onValueChange={(value) => { if (value) form.setValue("calendarType2", value as "solar" | "lunar"); }}
                          className="w-full h-11 bg-white/5 p-1 rounded-xl border border-white/10 grid grid-cols-2 gap-1"
                        >
                          <ToggleGroupItem value="solar" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm">양력</ToggleGroupItem>
                          <ToggleGroupItem value="lunar" className="h-full rounded-lg data-[state=on]:bg-pink-500 data-[state=on]:text-white text-white/70 transition-all font-medium text-sm">음력</ToggleGroupItem>
                        </ToggleGroup>
                        {form.watch("calendarType2") === "lunar" && (
                          <div className="flex items-center justify-end gap-2 pr-1 pt-0.5">
                            <input type="checkbox" id="isLeapMonth2" checked={form.watch("isLeapMonth2") || false} onChange={(e) => form.setValue("isLeapMonth2", e.target.checked)} className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-pink-500" />
                            <Label htmlFor="isLeapMonth2" className="text-white/60 text-[11px] cursor-pointer">윤달입니다</Label>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5" ref={mbti2Ref}>
                      <Label className="text-white text-sm font-medium flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-pink-400" /> MBTI
                      </Label>
                      <div className={`grid grid-cols-4 gap-2 p-2 rounded-xl transition-all ${form.formState.errors.mbti2 ? 'ring-1 ring-red-500/40 bg-red-500/5' : ''}`}>
                        {['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'].map((mbti) => (
                          <button key={mbti} type="button" onClick={() => { form.setValue("mbti2", mbti); form.clearErrors("mbti2"); }}
                            className={`h-9 rounded-lg font-medium text-xs transition-all ${form.watch("mbti2") === mbti ? 'bg-pink-500 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>
                            {mbti}
                          </button>
                        ))}
                      </div>
                      {form.formState.errors.mbti2 && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{form.formState.errors.mbti2.message}</p>}
                    </div>
                  </div>

                  {/* 유효성 검사 에러 메시지 박스 */}
                  {validationErrors.length > 0 && (
                    <div ref={errorMsgRef} className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <p className="text-sm font-semibold text-red-400">아래 항목을 입력해주세요</p>
                      </div>
                      <ul className="space-y-1 pl-6">
                        {validationErrors.map((msg, i) => (
                          <li key={i} className="text-xs text-red-300/80 list-disc">{msg}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-12 font-bold rounded-xl hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}>
                    하이브리드 궁합 분석하기
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </>
  );
}
