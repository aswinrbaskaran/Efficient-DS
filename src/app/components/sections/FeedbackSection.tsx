import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X, Bell, Check } from 'lucide-react';

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
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
function Divider() { return <hr className="my-10" style={{ borderColor: 'var(--ada-border-default)' }} />; }

/* ── Alert component ───────────────────────────────────────── */
function Alert({ variant = 'info', title, children, dismissible = false }: {
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string; children: React.ReactNode; dismissible?: boolean;
}) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const cfg: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
    success: { bg: 'var(--ada-bg-success)', border: 'var(--ada-border-success)', text: 'var(--ada-text-success)', icon: <CheckCircle size={15} /> },
    warning: { bg: 'var(--ada-bg-warning)', border: 'var(--ada-border-warning)', text: 'var(--ada-text-warning)', icon: <AlertTriangle size={15} /> },
    error: { bg: 'var(--ada-bg-error)', border: 'var(--ada-border-error)', text: 'var(--ada-text-error)', icon: <AlertCircle size={15} /> },
    info: { bg: 'var(--ada-bg-info)', border: 'var(--ada-border-info)', text: 'var(--ada-text-info)', icon: <Info size={15} /> },
  };
  const c = cfg[variant];
  return (
    <div className="flex gap-3 p-4 rounded-lg border" style={{ backgroundColor: c.bg, borderColor: c.border }} role="alert">
      <span style={{ color: c.text, flexShrink: 0, marginTop: '1px' }}>{c.icon}</span>
      <div className="flex-1 min-w-0">
        {title && <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: c.text, marginBottom: '3px' }}>{title}</div>}
        <div style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', lineHeight: 1.5 }}>{children}</div>
      </div>
      {dismissible && (
        <button onClick={() => setVisible(false)} className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] rounded" style={{ color: c.text, opacity: 0.7 }} aria-label="Dismiss alert">
          <X size={15} />
        </button>
      )}
    </div>
  );
}

/* ── Toast system ──────────────────────────────────────────── */
type ToastItem = { id: number; variant: 'success' | 'warning' | 'error' | 'info'; title: string; message: string };
let toastId = 0;

function ToastItem({ toast, onRemove }: { toast: ToastItem; onRemove: () => void }) {
  const cfg: Record<string, { icon: React.ReactNode; accent: string }> = {
    success: { icon: <CheckCircle size={16} />, accent: 'var(--ada-s-600)' },
    warning: { icon: <AlertTriangle size={16} />, accent: 'var(--ada-w-600)' },
    error: { icon: <AlertCircle size={16} />, accent: 'var(--ada-e-600)' },
    info: { icon: <Info size={16} />, accent: 'var(--ada-p-600)' },
  };
  const { icon, accent } = cfg[toast.variant];
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-4)', minWidth: 320, maxWidth: 380, pointerEvents: 'all' }} role="status" aria-live="polite">
      <div style={{ flexShrink: 0, marginTop: '1px', color: accent }}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '2px' }}>{toast.title}</div>
        <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', lineHeight: 1.4 }}>{toast.message}</div>
      </div>
      <button onClick={onRemove} className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] rounded" style={{ color: 'var(--ada-text-4)' }} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}

