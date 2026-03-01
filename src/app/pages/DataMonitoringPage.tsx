import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  AlertTriangle, XCircle, Info, CheckCircle, RefreshCw,
  Filter, Download, Search, Clock, Cpu, Database, Globe,
  Activity, ChevronDown, X, Bell, Zap,
} from 'lucide-react';

const generateMetrics = () => Array.from({ length: 20 }, (_, i) => ({
  t: `${String(Math.floor(i * 3)).padStart(2, '0')}:00`,
  cpu: 20 + Math.random() * 60,
  mem: 40 + Math.random() * 40,
  rps: 800 + Math.random() * 1200,
  latency: 20 + Math.random() * 80,
  errors: Math.floor(Math.random() * 8),
}));

const alerts = [
  { id: 1, severity: 'critical', title: 'CPU spike on worker-node-03', message: 'CPU utilisation exceeded 95% for > 5 minutes. Auto-scaling triggered.', time: '2 min ago', status: 'firing' },
  { id: 2, severity: 'warning', title: 'Memory pressure on db-replica-02', message: 'Available memory dropped below 512MB. Buffer pool efficiency degraded.', time: '14 min ago', status: 'firing' },
  { id: 3, severity: 'info', title: 'Deployment: api-service v2.14.1', message: 'Rolling deploy completed. 6/6 pods healthy. Zero downtime achieved.', time: '1h ago', status: 'resolved' },
  { id: 4, severity: 'warning', title: 'Rate limit threshold at 82%', message: 'Requests approaching rate limit ceiling for /api/v1/export endpoint.', time: '2h ago', status: 'firing' },
];

const logs = [
  { level: 'ERROR', time: '14:32:41.902', service: 'api-service', message: '[POST /v1/export] upstream timeout after 30002ms — job_id=7f3a', trace: 'trace-9a2f1b' },
  { level: 'WARN', time: '14:32:38.114', service: 'worker-node-03', message: 'CPU throttling active: cpu_usage=96.2% threshold=90%', trace: null },
  { level: 'INFO', time: '14:32:35.567', service: 'auth-service', message: 'Token refresh batch completed: 1,240 sessions renewed', trace: null },
  { level: 'ERROR', time: '14:32:31.220', service: 'api-service', message: '[GET /v1/users] rate limit exceeded: client_id=c8d2e9 — 429 returned', trace: 'trace-bb91c4' },
  { level: 'INFO', time: '14:32:28.004', service: 'cdn-edge', message: 'Cache HIT ratio: 94.2% — 14,280 req/min served from edge', trace: null },
  { level: 'WARN', time: '14:32:24.778', service: 'db-replica-02', message: 'Free memory: 498MB — below warning threshold (512MB)', trace: null },
  { level: 'INFO', time: '14:32:20.112', service: 'auth-service', message: 'SSO handshake completed: provider=AzureAD user=alan@orion.app', trace: null },
  { level: 'ERROR', time: '14:32:18.332', service: 'api-service', message: '[POST /v1/export] upstream timeout after 30001ms — job_id=7f3b', trace: 'trace-9a2f1c' },
  { level: 'INFO', time: '14:32:14.001', service: 'worker-node-01', message: 'Auto-scale event: +2 pods added to api-service deployment', trace: null },
  { level: 'INFO', time: '14:32:10.889', service: 'cdn-edge', message: 'Purge completed: 48 stale entries removed from edge cache', trace: null },
];

const serviceHealth = [
  { name: 'API Gateway', status: 'degraded', latency: '142ms', uptime: '99.84%', rps: '1,840' },
  { name: 'Auth Service', status: 'healthy', latency: '8ms', uptime: '100%', rps: '312' },
  { name: 'DB Primary', status: 'healthy', latency: '4ms', uptime: '99.99%', rps: '6,200' },
  { name: 'DB Replica', status: 'warning', latency: '6ms', uptime: '99.98%', rps: '4,100' },
  { name: 'Worker Fleet', status: 'degraded', latency: '—', uptime: '99.61%', rps: '840' },
  { name: 'CDN Edge', status: 'healthy', latency: '3ms', uptime: '100%', rps: '14,280' },
];

