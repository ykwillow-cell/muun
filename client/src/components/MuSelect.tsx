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
          color: rgba(255,255,255,0.90);
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

        /* ── 트리거 버튼 (Aurora 배경 위 글래스) ── */
        .mu-select__trigger--dark {
          background: rgba(255,255,255,0.22);
          border: 1.5px solid rgba(255,255,255,0.45);
          color: #ffffff;
        }
        .mu-select__trigger--dark:hover,
        .mu-select__trigger--dark.mu-select__trigger--open {
          background: rgba(255,255,255,0.32);
          border-color: rgba(255,255,255,0.70);
        }
        .mu-select__trigger--dark .mu-select__placeholder {
          color: rgba(255,255,255,0.65);
        }
        .mu-select__trigger--dark .mu-select__value {
          color: #ffffff;
        }
        .mu-select__trigger--dark .mu-select__chevron {
          color: rgba(255,255,255,0.80);
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

        /* ── 드롭다운 (Aurora 배경 위 글래스) ── */
        .mu-select__dropdown--dark {
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(107,95,255,0.20);
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        }

        .mu-select__dropdown::-webkit-scrollbar { width: 4px; }
        .mu-select__dropdown::-webkit-scrollbar-track { background: transparent; }
        .mu-select__dropdown::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.10);
          border-radius: 2px;
        }
        .mu-select__dropdown--dark::-webkit-scrollbar-thumb {
          background: rgba(107,95,255,0.20);
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

        /* ── 옵션 (Aurora 배경 위 글래스 드롭다운) ── */
        .mu-select__option--dark {
          color: var(--foreground-secondary);
        }
        .mu-select__option--dark:hover {
          background: rgba(107,95,255,0.08);
          color: var(--foreground);
        }
        .mu-select__option--dark.mu-select__option--selected {
          background: rgba(107,95,255,0.12);
          color: var(--primary);
        }

        .mu-select__option-label { flex: 1; }
        .mu-select__option-sub {
          font-size: 11px;
          color: #999891;
        }
        .mu-select__option-sub--dark {
          color: var(--foreground-tertiary);
        }
        .mu-select__option-check { color: #1a1a18; flex-shrink: 0; }
        .mu-select__option-check--dark { color: var(--primary); }
      `}</style>
    </div>
  );
}

/* ── 12간지 시간 옵션 (기존 운세 페이지와 동일한 기준) ── */
export const SIJU_OPTIONS: MuSelectOption[] = [
  { value: "unknown", label: "모름", sub: "시간을 모를 경우" },
  { value: "00:45",   label: "조자시", sub: "00:00~01:30" },
  { value: "02:30",   label: "축시",   sub: "01:31~03:30" },
  { value: "04:30",   label: "인시",   sub: "03:31~05:30" },
  { value: "06:30",   label: "묘시",   sub: "05:31~07:30" },
  { value: "08:30",   label: "진시",   sub: "07:31~09:30" },
  { value: "10:30",   label: "사시",   sub: "09:31~11:30" },
  { value: "12:30",   label: "오시",   sub: "11:31~13:30" },
  { value: "14:30",   label: "미시",   sub: "13:31~15:30" },
  { value: "16:30",   label: "신시",   sub: "15:31~17:30" },
  { value: "18:30",   label: "유시",   sub: "17:31~19:30" },
  { value: "20:30",   label: "술시",   sub: "19:31~21:30" },
  { value: "22:30",   label: "해시",   sub: "21:31~23:30" },
  { value: "23:45",   label: "야자시", sub: "23:31~24:00" },
];