function ToastSystem() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const add = useCallback((variant: ToastItem['variant'], title: string, message: string) => {
    const id = ++toastId;
    setToasts(t => [...t, { id, variant, title, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  const remove = useCallback((id: number) => setToasts(t => t.filter(x => x.id !== id)), []);

  const examples: [ToastItem['variant'], string, string, string][] = [
    ['success', 'Success', 'File uploaded', 'document.pdf was saved successfully.'],
    ['info', 'Info', 'Update available', 'A new version is ready to install.'],
    ['warning', 'Warning', 'Storage limit', 'You\'re using 90% of your storage.'],
    ['error', 'Error', 'Connection failed', 'Unable to reach the server. Retrying…'],
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {examples.map(([v, label, title, msg]) => (
          <button key={v} onClick={() => add(v, title, msg)}
            className="px-3 py-2 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-1)')}>
            {label} Toast
          </button>
        ))}
      </div>
      {/* Toast stack rendered inline below buttons for demo */}
      {toasts.length > 0 && (
        <div className="flex flex-col gap-2" aria-live="polite" aria-label="Notifications">
          {toasts.map(t => <ToastItem key={t.id} toast={t} onRemove={() => remove(t.id)} />)}
        </div>
      )}
    </div>
  );
}

/* ── Sonner-style notification ─────────────────────────────── */
type SonnerItem = { id: number; type: 'default' | 'success' | 'error' | 'promise'; title: string; desc?: string; loading?: boolean; done?: boolean };
let sonnerId = 0;

function SonnerSystem() {
  const [items, setItems] = useState<SonnerItem[]>([]);

  const push = (type: SonnerItem['type'], title: string, desc?: string) => {
    const id = ++sonnerId;
    setItems(t => [{ id, type, title, desc }, ...t].slice(0, 5));
    setTimeout(() => setItems(t => t.filter(x => x.id !== id)), 5000);
  };

  const pushPromise = () => {
    const id = ++sonnerId;
    setItems(t => [{ id, type: 'promise', title: 'Deploying to production…', loading: true }, ...t].slice(0, 5));
    setTimeout(() => {
      setItems(t => t.map(x => x.id === id ? { ...x, title: 'Deployment successful', loading: false, done: true, type: 'success' } : x));
      setTimeout(() => setItems(t => t.filter(x => x.id !== id)), 3000);
    }, 2500);
  };

  const dismiss = (id: number) => setItems(t => t.filter(x => x.id !== id));

  const iconFor = (item: SonnerItem) => {
    if (item.loading) return <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--ada-p-400)', borderTopColor: 'transparent' }} />;
    if (item.type === 'success' || item.done) return <Check size={14} style={{ color: 'var(--ada-s-600)' }} />;
    if (item.type === 'error') return <AlertCircle size={14} style={{ color: 'var(--ada-e-600)' }} />;
    return <Bell size={14} style={{ color: 'var(--ada-text-3)' }} />;
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: 'Default', fn: () => push('default', 'Event logged', 'Session ID #4821 was recorded.') },
          { label: 'Success', fn: () => push('success', 'Changes saved', 'Your profile was updated.') },
          { label: 'Error', fn: () => push('error', 'Sync failed', 'Could not reach the API endpoint.') },
          { label: 'Promise', fn: pushPromise },
        ].map(({ label, fn }) => (
          <button key={label} onClick={fn}
            className="px-3 py-2 rounded border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
            style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-1)')}>
            {label}
          </button>
        ))}
      </div>

      {/* Preview stack */}
      {items.length > 0 && (
        <div className="flex flex-col gap-2" aria-live="polite">
          {items.map((item, idx) => (
            <div key={item.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{
                backgroundColor: 'var(--ada-surface-1)',
                borderColor: 'var(--ada-border-default)',
                boxShadow: 'var(--ada-shadow-3)',
                transform: `scale(${1 - idx * 0.02})`,
                opacity: 1 - idx * 0.1,
                transition: 'all 0.2s ease',
                maxWidth: 380,
              }}
              role="status"
            >
              <div className="flex-shrink-0">{iconFor(item)}</div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{item.title}</div>
                {item.desc && <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginTop: '1px' }}>{item.desc}</div>}
              </div>
              <button onClick={() => dismiss(item.id)} className="flex-shrink-0 focus:outline-none rounded" style={{ color: 'var(--ada-text-4)' }} aria-label="Dismiss">
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FeedbackSection() {
  return (
    <div>
      {/* ── ALERT ─────────────────────────────────────────── */}
      <SH title="Alert" desc="Inline feedback message for system states. Four semantic variants with optional dismiss." />

      <Row label="Without Title">
        <Alert variant="info">Connect your repository to enable continuous deployment and automatic builds.</Alert>
        <Alert variant="success">Your API key was generated successfully. Copy it now — it won't be shown again.</Alert>
        <Alert variant="warning">Your trial expires in 3 days. Upgrade to keep access to all features.</Alert>
        <Alert variant="error">Failed to save changes. Please check your connection and try again.</Alert>
      </Row>

      <Row label="With Title">
        <Alert variant="info" title="New feature available">The redesigned command palette is now live. Press ⌘K anywhere to access it.</Alert>
        <Alert variant="success" title="Deployment successful">Production build v2.4.1 was deployed in 42 seconds with zero downtime.</Alert>
        <Alert variant="warning" title="Degraded performance">CDN edge latency is elevated. Median response time is 142ms (normal: 12ms).</Alert>
        <Alert variant="error" title="Authentication error">Your session has expired. Please sign in again to continue.</Alert>
      </Row>

      <Row label="Dismissible">
        <Alert variant="info" dismissible title="System maintenance">Scheduled maintenance on March 5 from 2–4 AM UTC. Some features may be unavailable.</Alert>
        <Alert variant="warning" dismissible>Storage is at 90% capacity. Delete unused artifacts or upgrade your plan.</Alert>
      </Row>

      <Divider />

      {/* ── TOAST ─────────────────────────────────────────── */}
      <SH title="Toast" desc="Transient notification that auto-dismisses after 4 seconds. Click to trigger." />
      <ToastSystem />

      <Divider />

      {/* ── SONNER-STYLE ──────────────────────────────────── */}
      <SH title="Sonner-style Notifications" desc="Elegant stacked notification system with promise support, auto-dismiss, and subtle scale effect." />
      <SonnerSystem />

      <div className="h-8" />
    </div>
  );
}
