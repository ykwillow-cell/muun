/**
 * BirthTimeSelect - 태어난 시간을 12지지 시간대로 선택하는 드롭다운 컴포넌트
 *
 * - 각 시간대 선택 시 해당 시간대의 중심 시간(HH:MM)으로 자동 매핑됩니다.
 *   예) 축시(01:31~03:30) 선택 → "02:30"
 * - 마지막 옵션 '모름'을 선택하면 onUnknownChange(true)가 호출됩니다.
 * - DatePickerInput과 동일한 높이(44px), rounded-xl, border, text-sm 스타일을 사용합니다.
 * - SelectTrigger 기본 스타일(data-[size=default]:h-9)을 !important로 덮어씁니다.
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SiOption {
  label: string;       // 표시 텍스트 (예: "축시 (01:31~03:30)")
  value: string;       // 중심 시간 HH:MM (예: "02:30")
}

/** '모름' 선택 시 사용하는 특수 value 상수 */
export const BIRTH_TIME_UNKNOWN_VALUE = "__unknown__";

/** 12지지 + 자시 분리 시간대 목록 */
export const SI_OPTIONS: SiOption[] = [
  { label: "조자시 (00:00~01:30)", value: "00:45" },
  { label: "축시 (01:31~03:30)",   value: "02:30" },
  { label: "인시 (03:31~05:30)",   value: "04:30" },
  { label: "묘시 (05:31~07:30)",   value: "06:30" },
  { label: "진시 (07:31~09:30)",   value: "08:30" },
  { label: "사시 (09:31~11:30)",   value: "10:30" },
  { label: "오시 (11:31~13:30)",   value: "12:30" },
  { label: "미시 (13:31~15:30)",   value: "14:30" },
  { label: "신시 (15:31~17:30)",   value: "16:30" },
  { label: "유시 (17:31~19:30)",   value: "18:30" },
  { label: "술시 (19:31~21:30)",   value: "20:30" },
  { label: "해시 (21:31~23:30)",   value: "22:30" },
  { label: "야자시 (23:31~24:00)", value: "23:45" },
];

/**
 * HH:MM 형식의 시간 문자열을 받아 가장 가까운 시간대 value를 반환합니다.
 * 기존 저장된 시간값을 드롭다운 초기값으로 변환할 때 사용합니다.
 */
export function timeToSiValue(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const totalMin = h * 60 + m;

  const ranges = [
    { min: 0,    max: 90,   value: "00:45" }, // 조자시 00:00~01:30
    { min: 91,   max: 210,  value: "02:30" }, // 축시   01:31~03:30
    { min: 211,  max: 330,  value: "04:30" }, // 인시   03:31~05:30
    { min: 331,  max: 450,  value: "06:30" }, // 묘시   05:31~07:30
    { min: 451,  max: 570,  value: "08:30" }, // 진시   07:31~09:30
    { min: 571,  max: 690,  value: "10:30" }, // 사시   09:31~11:30
    { min: 691,  max: 810,  value: "12:30" }, // 오시   11:31~13:30
    { min: 811,  max: 930,  value: "14:30" }, // 미시   13:31~15:30
    { min: 931,  max: 1050, value: "16:30" }, // 신시   15:31~17:30
    { min: 1051, max: 1170, value: "18:30" }, // 유시   17:31~19:30
    { min: 1171, max: 1290, value: "20:30" }, // 술시   19:31~21:30
    { min: 1291, max: 1410, value: "22:30" }, // 해시   21:31~23:30
    { min: 1411, max: 1440, value: "23:45" }, // 야자시 23:31~24:00
  ];

  const found = ranges.find((r) => totalMin >= r.min && totalMin <= r.max);
  return found ? found.value : "12:30"; // 기본값: 오시
}

interface BirthTimeSelectProps {
  /**
   * 현재 선택된 중심 시간값 (HH:MM).
   * '모름' 상태일 때는 BIRTH_TIME_UNKNOWN_VALUE 또는 빈 문자열을 전달하세요.
   */
  value: string;
  /** 시간대 선택 콜백 - 선택된 시간대의 중심 시간(HH:MM)을 반환 */
  onChange: (value: string) => void;
  /**
   * '모름' 선택/해제 콜백.
   * 제공하면 드롭다운에 '모름' 옵션이 표시되고, 선택 시 true가 전달됩니다.
   * 일반 시간대 선택 시 false가 전달됩니다.
   */
  onUnknownChange?: (isUnknown: boolean) => void;
  /** 현재 '모름' 상태 여부 - 드롭다운에 '모름'이 선택된 상태로 표시됩니다 */
  isUnknown?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 포커스 링 색상 클래스 (예: "focus:ring-primary/50 focus:border-primary") */
  accentClass?: string;
}

export function BirthTimeSelect({
  value,
  onChange,
  onUnknownChange,
  isUnknown = false,
  className,
  accentClass = "focus:ring-primary/50 focus:border-primary",
}: BirthTimeSelectProps) {
  // '모름' 상태이면 특수 value, 아니면 시간대 value로 표시
  const selectValue = isUnknown
    ? BIRTH_TIME_UNKNOWN_VALUE
    : SI_OPTIONS.find((o) => o.value === value)
    ? value
    : value
    ? timeToSiValue(value)
    : "";

  const handleChange = (val: string) => {
    if (val === BIRTH_TIME_UNKNOWN_VALUE) {
      // '모름' 선택
      onUnknownChange?.(true);
    } else {
      // 일반 시간대 선택
      onUnknownChange?.(false);
      onChange(val);
    }
  };

  return (
    <Select value={selectValue} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          // SelectTrigger 기본 data-[size=default]:h-9(36px)를 !h-11(44px)로 강제 덮어씀
          "!h-11 w-full rounded-xl border border-black/10 bg-white",
          "px-3 py-2 text-sm text-foreground",
          "ring-offset-background transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
          accentClass,
          !selectValue && "text-foreground/40",
          className
        )}
      >
        <SelectValue placeholder="시간대 선택" />
      </SelectTrigger>
      <SelectContent className="bg-white border-black/10 text-foreground max-h-72">
        {SI_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-foreground hover:bg-primary/8 focus:bg-primary/8 focus:text-primary cursor-pointer"
          >
            {option.label}
          </SelectItem>
        ))}
        {/* '모름' 옵션 - 항상 표시, 구분선 없이 다른 항목과 동일한 스타일 */}
        <SelectItem
          value={BIRTH_TIME_UNKNOWN_VALUE}
          className="text-foreground hover:bg-primary/8 focus:bg-primary/8 focus:text-primary cursor-pointer"
        >
          모름 (시간 모름)
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
