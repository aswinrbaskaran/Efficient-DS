import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Search, Eye, EyeOff, ChevronDown, Check, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';

function SH({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h2 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '3px' }}>{title}</h2>
      {desc && <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>{desc}</p>}
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>{label}</div>
      <div className="flex flex-wrap gap-4 items-start">{children}</div>
    </div>
  );
}
function Divider() { return <hr className="my-10" style={{ borderColor: 'var(--ada-border-default)' }} />; }

const inputBase: React.CSSProperties = { fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' };

/* ── OTP input ─────────────────────────────────────────────── */
function OTPInput({ length = 6 }: { length?: number }) {
  const [vals, setVals] = useState<string[]>(Array(length).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!vals[i] && i > 0) { refs.current[i - 1]?.focus(); }
      setVals(v => { const n = [...v]; n[i] = ''; return n; });
    }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
  };
  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const digit = val.slice(-1);
    setVals(v => { const n = [...v]; n[i] = digit; return n; });
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    setVals(Array(length).fill('').map((_, i) => text[i] || ''));
    refs.current[Math.min(text.length, length - 1)]?.focus();
    e.preventDefault();
  };
  return (
    <div className="flex gap-2" role="group" aria-label="One-time password input">
      {Array(length).fill(0).map((_, i) => (
        <span key={i} className="flex items-center">
          <input
            ref={el => refs.current[i] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={vals[i]}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKey(i, e)}
            onPaste={handlePaste}
            aria-label={`Digit ${i + 1} of ${length}`}
            className="rounded border text-center focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
            style={{ width: 40, height: 44, fontSize: 'var(--ada-fs-xl)', fontFamily: 'var(--ada-font-mono)', fontWeight: 'var(--ada-fw-semibold)', borderColor: vals[i] ? 'var(--ada-p-400)' : 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}
          />
          {length === 6 && i === 2 && <span style={{ marginLeft: 8, color: 'var(--ada-text-4)', fontSize: 'var(--ada-fs-lg)' }}>–</span>}
        </span>
      ))}
    </div>
  );
}

/* ── Calendar ──────────────────────────────────────────────── */
function CalendarPicker({ value, onChange }: { value: Date | null; onChange: (d: Date) => void }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { day: number; curr: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, curr: false });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, curr: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - firstDay - daysInMonth + 1, curr: false });

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const isSelected = (d: number) => value && d === value.getDate() && month === value.getMonth() && year === value.getFullYear();

  return (
    <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', width: 260, boxShadow: 'var(--ada-shadow-2)' }}>
      <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
        <button onClick={prevMonth} aria-label="Previous month" className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-3)' }}><ChevronLeft size={15} /></button>
        <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} aria-label="Next month" className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-3)' }}><ChevronRight size={15} /></button>
      </div>
      <div className="p-2">
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => <div key={d} className="text-center py-1" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)' }}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((cell, i) => (
            <button
              key={i}
              onClick={() => cell.curr && onChange(new Date(year, month, cell.day))}
              disabled={!cell.curr}
              className="rounded flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
              style={{ height: 32, fontSize: 'var(--ada-fs-xs)', fontWeight: isSelected(cell.day) && cell.curr ? 'var(--ada-fw-semibold)' : 'var(--ada-fw-regular)', backgroundColor: isSelected(cell.day) && cell.curr ? 'var(--ada-p-600)' : isToday(cell.day) && cell.curr ? 'var(--ada-p-100)' : 'transparent', color: !cell.curr ? 'var(--ada-text-4)' : isSelected(cell.day) ? 'white' : isToday(cell.day) ? 'var(--ada-p-700)' : 'var(--ada-text-1)', cursor: cell.curr ? 'pointer' : 'default' }}
            >{cell.day}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Combobox ──────────────────────────────────────────────── */
