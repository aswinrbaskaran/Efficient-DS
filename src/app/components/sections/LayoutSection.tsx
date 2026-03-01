import { useState, useRef, useEffect } from 'react';
import { GripVertical, ChevronRight, Edit, Trash2, MoreHorizontal, Plus } from 'lucide-react';

function SH({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h2 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '3px' }}>{title}</h2>
      {desc && <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>{desc}</p>}
    </div>
  );
}
function Divider() { return <hr className="my-10" style={{ borderColor: 'var(--ada-border-default)' }} />; }

/* ── Resizable Panels ──────────────────────────────────────── */
function ResizablePanels({ direction = 'horizontal' }: { direction?: 'horizontal' | 'vertical' }) {
  const [split, setSplit] = useState(50);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = direction === 'horizontal'
        ? Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 15), 85)
        : Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 20), 80);
      setSplit(pct);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [direction]);

  const isH = direction === 'horizontal';
  return (
    <div ref={containerRef} className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)', height: isH ? 200 : 280, display: 'flex', flexDirection: isH ? 'row' : 'column', userSelect: 'none' }}>
      {/* Panel 1 */}
      <div className="flex items-center justify-center overflow-hidden" style={{ [isH ? 'width' : 'height']: `${split}%`, backgroundColor: 'var(--ada-surface-2)' }}>
        <div className="text-center p-4">
          <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>Panel A</div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>{split.toFixed(1)}%</div>
        </div>
      </div>

      {/* Drag handle */}
      <div
        onMouseDown={() => { dragging.current = true; }}
        className="flex items-center justify-center transition-colors"
        style={{
          [isH ? 'width' : 'height']: 5,
          flexShrink: 0,
          backgroundColor: 'var(--ada-border-default)',
          cursor: isH ? 'col-resize' : 'row-resize',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-p-400)')}
        onMouseLeave={e => { if (!dragging.current) e.currentTarget.style.backgroundColor = 'var(--ada-border-default)'; }}
        role="separator"
        aria-orientation={isH ? 'vertical' : 'horizontal'}
        aria-valuenow={split}
        aria-valuemin={15}
        aria-valuemax={85}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setSplit(s => Math.min(s + 5, 85));
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setSplit(s => Math.max(s - 5, 15));
        }}
      >
        {isH ? <GripVertical size={12} style={{ color: 'var(--ada-text-4)', pointerEvents: 'none' }} /> : <div style={{ width: 20, height: 4, borderRadius: 2, backgroundColor: 'var(--ada-text-4)' }} />}
      </div>

      {/* Panel 2 */}
      <div className="flex items-center justify-center flex-1 overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)' }}>
        <div className="text-center p-4">
          <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>Panel B</div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>{(100 - split).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}

