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
 * DatePickerInput - 키보드 직접 입력 + 캘린더 아이콘 클릭으로 날짜 선택 가능한 컴포넌트
 * 
 * - 텍스트 필드에 YYYY-MM-DD 형식으로 직접 입력 가능
 * - 캘린더 아이콘 클릭 시 네이티브 date picker 열림
 * - react-hook-form의 register와 호환
 */
const DatePickerInput = forwardRef<HTMLInputElement, DatePickerInputProps>(
  ({ value, onChange, onBlur, name, id, className, placeholder, accentColor = "primary" }, ref) => {
    const hiddenDateRef = useRef<HTMLInputElement>(null);
    const [textValue, setTextValue] = useState(value || "");

    // 외부 value 변경 시 동기화
    useEffect(() => {
      if (value !== undefined && value !== textValue) {
        setTextValue(value);
      }
    }, [value]);

    // 텍스트 입력 핸들러 - 자동 하이픈 삽입
    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value.replace(/[^0-9]/g, "");
      
      // 최대 8자리 (YYYYMMDD)
      if (raw.length > 8) raw = raw.slice(0, 8);
      
      // 자동 하이픈 삽입
      let formatted = raw;
      if (raw.length > 4) {
        formatted = raw.slice(0, 4) + "-" + raw.slice(4);
      }
      if (raw.length > 6) {
        formatted = raw.slice(0, 4) + "-" + raw.slice(4, 6) + "-" + raw.slice(6);
      }
      
      setTextValue(formatted);

      // YYYY-MM-DD 형식 완성 시 onChange 트리거 (00 포함 허용)
      if (/^\d{4}-\d{2}-\d{2}$/.test(formatted)) {
        const syntheticEvent = {
          target: { value: formatted, name: name || "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
    }, [name, onChange]);

    // 텍스트 필드 blur 시 유효성 검사 및 onChange 트리거
    const handleTextBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      const val = textValue;
      // YYYY-MM-DD 형식이면 onChange 트리거 (00 포함 허용)
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        const syntheticEvent = {
          target: { value: val, name: name || "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
      onBlur?.(e as any);
    }, [textValue, name, onChange, onBlur])

    // 캘린더 아이콘 클릭 → 숨겨진 date input 열기
    const handleCalendarClick = useCallback(() => {
      if (hiddenDateRef.current) {
        hiddenDateRef.current.showPicker?.();
        hiddenDateRef.current.click();
      }
    }, []);

    // 숨겨진 date input에서 날짜 선택 시
    const handleDatePickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const dateVal = e.target.value;
      if (dateVal) {
        setTextValue(dateVal);
        const syntheticEvent = {
          target: { value: dateVal, name: name || "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
    }, [name, onChange]);

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
        {/* 보이는 텍스트 입력 필드 */}
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          id={id}
          name={name}
          value={textValue}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          placeholder={placeholder || "YYYY-MM-DD"}
          maxLength={10}
          autoComplete="off"
          className={cn(
            "flex h-11 w-full rounded-xl border bg-white/5 border-white/10 px-3 pr-10 py-2 text-sm text-white ring-offset-background transition-all",
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
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="캘린더에서 날짜 선택"
        >
          <Calendar className="w-4 h-4 text-white/50 hover:text-white/80 transition-colors" />
        </button>
        
        {/* 숨겨진 네이티브 date picker */}
        <input
          ref={hiddenDateRef}
          type="date"
          value={/^\d{4}-\d{2}-\d{2}$/.test(textValue) ? textValue : ""}
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