const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Coconut', 'Grape', 'Kiwi', 'Lemon', 'Lime', 'Mango', 'Orange', 'Peach', 'Pear', 'Pineapple', 'Plum', 'Raspberry', 'Strawberry'];
function Combobox() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [focused, setFocused] = useState(-1);
  const filtered = FRUITS.filter(f => f.toLowerCase().includes(query.toLowerCase()));
  const select = (v: string) => { setSelected(v); setQuery(v); setOpen(false); };
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(f + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
    if (e.key === 'Enter' && focused >= 0 && filtered[focused]) select(filtered[focused]);
    if (e.key === 'Escape') setOpen(false);
  };
  return (
    <div className="relative" style={{ width: 220 }}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setFocused(-1); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKey}
          placeholder="Search fruit…"
          aria-label="Select fruit"
          aria-autocomplete="list"
          aria-expanded={open}
          role="combobox"
          className="w-full rounded border px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
          style={inputBase}
        />
        {selected && query && (
          <button onClick={() => { setSelected(''); setQuery(''); }} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--ada-text-3)' }} aria-label="Clear"><X size={14} /></button>
        )}
        {!selected && <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ada-text-3)' }} />}
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute top-full mt-1 w-full rounded-lg border overflow-hidden z-50" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-3)', maxHeight: 200, overflowY: 'auto' }} role="listbox">
          {filtered.map((f, i) => (
            <div key={f} role="option" aria-selected={selected === f}
              onMouseDown={() => select(f)}
              onMouseEnter={() => setFocused(i)}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer"
              style={{ backgroundColor: i === focused ? 'var(--ada-p-50)' : 'transparent', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)' }}
            >
              {selected === f && <Check size={13} style={{ color: 'var(--ada-p-600)', flexShrink: 0 }} />}
              <span style={{ marginLeft: selected === f ? 0 : 21 }}>{f}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Custom Select ─────────────────────────────────────────── */
const ROLES = ['Administrator', 'Developer', 'Designer', 'Viewer', 'Support', 'Billing'];
function CustomSelect({ disabled = false }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState('');
  return (
    <div className="relative" style={{ width: 200 }}>
      <button
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full flex items-center justify-between rounded border px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
        style={{ fontSize: 'var(--ada-fs-sm)', backgroundColor: disabled ? 'var(--ada-disabled-bg)' : 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', color: val ? 'var(--ada-text-1)' : 'var(--ada-text-4)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{val || 'Select role…'}</span>
        <ChevronDown size={14} style={{ color: 'var(--ada-text-3)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 w-full rounded-lg border overflow-hidden z-50" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-3)' }} role="listbox">
          {ROLES.map(r => (
            <div key={r} role="option" aria-selected={val === r}
              onMouseDown={() => { setVal(r); setOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors"
              style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-p-50)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {val === r ? <Check size={13} style={{ color: 'var(--ada-p-600)' }} /> : <span style={{ width: 13 }} />}
              {r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FormsSection() {
  const [showPw, setShowPw] = useState(false);
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [radio, setRadio] = useState('opt1');
  const [switchOn, setSwitchOn] = useState(true);
  const [slider, setSlider] = useState(60);
  const [date, setDate] = useState<Date | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [showCal, setShowCal] = useState(false);

  const inputRow = (label: string, placeholder: string, state: 'default' | 'error' | 'disabled', helper?: string) => {
    const isErr = state === 'error', isDis = state === 'disabled';
    const [focused, setFocused] = useState(false);
    return (
      <div className="flex flex-col gap-1.5" style={{ width: 200 }}>
        <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: isDis ? 'var(--ada-text-disabled)' : 'var(--ada-text-2)' }}>{label}</label>
        <input placeholder={placeholder} disabled={isDis} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
          style={{ fontSize: 'var(--ada-fs-sm)', borderColor: isErr ? 'var(--ada-e-500)' : 'var(--ada-border-default)', backgroundColor: isDis ? 'var(--ada-disabled-bg)' : 'var(--ada-surface-1)', color: isDis ? 'var(--ada-text-disabled)' : 'var(--ada-text-1)' }}
        />
        {helper && <div style={{ fontSize: 'var(--ada-fs-xs)', color: isErr ? 'var(--ada-text-error)' : 'var(--ada-text-3)' }}>{helper}</div>}
      </div>
    );
  };

  return (
    <div>
      {/* ── INPUT ─────────────────────────────────────────── */}
      <SH title="Input" desc="Text input with all states: default, focus, error, disabled. Includes icon and password variants." />

      <Row label="States">
        {inputRow('Default', 'Placeholder text…', 'default')}
        {inputRow('Error', 'invalid@', 'error', 'Enter a valid email address.')}
        {inputRow('Disabled', 'Not editable', 'disabled')}
      </Row>

      <Row label="Specialized Types">
        <div className="flex flex-col gap-1.5" style={{ width: 200 }}>
          <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ada-text-3)' }} />
            <input type="search" placeholder="Search…" className="w-full rounded border pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]" style={inputBase} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5" style={{ width: 200 }}>
          <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Password</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} placeholder="••••••••" className="w-full rounded border px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]" style={inputBase} />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 focus:outline-none" style={{ color: 'var(--ada-text-3)' }} aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      </Row>

      <Divider />

      {/* ── INPUT GROUP ───────────────────────────────────── */}
      <SH title="Input Group" desc="Inputs with prefix/suffix text, icons, or action buttons for contextual data entry." />

      <Row label="Prefix & Suffix">
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>URL Prefix</label>
          <div className="flex rounded border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
            <div className="flex items-center px-2.5 border-r" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)', whiteSpace: 'nowrap' }}>https://</div>
            <input placeholder="myapp.io/path" className="flex-1 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>With Button Suffix</label>
          <div className="flex rounded border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
            <input placeholder="Enter invite email…" className="flex-1 px-3 py-2 focus:outline-none" style={{ fontSize: 'var(--ada-fs-sm)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)', minWidth: 160 }} />
            <button className="px-3 border-l transition-colors focus:outline-none" style={{ backgroundColor: 'var(--ada-p-600)', borderColor: 'var(--ada-border-default)', color: 'white', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', whiteSpace: 'nowrap' }}>Invite</button>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Currency</label>
          <div className="flex rounded border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
            <div className="flex items-center px-2.5 border-r" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>$</div>
            <input type="number" placeholder="0.00" className="flex-1 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)', width: 100 }} />
            <div className="flex items-center px-2.5 border-l" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>USD</div>
          </div>
        </div>
      </Row>

      <Divider />

      {/* ── TEXTAREA ─────────────────────────────────────── */}
      <SH title="Textarea" desc="Multi-line text input with resize, character count, and error state." />

      <Row label="States">
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Default</label>
          <textarea rows={3} placeholder="Write something…" onChange={e => setCharCount(e.target.value.length)} className="rounded border px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]" style={{ ...inputBase, width: 260 }} />
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', textAlign: 'right' }}>{charCount} / 500</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-error)' }}>Error <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-e-500)' }}>*</span></label>
          <textarea rows={3} defaultValue="Text that exceeds the maximum length limit for this field." className="rounded border px-3 py-2 resize-none focus:outline-none" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-e-500)', backgroundColor: 'var(--ada-bg-error)', color: 'var(--ada-text-1)', width: 260 }} />
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-error)' }}>Exceeds maximum 500 characters.</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-disabled)' }}>Disabled</label>
          <textarea rows={3} disabled value="This content is read-only." className="rounded border px-3 py-2 resize-none" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-disabled-bg)', color: 'var(--ada-text-disabled)', width: 260, cursor: 'not-allowed' }} />
        </div>
      </Row>

      <Divider />

      {/* ── FIELD WRAPPER ─────────────────────────────────── */}
      <SH title="Field Wrapper" desc="Complete form field pattern: label + input + helper text + error message." />

      <Row label="Examples">
        {[
          { label: 'Username', helper: 'Must be 3–20 characters. Only letters, numbers, underscores.', error: '', placeholder: 'john_doe' },
          { label: 'Email address', helper: '', error: 'This email is already registered.', placeholder: 'duplicate@example.com' },
        ].map(f => (
          <div key={f.label} className="flex flex-col gap-1.5" style={{ width: 260 }}>
            <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: f.error ? 'var(--ada-text-error)' : 'var(--ada-text-2)' }}>
              {f.label} <span style={{ color: 'var(--ada-e-500)' }}>*</span>
            </label>
            <input placeholder={f.placeholder} className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: f.error ? 'var(--ada-e-500)' : 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }} />
            {f.helper && <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', lineHeight: 1.4 }}>{f.helper}</div>}
            {f.error && <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-error)' }}>{f.error}</div>}
          </div>
        ))}
      </Row>

      <Divider />

      {/* ── CHECKBOX ─────────────────────────────────────── */}
      <SH title="Checkbox" desc="Boolean selection with checked, unchecked, indeterminate, and disabled states." />

      <Row label="All States">
        {[
          { label: 'Checked', chk: true, dis: false, ind: false },
          { label: 'Unchecked', chk: false, dis: false, ind: false },
          { label: 'Indeterminate', chk: false, dis: false, ind: true },
          { label: 'Disabled On', chk: true, dis: true, ind: false },
          { label: 'Disabled Off', chk: false, dis: true, ind: false },
        ].map(c => (
          <label key={c.label} className="flex items-center gap-2 select-none" style={{ cursor: c.dis ? 'not-allowed' : 'pointer', opacity: c.dis ? 0.5 : 1 }}>
            <div className="flex items-center justify-center rounded" style={{ width: 16, height: 16, flexShrink: 0, backgroundColor: c.chk || c.ind ? 'var(--ada-p-600)' : 'var(--ada-surface-1)', border: `2px solid ${c.chk || c.ind ? 'var(--ada-p-600)' : 'var(--ada-border-strong)'}` }}>
              {c.chk && <Check size={10} color="white" strokeWidth={3} />}
              {c.ind && <div style={{ width: 8, height: 2, backgroundColor: 'white', borderRadius: 1 }} />}
            </div>
            <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)' }}>{c.label}</span>
          </label>
        ))}
        <label className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setChecked(!checked)}>
          <div className="flex items-center justify-center rounded focus-within:ring-2 focus-within:ring-[var(--ada-focus-ring)]" style={{ width: 16, height: 16, flexShrink: 0, backgroundColor: checked ? 'var(--ada-p-600)' : 'var(--ada-surface-1)', border: `2px solid ${checked ? 'var(--ada-p-600)' : 'var(--ada-border-strong)'}` }}>
            {checked && <Check size={10} color="white" strokeWidth={3} />}
          </div>
          <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)' }}>Interactive</span>
        </label>
      </Row>

      <Divider />

      {/* ── RADIO GROUP ───────────────────────────────────── */}
      <SH title="Radio Group" desc="Single-selection from a mutually exclusive set of options." />

      <Row label="Vertical (Default)">
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Notification frequency">
          {[['opt1', 'Immediately', 'Get notified as events happen'], ['opt2', 'Hourly digest', 'Batch notifications every hour'], ['opt3', 'Daily summary', 'One email per day']].map(([v, label, desc]) => (
            <label key={v} className="flex items-start gap-2.5 cursor-pointer" onClick={() => setRadio(v)}>
              <div className="flex items-center justify-center rounded-full mt-0.5 flex-shrink-0" style={{ width: 16, height: 16, border: `2px solid ${radio === v ? 'var(--ada-p-600)' : 'var(--ada-border-strong)'}`, backgroundColor: 'var(--ada-surface-1)' }}>
                {radio === v && <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--ada-p-600)' }} />}
              </div>
              <div>
                <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{label}</div>
                <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{desc}</div>
              </div>
            </label>
          ))}
        </div>
        <div className="flex gap-4 ml-8" role="radiogroup" aria-label="Plan">
          {[['free', 'Free'], ['pro', 'Pro'], ['enterprise', 'Enterprise']].map(([v, l]) => (
            <label key={v} className="flex items-center gap-2 cursor-pointer" onClick={() => setRadio(v)}>
              <div className="flex items-center justify-center rounded-full" style={{ width: 16, height: 16, border: `2px solid ${radio === v ? 'var(--ada-p-600)' : 'var(--ada-border-strong)'}`, backgroundColor: 'var(--ada-surface-1)' }}>
                {radio === v && <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--ada-p-600)' }} />}
              </div>
              <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)' }}>{l}</span>
            </label>
          ))}
        </div>
      </Row>

      <Divider />

      {/* ── SWITCH ───────────────────────────────────────── */}
      <SH title="Switch" desc="Toggle switch for binary on/off settings. Uses role='switch' and aria-checked." />

      <Row label="All States">
        {[
          { label: 'Enabled On', on: true, dis: false },
          { label: 'Enabled Off', on: false, dis: false },
          { label: 'Disabled On', on: true, dis: true },
          { label: 'Disabled Off', on: false, dis: true },
        ].map(s => (
          <label key={s.label} className="flex items-center gap-2.5 select-none" style={{ opacity: s.dis ? 0.5 : 1, cursor: s.dis ? 'not-allowed' : 'pointer' }}>
            <div className="relative rounded-full flex-shrink-0" style={{ width: 40, height: 22, backgroundColor: s.on ? 'var(--ada-p-600)' : 'var(--ada-n-300)' }}>
              <div className="absolute top-1 rounded-full bg-white shadow-sm" style={{ width: 14, height: 14, left: s.on ? 23 : 3, transition: 'left 0.15s' }} />
            </div>
            <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)' }}>{s.label}</span>
          </label>
        ))}
        <button
          role="switch"
          aria-checked={switchOn}
          onClick={() => setSwitchOn(!switchOn)}
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] focus-visible:ring-offset-2 rounded"
        >
          <div className="relative rounded-full flex-shrink-0 transition-colors" style={{ width: 40, height: 22, backgroundColor: switchOn ? 'var(--ada-p-600)' : 'var(--ada-n-300)' }}>
            <div className="absolute top-1 rounded-full bg-white shadow-sm transition-all duration-150" style={{ width: 14, height: 14, left: switchOn ? 23 : 3 }} />
          </div>
          <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)' }}>Interactive</span>
        </button>
      </Row>

      <Divider />

      {/* ── SLIDER ───────────────────────────────────────── */}
      <SH title="Slider" desc="Range input for selecting a numeric value within a bounded range." />

      <Row label="Variants">
        <div className="flex flex-col gap-1.5" style={{ width: 280 }}>
          <div className="flex items-center justify-between">
            <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Volume</label>
            <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-3)' }}>{slider}%</span>
          </div>
          <input type="range" min={0} max={100} value={slider} onChange={e => setSlider(Number(e.target.value))} className="w-full accent-blue-600" style={{ height: 4 }} aria-label="Volume" />
        </div>
        <div className="flex flex-col gap-1.5" style={{ width: 280 }}>
          <div className="flex items-center justify-between">
            <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Opacity</label>
            <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-3)' }}>75%</span>
          </div>
          <input type="range" min={0} max={100} defaultValue={75} disabled className="w-full opacity-50" aria-label="Opacity (disabled)" />
          <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>Disabled state</span>
        </div>
      </Row>

      <Divider />

      {/* ── SELECT ───────────────────────────────────────── */}
      <SH title="Native Select & Custom Select" desc="HTML select element and custom-built accessible dropdown." />

      <Row label="Native Select">
        {['Default', 'Disabled'].map((label, i) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: i === 1 ? 'var(--ada-text-disabled)' : 'var(--ada-text-2)' }}>{label}</label>
            <div className="relative" style={{ width: 180 }}>
              <select disabled={i === 1} className="w-full appearance-none rounded border px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: i === 1 ? 'var(--ada-disabled-bg)' : 'var(--ada-surface-1)', color: i === 1 ? 'var(--ada-text-disabled)' : 'var(--ada-text-1)', cursor: i === 1 ? 'not-allowed' : 'pointer' }}>
                <option>Select option…</option>
                <option>Admin</option>
                <option>Developer</option>
                <option>Viewer</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ada-text-3)' }} />
            </div>
          </div>
        ))}
      </Row>

      <Row label="Custom Select">
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Default</label>
          <CustomSelect />
        </div>
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-disabled)' }}>Disabled</label>
          <CustomSelect disabled />
        </div>
      </Row>

      <Divider />

      {/* ── COMBOBOX ─────────────────────────────────────── */}
      <SH title="Combobox" desc="Searchable select with live filtering. Supports keyboard navigation (↑↓ Enter Esc)." />

      <Row label="Searchable Dropdown">
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Select Fruit</label>
          <Combobox />
        </div>
      </Row>

      <Divider />

      {/* ── INPUT OTP ────────────────────────────────────── */}
      <SH title="Input OTP" desc="One-time password input with auto-advance, backspace navigation, and paste support." />

      <Row label="6-digit OTP">
        <div className="flex flex-col gap-3">
          <OTPInput length={6} />
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Enter each digit or paste the full code</div>
        </div>
      </Row>

      <Row label="4-digit PIN">
        <OTPInput length={4} />
      </Row>

      <Divider />

      {/* ── CALENDAR ─────────────────────────────────────── */}
      <SH title="Calendar" desc="Month-view date picker with keyboard-accessible day navigation." />

      <Row label="Month View">
        <CalendarPicker value={date} onChange={setDate} />
        {date && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)' }}>
            Selected: <strong style={{ color: 'var(--ada-text-1)' }}>{date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</strong>
          </div>
        )}
      </Row>

      <Divider />

      {/* ── DATE PICKER ──────────────────────────────────── */}
      <SH title="Date Picker" desc="Text input combined with calendar popover for date selection." />

      <Row label="Input + Calendar">
        <div className="flex flex-col gap-1.5">
          <label style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Date</label>
          <div className="relative" style={{ width: 220 }}>
            <input
              readOnly
              value={date ? date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : ''}
              placeholder="MM/DD/YYYY"
              onClick={() => setShowCal(!showCal)}
              className="w-full rounded border px-3 py-2 pr-9 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]"
              style={inputBase}
              aria-haspopup="dialog"
            />
            <Calendar size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--ada-text-3)' }} />
            {showCal && (
              <div className="absolute top-full mt-1 left-0 z-50">
                <CalendarPicker value={date} onChange={d => { setDate(d); setShowCal(false); }} />
              </div>
            )}
          </div>
        </div>
      </Row>

      <div className="h-8" />
    </div>
  );
}
