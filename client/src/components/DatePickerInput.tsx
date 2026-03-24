import { forwardRef, useRef, useState, useEffect, useCallback } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  className?: string;
  placeholder?: string;
  accentColor?: string;
}

/**
 * DatePickerInput - react-hook-form과 완벽 호환되는 날짜 입력 컴포넌트
 *
 * - 텍스트 필드에 YYYY-MM-DD 형식으로 직접 입력 가능
 * - 캘린더 아이콘 클릭 시 네이티브 date picker 열림
 * - forwardRef로 내부 input을 직접 노출하여 react-hook-form과 완벽 호환
 *
 * 사용 방법:
 *   <DatePickerInput
 *     {...form.register("birthDate")}
 *     value={form.watch("birthDate")}   ← 반드시 value를 명시적으로 전달해야 합니다
 *   />
 */
const DatePickerInput = forwardRef<HTMLInputElement, DatePickerInputProps>(
  ({ value, onChange, onBlur, name, id, className, placeholder, accentColor = "primary" }, ref) => {
    const elementId = id || name || 'date-picker-input';
    const hiddenDateRef = useRef<HTMLInputElement>(null);
    const [textValue, setTextValue] = useState(value || "");

    // YYYY-MM-DD → YYYY. MM. DD 표시 포맷 변환
    const toDisplayFormat = (v: string) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        const [y, m, d] = v.split('-');
        return `${y}. ${m}. ${d}`;
      }
      return v;
    };

    // 외부 value 변경 시 동기화
    useEffect(() => {
      if (value !== undefined) {
        const display = toDisplayFormat(value);
        if (display !== textValue) {
          setTextValue(display);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // 텍스트 입력 핸들러 - 자동 점(.) 삽입 (YYYY. MM. DD 포맷)
    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value.replace(/[^0-9]/g, "");

      // 최대 8자리 (YYYYMMDD)
      if (raw.length > 8) raw = raw.slice(0, 8);

      // 자동 점 삽입 → 표시 포맷: YYYY. MM. DD
      let display = raw;
      if (raw.length > 4) {
        display = raw.slice(0, 4) + ". " + raw.slice(4);
      }
      if (raw.length > 6) {
        display = raw.slice(0, 4) + ". " + raw.slice(4, 6) + ". " + raw.slice(6);
      }

      setTextValue(display);

      // 내부 value는 YYYY-MM-DD 형식으로 onChange 트리거
      if (raw.length === 8) {
        const isoFormatted = raw.slice(0, 4) + "-" + raw.slice(4, 6) + "-" + raw.slice(6);
        const syntheticEvent = {
          target: {
            value: isoFormatted,
            name: name || "",
            id: elementId,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
    }, [name, onChange, elementId]);

    // 텍스트 필드 blur 시 유효성 검사 및 onChange 트리거
    const handleTextBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      const raw = textValue.replace(/[^0-9]/g, "");
      // 8자리 숫자이면 YYYY-MM-DD로 변환하여 onChange 트리거
      if (raw.length === 8) {
        const isoVal = raw.slice(0, 4) + "-" + raw.slice(4, 6) + "-" + raw.slice(6);
        const syntheticEvent = {
          target: {
            value: isoVal,
            name: name || "",
            id: elementId,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
      onBlur?.(e);
    }, [textValue, name, onChange, onBlur, elementId]);

    // 캘린더 아이콘 클릭 → 숨겨진 date input 열기
    const handleCalendarClick = useCallback(() => {
      if (hiddenDateRef.current) {
        hiddenDateRef.current.showPicker?.();
        hiddenDateRef.current.click();
      }
    }, []);

    // 숨겨진 date input에서 날짜 선택 시 (YYYY-MM-DD → YYYY. MM. DD 표시)
    const handleDatePickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const dateVal = e.target.value; // YYYY-MM-DD
      if (dateVal) {
        setTextValue(toDisplayFormat(dateVal)); // 표시: YYYY. MM. DD
        const syntheticEvent = {
          target: {
            value: dateVal, // 내부 value: YYYY-MM-DD
            name: name || "",
            id: elementId,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
    }, [name, onChange, elementId]);

    // 포커스 색상 맵
    const focusColorMap: Record<string, string> = {
      primary: "focus:ring-primary/50 focus:border-primary",
      pink: "focus:ring-pink-500/50 focus:border-pink-500",
      red: "focus:ring-red-500/50 focus:border-red-500",
      orange: "focus:ring-orange-500/50 focus:border-orange-500",
      purple: "focus:ring-purple-500/50 focus:border-purple-500",
      emerald: "focus:ring-emerald-500/50 focus:border-emerald-500",
      amber: "focus:ring-amber-500/50 focus:border-amber-500",
      blue: "focus:ring-blue-500/50 focus:border-blue-500",
    };

    const focusClass = focusColorMap[accentColor] || focusColorMap.primary;

    return (
      <div className="relative">
        {/* 보이는 텍스트 입력 필드 - ref 직접 연결 */}
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          id={elementId}
          name={name}
          value={textValue}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          placeholder={placeholder || "YYYY. MM. DD"}
          maxLength={10}
          autoComplete="off"
          className={cn(
            "flex h-11 w-full rounded-xl border bg-[#F7F5F3] border-[#E8E5E0] px-3 pr-10 py-2 text-sm text-[#1a1a18] ring-offset-background transition-all",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
            focusClass,
            className
          )}
        />

        {/* 캘린더 아이콘 버튼 */}
        <button
          type="button"
          onClick={handleCalendarClick}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-black/[0.06] transition-colors"
          aria-label="캘린더에서 날짜 선택"
          tabIndex={-1}
        >
          <Calendar className="w-4 h-4 text-[#999891] hover:text-[#1a1a18] transition-colors" />
        </button>

        {/* 숨겨진 네이티브 date picker */}
        <input
          ref={hiddenDateRef}
          type="date"
          value={/^\d{4}-\d{2}-\d{2}$/.test(value || "") ? (value || "") : ""}
          onChange={handleDatePickerChange}
          tabIndex={-1}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }
);

DatePickerInput.displayName = "DatePickerInput";

export default DatePickerInput;
