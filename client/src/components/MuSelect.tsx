import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

interface MuSelectOption {
  value: string;
  label: string;
  sub?: string;
}

interface MuSelectProps {
  options: MuSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  /** 다크 배경 위에서 사용할 때 true로 설정 */
  dark?: boolean;
}

export function MuSelect({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  label,
  id,
  dark = false,
}: MuSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // 드롭다운 열릴 때 트리거 위치 계산 → Portal로 body에 렌더링
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropHeight = Math.min(220, options.length * 44 + 8);

      if (spaceBelow < dropHeight && rect.top > dropHeight) {
        // 위로 열기
        setDropdownStyle({
          position: 'fixed',
          bottom: window.innerHeight - rect.top + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 99999,
        });
      } else {
        // 아래로 열기
        setDropdownStyle({
          position: 'fixed',
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 99999,
        });
      }
    }
  }, [open, options.length]);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // 드롭다운 내부 클릭이면 무시
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) return;
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleScroll = (e: Event) => {
      // 드롭다운 내부 스크롤이면 닫지 않음
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const dropdownEl = open ? (
    <ul
      ref={dropdownRef}
      className={`mu-select__dropdown${dark ? " mu-select__dropdown--dark" : ""}`}
      role="listbox"
      aria-label={label}
      style={dropdownStyle}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {options.map((opt) => (
        <li
          key={opt.value}
          role="option"
          aria-selected={opt.value === value}
          className={`mu-select__option${opt.value === value ? " mu-select__option--selected" : ""}${dark ? " mu-select__option--dark" : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            onChange(opt.value);
            setOpen(false);
          }}
        >
          <span className="mu-select__option-label">{opt.label}</span>
          {opt.sub && <span className={`mu-select__option-sub${dark ? " mu-select__option-sub--dark" : ""}`}>{opt.sub}</span>}
          {opt.value === value && (
            <Check size={13} className={`mu-select__option-check${dark ? " mu-select__option-check--dark" : ""}`} />
          )}
        </li>
      ))}
    </ul>
  ) : null;

  return (
    <div className="mu-select" ref={containerRef}>
      {label && (
        <label className={`mu-select__label${dark ? " mu-select__label--dark" : ""}`} htmlFor={id}>
          {label}
        </label>
      )}
      <button
        id={id}
        ref={triggerRef}
        type="button"
        className={`mu-select__trigger${open ? " mu-select__trigger--open" : ""}${dark ? " mu-select__trigger--dark" : ""}`}
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "mu-select__value" : "mu-select__placeholder"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`mu-select__chevron${open ? " mu-select__chevron--open" : ""}`}
        />
      </button>

      {/* Portal로 body에 렌더링 — backdrop-filter stacking context 탈출 */}
      {typeof document !== "undefined" && createPortal(dropdownEl, document.body)}

      <style>{`
        .mu-select {
          position: relative;
          width: 100%;
        }

        /* ── 라벨 ── */
        .mu-select__label {
          display: block;
          font-size: 12px;
          color: #5a5a56;
          margin-bottom: 6px;
          font-weight: 500;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-select__label--dark {
          color: rgba(255,255,255,0.55);
        }

        /* ── 트리거 버튼 (라이트) ── */
        .mu-select__trigger {
          width: 100%;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          background: #ffffff;
          border: 0.5px solid rgba(0,0,0,0.14);
          border-radius: 10px;
          font-size: 14px;
          color: #1a1a18;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-select__trigger:hover,
        .mu-select__trigger--open {
          border-color: rgba(0,0,0,0.30);
          background: #f5f4ef;
        }

        /* ── 트리거 버튼 (다크) ── */
        .mu-select__trigger--dark {
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.20);
          color: #ffffff;
        }
        .mu-select__trigger--dark:hover,
        .mu-select__trigger--dark.mu-select__trigger--open {
          background: rgba(255,255,255,0.18);
          border-color: rgba(167,139,250,0.70);
        }
        .mu-select__trigger--dark .mu-select__placeholder {
          color: rgba(255,255,255,0.35);
        }
        .mu-select__trigger--dark .mu-select__value {
          color: #ffffff;
        }
        .mu-select__trigger--dark .mu-select__chevron {
          color: rgba(255,255,255,0.55);
        }

        /* ── 공통 ── */
        .mu-select__placeholder {
          color: #999891;
        }
        .mu-select__value {
          color: #1a1a18;
        }
        .mu-select__chevron {
          color: #5a5a56;
          transition: transform 0.18s;
          flex-shrink: 0;
        }
        .mu-select__chevron--open {
          transform: rotate(180deg);
        }

        /* ── 드롭다운 (라이트) ── */
        .mu-select__dropdown {
          position: fixed;
          z-index: 99999;
          background: #ffffff;
          border: 0.5px solid rgba(0,0,0,0.12);
          border-radius: 10px;
          padding: 4px;
          max-height: 220px;
          overflow-y: auto;
          list-style: none;
          margin: 0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        /* ── 드롭다운 (다크) ── */
        .mu-select__dropdown--dark {
          background: #1e0f4a;
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: 0 8px 32px rgba(0,0,0,0.50);
        }

        .mu-select__dropdown::-webkit-scrollbar { width: 4px; }
        .mu-select__dropdown::-webkit-scrollbar-track { background: transparent; }
        .mu-select__dropdown::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.10);
          border-radius: 2px;
        }
        .mu-select__dropdown--dark::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
        }

        /* ── 옵션 (라이트) ── */
        .mu-select__option {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 10px;
          border-radius: 7px;
          cursor: pointer;
          transition: background 0.12s;
          font-size: 13px;
          color: #5a5a56;
          min-height: 36px;
          font-family: 'Pretendard Variable', Pretendard, sans-serif;
        }
        .mu-select__option:hover {
          background: #f5f4ef;
          color: #1a1a18;
        }
        .mu-select__option--selected {
          background: rgba(0,0,0,0.05);
          color: #1a1a18;
        }

        /* ── 옵션 (다크) ── */
        .mu-select__option--dark {
          color: rgba(255,255,255,0.75);
        }
        .mu-select__option--dark:hover {
          background: rgba(255,255,255,0.10);
          color: #ffffff;
        }
        .mu-select__option--dark.mu-select__option--selected {
          background: rgba(123,97,255,0.25);
          color: #ffffff;
        }

        .mu-select__option-label { flex: 1; }
        .mu-select__option-sub {
          font-size: 11px;
          color: #999891;
        }
        .mu-select__option-sub--dark {
          color: rgba(255,255,255,0.35);
        }
        .mu-select__option-check { color: #1a1a18; flex-shrink: 0; }
        .mu-select__option-check--dark { color: #a78bfa; }
      `}</style>
    </div>
  );
}

/* ── 12간지 시간 옵션 ── */
export const SIJU_OPTIONS: MuSelectOption[] = [
  { value: "unknown", label: "모름", sub: "시간을 모를 경우" },
  { value: "23-01", label: "자시 (子時)", sub: "23:00 – 01:00" },
  { value: "01-03", label: "축시 (丑時)", sub: "01:00 – 03:00" },
  { value: "03-05", label: "인시 (寅時)", sub: "03:00 – 05:00" },
  { value: "05-07", label: "묘시 (卯時)", sub: "05:00 – 07:00" },
  { value: "07-09", label: "진시 (辰時)", sub: "07:00 – 09:00" },
  { value: "09-11", label: "사시 (巳時)", sub: "09:00 – 11:00" },
  { value: "11-13", label: "오시 (午時)", sub: "11:00 – 13:00" },
  { value: "13-15", label: "미시 (未時)", sub: "13:00 – 15:00" },
  { value: "15-17", label: "신시 (申時)", sub: "15:00 – 17:00" },
  { value: "17-19", label: "유시 (酉時)", sub: "17:00 – 19:00" },
  { value: "19-21", label: "술시 (戌時)", sub: "19:00 – 21:00" },
  { value: "21-23", label: "해시 (亥時)", sub: "21:00 – 23:00" },
];