/* ── IDE-style 3-pane ──────────────────────────────────────── */
function ThreePaneLayout() {
  const [leftW, setLeftW] = useState(20);
  const [rightW, setRightW] = useState(25);
  const leftDrag = useRef(false);
  const rightDrag = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      if (leftDrag.current) setLeftW(Math.min(Math.max(pct, 10), 35));
      if (rightDrag.current) setRightW(Math.min(Math.max(100 - pct, 10), 40));
    };
    const onUp = () => { leftDrag.current = false; rightDrag.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  return (
    <div ref={containerRef} className="rounded-lg border overflow-hidden flex" style={{ height: 220, borderColor: 'var(--ada-border-default)', userSelect: 'none' }}>
      {/* File Explorer */}
      <div style={{ width: `${leftW}%`, backgroundColor: 'var(--ada-surface-2)', borderRight: '1px solid var(--ada-border-default)', overflow: 'hidden', minWidth: 0 }}>
        <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Explorer</span>
        </div>
        <div className="p-2 space-y-0.5">
          {['src/', '  app/', '    App.tsx', '    routes.ts', '  styles/', 'package.json'].map((f, i) => (
            <div key={f} className="px-2 py-1 rounded text-xs truncate" style={{ fontSize: 'var(--ada-fs-xs)', color: f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.json') ? 'var(--ada-text-1)' : 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)', cursor: 'pointer' }}>{f}</div>
          ))}
        </div>
      </div>

      {/* Left handle */}
      <div onMouseDown={() => { leftDrag.current = true; }}
        style={{ width: 4, flexShrink: 0, backgroundColor: 'var(--ada-border-default)', cursor: 'col-resize' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-p-400)')}
        onMouseLeave={e => { if (!leftDrag.current) e.currentTarget.style.backgroundColor = 'var(--ada-border-default)'; }} />

      {/* Editor */}
      <div className="flex-1 overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', minWidth: 0 }}>
        <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
          <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)', fontFamily: 'var(--ada-font-mono)' }}>App.tsx</span>
        </div>
        <div className="p-3 overflow-auto h-full">
          <pre style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-2)', lineHeight: 1.6, margin: 0 }}>{`import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}`}</pre>
        </div>
      </div>

      {/* Right handle */}
      <div onMouseDown={() => { rightDrag.current = true; }}
        style={{ width: 4, flexShrink: 0, backgroundColor: 'var(--ada-border-default)', cursor: 'col-resize' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-p-400)')}
        onMouseLeave={e => { if (!rightDrag.current) e.currentTarget.style.backgroundColor = 'var(--ada-border-default)'; }} />

      {/* Right panel */}
      <div style={{ width: `${rightW}%`, backgroundColor: 'var(--ada-surface-2)', borderLeft: '1px solid var(--ada-border-default)', overflow: 'hidden', minWidth: 0 }}>
        <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Output</span>
        </div>
        <div className="p-2">
          <div style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-s-400)', lineHeight: 1.6 }}>
            ✓ Build complete<br />✓ 0 errors<br />⚡ 42ms
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Direction Wrapper ─────────────────────────────────────── */
function DirectionWrapper() {
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Text direction:</span>
        {(['ltr', 'rtl'] as const).map(d => (
          <button key={d} onClick={() => setDir(d)}
            className="px-3 py-1.5 rounded border uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', borderColor: dir === d ? 'var(--ada-p-400)' : 'var(--ada-border-default)', backgroundColor: dir === d ? 'var(--ada-p-100)' : 'var(--ada-surface-1)', color: dir === d ? 'var(--ada-p-700)' : 'var(--ada-text-2)', letterSpacing: '0.06em' }}>
            {d}
          </button>
        ))}
      </div>
      <div dir={dir} className="rounded-lg border p-4 space-y-3" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ada-p-100)' }}>
            <span style={{ fontSize: '11px', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-p-700)' }}>SC</span>
          </div>
          <div>
            <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Sarah Chen</div>
            <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Administrator · Platform Engineering</div>
          </div>
          <button className="ms-auto flex items-center gap-1 px-3 py-1.5 rounded border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-2)' }}>
            <ChevronRight size={12} style={{ transform: dir === 'rtl' ? 'rotate(180deg)' : 'none' }} /> Details
          </button>
        </div>
        <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', lineHeight: 1.6 }}>
          {dir === 'ltr'
            ? 'This content flows left-to-right. All layout, margins, padding, and icon directions adapt automatically using logical CSS properties (ms-auto, ps-3, etc.).'
            : 'هذا المحتوى يتدفق من اليمين إلى اليسار. يتكيف التخطيط والهوامش والحشو تلقائيًا باستخدام خصائص CSS المنطقية.'}
        </p>
        <div className="flex items-center gap-2">
          <input placeholder={dir === 'rtl' ? 'ابحث هنا...' : 'Search here...'} className="flex-1 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }} />
          <button className="px-3 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-sm)', backgroundColor: 'var(--ada-p-600)', color: 'white', fontWeight: 'var(--ada-fw-medium)' }}>{dir === 'rtl' ? 'بحث' : 'Search'}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Item List Pattern ─────────────────────────────────────── */
const ITEMS = [
  { id: 1, title: 'Enterprise API Suite', sub: 'Production · api.acme.com', status: 'operational', badge: 'v3.2.1' },
  { id: 2, title: 'Auth Service', sub: 'Production · auth.acme.com', status: 'operational', badge: 'v1.8.0' },
  { id: 3, title: 'CDN Edge Network', sub: 'Degraded · cdn.acme.com', status: 'degraded', badge: 'v2.0.4' },
  { id: 4, title: 'Worker Queue', sub: 'Production · queue.acme.com', status: 'operational', badge: 'v0.9.2' },
  { id: 5, title: 'Legacy SDK v2', sub: 'Deprecated · sdk.acme.com/v2', status: 'deprecated', badge: 'v2.8.1' },
];

function ItemList() {
  const [items, setItems] = useState(ITEMS);
  const remove = (id: number) => setItems(it => it.filter(x => x.id !== id));
  const statusColor: Record<string, string> = { operational: 'var(--ada-s-500)', degraded: 'var(--ada-w-500)', deprecated: 'var(--ada-n-400)' };

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
        <h3 style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Services</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: 'var(--ada-p-600)', color: 'white' }}>
          <Plus size={13} /> Add service
        </button>
      </div>
      {items.length === 0 && (
        <div className="py-12 text-center" style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-4)' }}>No services. Add one to get started.</div>
      )}
      {items.map((item, i) => (
        <div key={item.id}
          className="flex items-center gap-3 px-4 py-3 transition-colors group"
          style={{ borderBottom: i < items.length - 1 ? '1px solid var(--ada-border-subtle)' : 'none', backgroundColor: 'var(--ada-surface-1)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-1)')}>
          {/* Status dot */}
          <span className="flex-shrink-0" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: statusColor[item.status], display: 'inline-block', boxShadow: item.status === 'operational' ? `0 0 0 3px ${statusColor[item.status]}22` : 'none' }} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{item.title}</span>
              <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 'var(--ada-fs-2xs)', fontFamily: 'var(--ada-font-mono)', backgroundColor: 'var(--ada-surface-3)', color: 'var(--ada-text-3)' }}>{item.badge}</span>
            </div>
            <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)', marginTop: '2px' }}>{item.sub}</div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-3)' }} aria-label={`Edit ${item.title}`}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-3)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              <Edit size={13} />
            </button>
            <button onClick={() => remove(item.id)} className="p-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-e-500)' }} aria-label={`Delete ${item.title}`}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-e-50)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              <Trash2 size={13} />
            </button>
            <button className="p-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]" style={{ color: 'var(--ada-text-3)' }} aria-label={`More options for ${item.title}`}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-3)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              <MoreHorizontal size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LayoutSection() {
  return (
    <div>
      {/* ── RESIZABLE PANELS ─────────────────────────────── */}
      <SH title="Resizable Panels" desc="Drag the divider to resize panels. Keyboard-accessible (Tab to focus handle, arrow keys to resize)." />
      <div className="mb-6 space-y-4">
        <div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Horizontal Split</div>
          <ResizablePanels direction="horizontal" />
        </div>
        <div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Vertical Split</div>
          <ResizablePanels direction="vertical" />
        </div>
        <div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>3-Pane IDE Layout</div>
          <ThreePaneLayout />
        </div>
      </div>

      <Divider />

      {/* ── DIRECTION WRAPPER ────────────────────────────── */}
      <SH title="Direction Wrapper" desc="RTL/LTR layout switch using the HTML dir attribute and CSS logical properties. Useful for i18n." />
      <div className="mb-6">
        <DirectionWrapper />
      </div>

      <Divider />

      {/* ── ITEM LIST PATTERN ────────────────────────────── */}
      <SH title="Item List Pattern" desc="Recurring pattern for entity lists with status indicators, metadata, and inline CRUD actions revealed on hover." />
      <div className="mb-6">
        <ItemList />
      </div>

      <div className="h-8" />
    </div>
  );
}
