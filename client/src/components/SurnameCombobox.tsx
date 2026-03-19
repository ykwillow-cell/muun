/**
 * SurnameCombobox.tsx
 *
 * 한글 성씨 입력 → 자동완성 드롭다운 → 원획수 자동 매칭 컴포넌트
 *
 * 기능:
 * - 한글 성씨 타이핑 시 실시간 필터링 (초성 검색 포함)
 * - 동음이의 성씨(강=姜/康/江, 신=申/辛 등) 처리 → 한자 선택 UI
 * - 2자 성씨(남궁, 독고, 선우 등) 지원
 * - 선택 시 원획수 자동 반환
 * - "목록에 없는 성씨" 직접 입력 지원
 */

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// ──────────────────────────────────────────────
// 성씨 데이터 타입
// ──────────────────────────────────────────────
export interface SurnameEntry {
  hangul: string;       // 한글 성씨 (예: "김")
  hanja: string;        // 한자 (예: "金")
  strokes: number;      // 원획수
  note?: string;        // 비고 (예: "본관별 상이")
}

// ──────────────────────────────────────────────
// 통계청 기준 한국 성씨 원획수 데이터
// 원획수(原劃數): 변형 부수를 원래 한자로 환원한 획수
// 예) 氵(삼수변) → 水(4획), 忄(심방변) → 心(4획)
// ──────────────────────────────────────────────
export const SURNAME_DATA: SurnameEntry[] = [
  // ── 1자 성씨 (가나다 순) ──────────────────────
  { hangul: "강", hanja: "姜", strokes: 9 },
  { hangul: "강", hanja: "康", strokes: 11 },
  { hangul: "강", hanja: "江", strokes: 7 },
  { hangul: "견", hanja: "堅", strokes: 11 },
  { hangul: "경", hanja: "慶", strokes: 15 },
  { hangul: "계", hanja: "桂", strokes: 10 },
  { hangul: "고", hanja: "高", strokes: 10 },
  { hangul: "공", hanja: "孔", strokes: 4 },
  { hangul: "곽", hanja: "郭", strokes: 15 },
  { hangul: "구", hanja: "具", strokes: 8 },
  { hangul: "구", hanja: "丘", strokes: 5 },
  { hangul: "국", hanja: "鞠", strokes: 17 },
  { hangul: "권", hanja: "權", strokes: 22 },
  { hangul: "금", hanja: "琴", strokes: 12 },
  { hangul: "기", hanja: "奇", strokes: 8 },
  { hangul: "길", hanja: "吉", strokes: 6 },
  { hangul: "김", hanja: "金", strokes: 8 },
  { hangul: "나", hanja: "羅", strokes: 20 },
  { hangul: "남", hanja: "南", strokes: 9 },
  { hangul: "노", hanja: "盧", strokes: 16 },
  { hangul: "노", hanja: "魯", strokes: 15 },
  { hangul: "도", hanja: "都", strokes: 12 },
  { hangul: "도", hanja: "道", strokes: 13 },
  { hangul: "동", hanja: "董", strokes: 12 },
  { hangul: "두", hanja: "杜", strokes: 7 },
  { hangul: "류", hanja: "柳", strokes: 9 },
  { hangul: "류", hanja: "劉", strokes: 15 },
  { hangul: "마", hanja: "馬", strokes: 10 },
  { hangul: "맹", hanja: "孟", strokes: 8 },
  { hangul: "명", hanja: "明", strokes: 8 },
  { hangul: "모", hanja: "牟", strokes: 6 },
  { hangul: "목", hanja: "睦", strokes: 13 },
  { hangul: "문", hanja: "文", strokes: 4 },
  { hangul: "민", hanja: "閔", strokes: 5 },
  { hangul: "박", hanja: "朴", strokes: 6 },
  { hangul: "반", hanja: "潘", strokes: 15 },
  { hangul: "방", hanja: "方", strokes: 4 },
  { hangul: "방", hanja: "房", strokes: 8 },
  { hangul: "배", hanja: "裵", strokes: 14 },
  { hangul: "백", hanja: "白", strokes: 5 },
  { hangul: "변", hanja: "卞", strokes: 5 },
  { hangul: "봉", hanja: "奉", strokes: 8 },
  { hangul: "부", hanja: "夫", strokes: 4 },
  { hangul: "빈", hanja: "賓", strokes: 14 },
  { hangul: "사", hanja: "史", strokes: 5 },
  { hangul: "서", hanja: "徐", strokes: 10 },
  { hangul: "석", hanja: "石", strokes: 5 },
  { hangul: "석", hanja: "昔", strokes: 8 },
  { hangul: "선", hanja: "宣", strokes: 9 },
  { hangul: "성", hanja: "成", strokes: 7 },
  { hangul: "소", hanja: "蘇", strokes: 22 },
  { hangul: "손", hanja: "孫", strokes: 10 },
  { hangul: "송", hanja: "宋", strokes: 7 },
  { hangul: "신", hanja: "申", strokes: 5 },
  { hangul: "신", hanja: "辛", strokes: 7 },
  { hangul: "심", hanja: "沈", strokes: 8 },
  { hangul: "안", hanja: "安", strokes: 6 },
  { hangul: "양", hanja: "梁", strokes: 11 },
  { hangul: "양", hanja: "楊", strokes: 13 },
  { hangul: "어", hanja: "魚", strokes: 11 },
  { hangul: "엄", hanja: "嚴", strokes: 20 },
  { hangul: "여", hanja: "呂", strokes: 7 },
  { hangul: "연", hanja: "延", strokes: 7 },
  { hangul: "염", hanja: "廉", strokes: 13 },
  { hangul: "오", hanja: "吳", strokes: 7 },
  { hangul: "옥", hanja: "玉", strokes: 5 },
  { hangul: "온", hanja: "溫", strokes: 13 },
  { hangul: "왕", hanja: "王", strokes: 4 },
  { hangul: "용", hanja: "龍", strokes: 16 },
  { hangul: "우", hanja: "禹", strokes: 9 },
  { hangul: "원", hanja: "元", strokes: 4 },
  { hangul: "위", hanja: "魏", strokes: 18 },
  { hangul: "유", hanja: "劉", strokes: 15 },
  { hangul: "유", hanja: "兪", strokes: 9 },
  { hangul: "윤", hanja: "尹", strokes: 4 },
  { hangul: "은", hanja: "殷", strokes: 10 },
  { hangul: "이", hanja: "李", strokes: 7 },
  { hangul: "인", hanja: "印", strokes: 6 },
  { hangul: "임", hanja: "林", strokes: 8 },
  { hangul: "임", hanja: "任", strokes: 6 },
  { hangul: "장", hanja: "張", strokes: 11 },
  { hangul: "장", hanja: "蔣", strokes: 15 },
  { hangul: "전", hanja: "全", strokes: 6 },
  { hangul: "전", hanja: "田", strokes: 5 },
  { hangul: "정", hanja: "鄭", strokes: 15 },
  { hangul: "정", hanja: "丁", strokes: 2 },
  { hangul: "제", hanja: "諸", strokes: 16 },
  { hangul: "조", hanja: "趙", strokes: 14 },
  { hangul: "조", hanja: "曺", strokes: 11 },
  { hangul: "주", hanja: "朱", strokes: 6 },
  { hangul: "주", hanja: "周", strokes: 8 },
  { hangul: "진", hanja: "陳", strokes: 11 },
  { hangul: "진", hanja: "秦", strokes: 10 },
  { hangul: "차", hanja: "車", strokes: 7 },
  { hangul: "채", hanja: "蔡", strokes: 14 },
  { hangul: "천", hanja: "千", strokes: 3 },
  { hangul: "최", hanja: "崔", strokes: 11 },
  { hangul: "추", hanja: "秋", strokes: 9 },
  { hangul: "탁", hanja: "卓", strokes: 8 },
  { hangul: "태", hanja: "太", strokes: 4 },
  { hangul: "판", hanja: "判", strokes: 7 },
  { hangul: "편", hanja: "片", strokes: 4 },
  { hangul: "피", hanja: "皮", strokes: 5 },
  { hangul: "하", hanja: "河", strokes: 9 },
  { hangul: "하", hanja: "夏", strokes: 10 },
  { hangul: "한", hanja: "韓", strokes: 17 },
  { hangul: "함", hanja: "咸", strokes: 9 },
  { hangul: "허", hanja: "許", strokes: 11 },
  { hangul: "현", hanja: "玄", strokes: 5 },
  { hangul: "홍", hanja: "洪", strokes: 10 },
  { hangul: "황", hanja: "黃", strokes: 12 },

  // ── 2자 성씨 ──────────────────────────────────
  { hangul: "남궁", hanja: "南宮", strokes: 19 },
  { hangul: "독고", hanja: "獨孤", strokes: 19 },
  { hangul: "동방", hanja: "東方", strokes: 8 },
  { hangul: "망절", hanja: "網切", strokes: 18 },
  { hangul: "무본", hanja: "武本", strokes: 9 },
  { hangul: "사공", hanja: "司空", strokes: 13 },
  { hangul: "서문", hanja: "西門", strokes: 11 },
  { hangul: "선우", hanja: "鮮于", strokes: 17 },
  { hangul: "제갈", hanja: "諸葛", strokes: 28 },
  { hangul: "황보", hanja: "皇甫", strokes: 14 },
];

