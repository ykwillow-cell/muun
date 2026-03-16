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
          color: rgba(255,255,255,0.45);
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
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          font-size: 14px;
          color: white;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          font-family: 'Pretendard', sans-serif;
        }
        .mu-select__trigger:hover,
        .mu-select__trigger--open {
          border-color: oklch(0.85 0.18 85 / 0.4);
          background: rgba(255,255,255,0.07);
        }
        .mu-select__placeholder {
          color: rgba(255,255,255,0.25);
        }
        .mu-select__value {
          color: white;
        }
        .mu-select__chevron {
          color: rgba(255,255,255,0.35);
          transition: transform 0.18s;
          flex-shrink: 0;
        }
        .mu-select__chevron--open {
          transform: rotate(180deg);
        }
        .mu-select__dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          z-index: 100;
          background: oklch(0.18 0.04 265);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          padding: 4px;
          max-height: 220px;
          overflow-y: auto;
          list-style: none;
          margin: 0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .mu-select__dropdown::-webkit-scrollbar {
          width: 4px;
        }
        .mu-select__dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .mu-select__dropdown::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.12);
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
          color: rgba(255,255,255,0.75);
          min-height: 36px;
        }
        .mu-select__option:hover {
          background: rgba(255,255,255,0.06);
          color: white;
        }
        .mu-select__option--selected {
          background: oklch(0.85 0.18 85 / 0.12);
          color: oklch(0.85 0.18 85);
        }
        .mu-select__option-label {
          flex: 1;
        }
        .mu-select__option-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
        }
        .mu-select__option-check {
          color: oklch(0.85 0.18 85);
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
