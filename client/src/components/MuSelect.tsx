import { useState, useRef, useEffect } from "react";
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
}

export function MuSelect({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  label,
  id,
}: MuSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // 드롭다운 열릴 때 트리거 위치 계산 → fixed 포지셔닝으로 stacking context 탈출
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [open]);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mu-select" ref={containerRef}>
      {label && (
        <label className="mu-select__label" htmlFor={id}>
          {label}
        </label>
      )}
      <button
        id={id}
        ref={triggerRef}
        type="button"
        className={`mu-select__trigger${open ? " mu-select__trigger--open" : ""}`}
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

      {open && (
        <ul
          className="mu-select__dropdown"
          role="listbox"
          aria-label={label}
          style={dropdownStyle}
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`mu-select__option${opt.value === value ? " mu-select__option--selected" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <span className="mu-select__option-label">{opt.label}</span>
              {opt.sub && <span className="mu-select__option-sub">{opt.sub}</span>}
              {opt.value === value && (
                <Check size={13} className="mu-select__option-check" />
              )}
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .mu-select {
          position: relative;
          width: 100%;
        }
        .mu-select__label {
          display: block;
          font-size: 12px;
          color: #5a5a56;
          margin-bottom: 6px;
          font-weight: 500;
        }
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
          font-family: 'Pretendard', sans-serif;
        }
        .mu-select__trigger:hover,
        .mu-select__trigger--open {
          border-color: rgba(0,0,0,0.30);
          background: #f5f4ef;
        }
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
        .mu-select__dropdown {
          position: fixed;
          z-index: 9999;
          background: #ffffff;
          border: 0.5px solid rgba(0,0,0,0.12);
          border-radius: 10px;
          padding: 4px;
          max-height: 220px;
          overflow-y: auto;
          list-style: none;
          margin: 0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
        }
        .mu-select__dropdown::-webkit-scrollbar {
          width: 4px;
        }
        .mu-select__dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .mu-select__dropdown::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.10);
          border-radius: 2px;
        }
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
        }
        .mu-select__option:hover {
          background: #f5f4ef;
          color: #1a1a18;
        }
        .mu-select__option--selected {
          background: rgba(0,0,0,0.05);
          color: #1a1a18;
        }
        .mu-select__option-label {
          flex: 1;
        }
        .mu-select__option-sub {
          font-size: 11px;
          color: #999891;
        }
        .mu-select__option-check {
          color: #1a1a18;
          flex-shrink: 0;
        }
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