const levelColor: Record<string, string> = {
  ERROR: 'var(--ada-text-error)',
  WARN: 'var(--ada-text-warning)',
  INFO: 'var(--ada-text-3)',
};
const levelBg: Record<string, string> = {
  ERROR: 'var(--ada-bg-error)',
  WARN: 'var(--ada-bg-warning)',
  INFO: 'transparent',
};
const severityConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  critical: { bg: 'var(--ada-bg-error)', text: 'var(--ada-text-error)', icon: <XCircle size={13} /> },
  warning: { bg: 'var(--ada-bg-warning)', text: 'var(--ada-text-warning)', icon: <AlertTriangle size={13} /> },
  info: { bg: 'var(--ada-p-100)', text: 'var(--ada-p-600)', icon: <Info size={13} /> },
};
const statusDot: Record<string, string> = { healthy: 'var(--ada-s-500)', degraded: 'var(--ada-e-500)', warning: 'var(--ada-w-500)' };

export function DataMonitoringPage() {
  const [metrics, setMetrics] = useState(generateMetrics());
  const [logFilter, setLogFilter] = useState('ALL');
  const [logSearch, setLogSearch] = useState('');
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newPoint = {
          t: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cpu: 20 + Math.random() * 60,
          mem: 40 + Math.random() * 40,
          rps: 800 + Math.random() * 1200,
          latency: 20 + Math.random() * 80,
          errors: Math.floor(Math.random() * 8),
        };
        return [...prev.slice(-19), newPoint];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [live]);

  const activeAlerts = alerts.filter(a => !dismissedAlerts.includes(a.id));
  const filteredLogs = logs.filter(l =>
    (logFilter === 'ALL' || l.level === logFilter) &&
    (l.message.toLowerCase().includes(logSearch.toLowerCase()) || l.service.toLowerCase().includes(logSearch.toLowerCase()))
  );

  const latest = metrics[metrics.length - 1];

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* Top bar */}
      <div className="px-6 py-3 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
        <div className="flex items-center gap-3">
          <h1 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Data Monitoring</h1>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ backgroundColor: live ? 'var(--ada-bg-success)' : 'var(--ada-bg-muted)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: live ? 'var(--ada-s-500)' : 'var(--ada-text-4)' }} />
            <span style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', color: live ? 'var(--ada-text-success)' : 'var(--ada-text-3)' }}>{live ? 'LIVE' : 'PAUSED'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setLive(!live)} className="flex items-center gap-1.5 px-3 py-1.5 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)', backgroundColor: 'var(--ada-surface-1)' }}>
            {live ? <><X size={12} /> Pause</> : <><RefreshCw size={12} /> Resume</>}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border" style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-2)', backgroundColor: 'var(--ada-surface-1)' }}>
            <Bell size={13} />{activeAlerts.length > 0 && <span className="w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ fontSize: '10px', backgroundColor: 'var(--ada-e-500)' }}>{activeAlerts.length}</span>}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Alert Banners */}
        {activeAlerts.map(alert => {
          const cfg = severityConfig[alert.severity];
          return (
            <div key={alert.id} className="flex items-start gap-3 px-4 py-3 rounded-lg border" style={{ backgroundColor: cfg.bg, borderColor: cfg.text + '40', color: cfg.text }}>
              <span className="flex-shrink-0 mt-0.5">{cfg.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)' }}>{alert.title}</span>
                  <span className="px-1.5 py-0.5 rounded-full uppercase" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-bold)', backgroundColor: 'rgba(0,0,0,0.08)' }}>{alert.status}</span>
                </div>
                <p style={{ fontSize: 'var(--ada-fs-xs)', opacity: 0.85 }}>{alert.message}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span style={{ fontSize: 'var(--ada-fs-2xs)', opacity: 0.7 }}>{alert.time}</span>
                <button onClick={() => setDismissedAlerts(p => [...p, alert.id])} style={{ opacity: 0.7 }}><X size={13} /></button>
              </div>
            </div>
          );
        })}

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'CPU', value: `${latest.cpu.toFixed(1)}%`, icon: <Cpu size={15} />, warn: latest.cpu > 80, chart: metrics.map(m => m.cpu) },
            { label: 'Memory', value: `${latest.mem.toFixed(1)}%`, icon: <Database size={15} />, warn: latest.mem > 85, chart: metrics.map(m => m.mem) },
            { label: 'Req / sec', value: `${Math.round(latest.rps).toLocaleString()}`, icon: <Globe size={15} />, warn: false, chart: metrics.map(m => m.rps) },
            { label: 'P95 Latency', value: `${Math.round(latest.latency)}ms`, icon: <Zap size={15} />, warn: latest.latency > 100, chart: metrics.map(m => m.latency) },
          ].map(card => (
            <div key={card.label} className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: card.warn ? 'var(--ada-w-500)' : 'var(--ada-border-default)' }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 'var(--ada-fw-medium)' }}>{card.label}</span>
                <span style={{ color: card.warn ? 'var(--ada-text-warning)' : 'var(--ada-text-4)' }}>{card.icon}</span>
              </div>
              <div style={{ fontSize: 'var(--ada-fs-3xl)', fontWeight: 'var(--ada-fw-semibold)', color: card.warn ? 'var(--ada-text-warning)' : 'var(--ada-text-1)', letterSpacing: '-0.02em', fontFamily: 'var(--ada-font-mono)', marginBottom: '8px' }}>{card.value}</div>
              <ResponsiveContainer width="100%" height={32}>
                <LineChart data={card.chart.map((v, i) => ({ v }))} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Line type="monotone" dataKey="v" stroke={card.warn ? 'var(--ada-w-500)' : 'var(--ada-p-400)'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
              <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>CPU & Memory — Real-time</span>
              <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>2s refresh</span>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={metrics} margin={{ top: 4, right: 4, bottom: 0, left: -25 }}>
                  <defs>
                    <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--ada-p-500)" stopOpacity={0.2} /><stop offset="95%" stopColor="var(--ada-p-500)" stopOpacity={0} /></linearGradient>
                    <linearGradient id="mem" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--ada-s-500)" stopOpacity={0.2} /><stop offset="95%" stopColor="var(--ada-s-500)" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--ada-border-subtle)" />
                  <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--ada-surface-1)', border: '1px solid var(--ada-border-default)', borderRadius: 6, fontSize: 12 }} />
                  <Area type="monotone" dataKey="cpu" stroke="var(--ada-p-500)" fill="url(#cpu)" strokeWidth={1.5} name="CPU %" isAnimationActive={false} />
                  <Area type="monotone" dataKey="mem" stroke="var(--ada-s-500)" fill="url(#mem)" strokeWidth={1.5} name="Memory %" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
              <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Service Health</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ada-fs-xs)' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--ada-surface-2)', borderBottom: '1px solid var(--ada-border-default)' }}>
                  {['Service', 'Status', 'Latency', 'Req/s', 'Uptime'].map(h => (
                    <th key={h} style={{ padding: '6px 12px', textAlign: 'left', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {serviceHealth.map(s => (
                  <tr key={s.name} style={{ borderBottom: '1px solid var(--ada-border-subtle)' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)' }}>{s.name}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <span className="flex items-center gap-1.5" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', color: statusDot[s.status] }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusDot[s.status] }} />
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-2)' }}>{s.latency}</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-2)' }}>{s.rps}</td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--ada-font-mono)', color: parseFloat(s.uptime) < 99.9 ? 'var(--ada-text-warning)' : 'var(--ada-text-success)' }}>{s.uptime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log Viewer */}
        <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
            <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Log Stream</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {['ALL', 'ERROR', 'WARN', 'INFO'].map(f => (
                  <button key={f} onClick={() => setLogFilter(f)} className="px-2.5 py-1 rounded" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: logFilter === f ? 'var(--ada-p-600)' : 'transparent', color: logFilter === f ? 'white' : 'var(--ada-text-3)' }}>{f}</button>
                ))}
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
                <Search size={12} style={{ color: 'var(--ada-text-3)' }} />
                <input value={logSearch} onChange={e => setLogSearch(e.target.value)} placeholder="Filter logs…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-1)', width: '140px' }} />
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--ada-surface-3)', fontFamily: 'var(--ada-font-mono)', fontSize: 'var(--ada-fs-xs)' }}>
            {filteredLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-2 border-b" style={{ borderColor: 'var(--ada-border-subtle)', backgroundColor: log.level === 'ERROR' ? 'rgba(220,38,38,0.05)' : 'transparent' }}>
                <span style={{ color: 'var(--ada-text-4)', whiteSpace: 'nowrap', flex: '0 0 auto' }}>{log.time}</span>
                <span className="px-1.5 py-0.5 rounded flex-shrink-0" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-bold)', backgroundColor: levelBg[log.level], color: levelColor[log.level] }}>{log.level}</span>
                <span style={{ color: 'var(--ada-p-400)', flex: '0 0 auto', whiteSpace: 'nowrap' }}>[{log.service}]</span>
                <span style={{ color: 'var(--ada-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.message}</span>
                {log.trace && <span style={{ color: 'var(--ada-text-4)', flex: '0 0 auto', whiteSpace: 'nowrap' }}>{log.trace}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}