// ──────────────────────────────────────────────
// 한글 초성 추출 (자동완성 검색용)
// ──────────────────────────────────────────────
const CHOSUNG = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
function getChosung(char: string): string {
  const code = char.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return char;
  return CHOSUNG[Math.floor(code / 588)];
}
function extractChosung(str: string): string {
  return str.split("").map(getChosung).join("");
}

// ──────────────────────────────────────────────
// 컴포넌트 Props
// ──────────────────────────────────────────────
interface SurnameComboboxProps {
  value: string;          // 현재 선택된 "한글(한자)" 예: "김(金)"
  strokes: number;        // 현재 선택된 성씨 원획수
  onChange: (hangul: string, hanja: string, strokes: number) => void;
  error?: string;
}

export default function SurnameCombobox({
  value,
  strokes,
  onChange,
  error,
}: SurnameComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [homonymOptions, setHomonymOptions] = useState<SurnameEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 필터링된 성씨 목록 (중복 한글 제거 후 대표 항목만 표시)
  const filtered = (() => {
    if (!query.trim()) {
      // 빈 쿼리 시 전체 목록 (한글 기준 중복 제거)
      const seen = new Set<string>();
      return SURNAME_DATA.filter((s) => {
        if (seen.has(s.hangul)) return false;
        seen.add(s.hangul);
        return true;
      });
    }
    const q = query.trim().toLowerCase();
    const qChosung = extractChosung(q);
    // 한글 성씨 또는 한자로 검색
    const seen = new Set<string>();
    return SURNAME_DATA.filter((s) => {
      const key = s.hangul;
      if (seen.has(key)) return false;
      const matchHangul = s.hangul.includes(q);
      const matchHanja = s.hanja.includes(q);
      const matchChosung = extractChosung(s.hangul).startsWith(qChosung);
      if (matchHangul || matchHanja || matchChosung) {
        seen.add(key);
        return true;
      }
      return false;
    });
  })();

  // 성씨 선택 핸들러
  const handleSelect = (entry: SurnameEntry) => {
    // 동음이의 성씨 확인
    const homonyms = SURNAME_DATA.filter((s) => s.hangul === entry.hangul);
    if (homonyms.length > 1) {
      // 동음이의가 있으면 한자 선택 UI 표시
      setHomonymOptions(homonyms);
      setQuery(entry.hangul);
      setOpen(false);
    } else {
      // 단일 성씨 → 바로 선택
      confirmSelect(entry);
    }
  };

  const confirmSelect = (entry: SurnameEntry) => {
    onChange(entry.hangul, entry.hanja, entry.strokes);
    setQuery(entry.hangul);
    setHomonymOptions([]);
    setOpen(false);
  };

  const handleClear = () => {
    onChange("", "", 0);
    setQuery("");
    setHomonymOptions([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const displayValue = value
    ? `${value.split("(")[0]}(${value.split("(")[1]?.replace(")", "") ?? ""}) — ${strokes}획`
    : "";

  return (
    <div className="relative w-full">
      {/* 입력 필드 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999891] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value && !open ? displayValue : query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHomonymOptions([]);
            // 입력값 변경 시 선택 초기화
            if (value) onChange("", "", 0);
          }}
          onFocus={() => {
            setOpen(true);
            if (value) setQuery("");
          }}
          placeholder="성씨 입력 (예: 김, 이, 박)"
          className={cn(
            "w-full h-11 bg-black/[0.05] border text-[#1a1a18] rounded-xl pl-9 pr-9 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all",
            "placeholder:text-[#999891]",
            error ? "border-red-500/50" : "border-black/10"
          )}
        />
        {/* 우측 아이콘 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[#999891] hover:text-[#5a5a56] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronsUpDown className="w-3.5 h-3.5 text-[#999891] pointer-events-none" />
        </div>
      </div>

      {/* 선택된 성씨 획수 표시 */}
      {value && strokes > 0 && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <Badge
            variant="outline"
            className="text-[11px] bg-amber-500/10 border-amber-500/30 text-amber-700 px-2 py-0.5"
          >
            {value} — 원획수 {strokes}획
          </Badge>
          <span className="text-[10px] text-[#999891]">자동 적용됨</span>
        </div>
      )}

      {/* 동음이의 한자 선택 UI */}
      {homonymOptions.length > 1 && (
        <div className="mt-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 space-y-2">
          <p className="text-xs text-amber-700 font-medium">
            "{homonymOptions[0].hangul}" 성씨의 한자를 선택해주세요
          </p>
          <div className="grid grid-cols-2 gap-2">
            {homonymOptions.map((opt) => (
              <button
                key={opt.hanja}
                type="button"
                onClick={() => confirmSelect(opt)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-2.5 text-left transition-all",
                  "bg-black/[0.05] border-black/10 hover:bg-amber-500/10 hover:border-amber-500/30",
                  value === `${opt.hangul}(${opt.hanja})`
                    ? "bg-amber-500/10 border-amber-500/30"
                    : ""
                )}
              >
                <span className="text-xl font-black text-[#1a1a18]">{opt.hanja}</span>
                <div>
                  <p className="text-xs text-[#1a1a18] font-medium">{opt.hangul}({opt.hanja})</p>
                  <p className="text-[10px] text-[#999891]">{opt.strokes}획</p>
                </div>
                {value === `${opt.hangul}(${opt.hanja})` && (
                  <Check className="w-3.5 h-3.5 text-amber-600 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 드롭다운 목록 */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-black/10 bg-[#0d0d14] shadow-2xl shadow-black/50"
        >
          {filtered.length === 0 ? (
            <div className="p-3 text-center">
              <p className="text-xs text-[#999891]">검색 결과가 없습니다</p>
              <p className="text-[11px] text-[#1a1a18]/25 mt-1">
                목록에 없는 성씨는 아래 직접 입력을 이용해주세요
              </p>
            </div>
          ) : (
            <ul className="py-1">
              {filtered.map((s) => {
                // 해당 한글 성씨의 모든 한자 목록
                const allHanja = SURNAME_DATA.filter(
                  (x) => x.hangul === s.hangul
                );
                return (
                  <li key={s.hangul}>
                    <button
                      type="button"
                      onClick={() => handleSelect(s)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2.5 text-left",
                        "hover:bg-black/[0.05] transition-colors",
                        value?.startsWith(s.hangul + "(")
                          ? "bg-amber-500/10"
                          : ""
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base font-black text-[#1a1a18] w-6 text-center">
                          {s.hangul}
                        </span>
                        <div>
                          <span className="text-sm text-[#5a5a56]">
                            {allHanja.map((h) => h.hanja).join(" / ")}
                          </span>
                          {allHanja.length > 1 && (
                            <span className="ml-1.5 text-[10px] text-amber-600/70">
                              ({allHanja.length}가지)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#999891]">
                          {allHanja.length === 1
                            ? `${s.strokes}획`
                            : `${Math.min(...allHanja.map((h) => h.strokes))}~${Math.max(...allHanja.map((h) => h.strokes))}획`}
                        </span>
                        {value?.startsWith(s.hangul + "(") && (
                          <Check className="w-3.5 h-3.5 text-amber-600" />
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* 직접 입력 옵션 */}
          {query.trim() && (
            <div className="border-t border-black/10 p-2">
              <button
                type="button"
                onClick={() => {
                  // 입력한 텍스트를 성씨로 사용, 획수는 별도 입력 필요
                  onChange(query.trim(), "?", -1);
                  setOpen(false);
                  setHomonymOptions([]);
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-black/[0.05] transition-colors"
              >
                <span className="text-xs text-[#999891]">
                  "{query.trim()}" 직접 입력
                </span>
                <span className="ml-1.5 text-[10px] text-amber-600/60">
                  (획수 별도 입력 필요)
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
