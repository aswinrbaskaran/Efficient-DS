import { useState } from 'react';
import {
  Folder, FolderOpen, File, ChevronRight, ChevronDown, X, Search,
  GitBranch, AlertCircle, AlertTriangle, Info, Settings,
  Terminal, Plus, Circle
} from 'lucide-react';

/* ─── File Tree ───────────────────────────────────────────── */
type FileNode = {
  name: string; type: 'file' | 'folder';
  ext?: string; children?: FileNode[];
  dirty?: boolean;
};

const fileTree: FileNode[] = [
  {
    name: 'src', type: 'folder', children: [
      {
        name: 'app', type: 'folder', children: [
          { name: 'App.tsx', type: 'file', ext: 'tsx' },
          { name: 'routes.ts', type: 'file', ext: 'ts' },
          {
            name: 'components', type: 'folder', children: [
              { name: 'Button.tsx', type: 'file', ext: 'tsx' },
              { name: 'Input.tsx', type: 'file', ext: 'tsx', dirty: true },
              { name: 'Modal.tsx', type: 'file', ext: 'tsx' },
            ]
          },
          {
            name: 'pages', type: 'folder', children: [
              { name: 'Dashboard.tsx', type: 'file', ext: 'tsx', dirty: true },
              { name: 'Settings.tsx', type: 'file', ext: 'tsx' },
            ]
          },
        ]
      },
      {
        name: 'styles', type: 'folder', children: [
          { name: 'theme.css', type: 'file', ext: 'css' },
          { name: 'globals.css', type: 'file', ext: 'css' },
        ]
      },
    ]
  },
  { name: 'package.json', type: 'file', ext: 'json' },
  { name: 'tsconfig.json', type: 'file', ext: 'json' },
  { name: 'vite.config.ts', type: 'file', ext: 'ts' },
  { name: '.env.local', type: 'file', ext: 'env' },
];

const extColors: Record<string, string> = {
  tsx: '#3b82f6', ts: '#3b82f6', jsx: '#f59e0b', js: '#f59e0b',
  css: '#a855f7', json: '#f59e0b', env: '#22c55e', md: '#94a3b8',
};

function FileIcon({ ext }: { ext?: string }) {
  const color = ext ? extColors[ext] || '#94a3b8' : '#94a3b8';
  return <File size={13} style={{ color, flexShrink: 0 }} />;
}

function TreeNode({ node, depth, onSelect, activeFile }: {
  node: FileNode; depth: number; onSelect: (name: string) => void; activeFile: string;
}) {
  const [open, setOpen] = useState(depth === 0);
  const isFolder = node.type === 'folder';
  const isActive = !isFolder && node.name === activeFile;

  return (
    <div>
      <button
        onClick={() => isFolder ? setOpen(!open) : onSelect(node.name)}
        className="w-full flex items-center gap-1 py-0.5 pr-2 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ada-focus-ring)] text-left"
        style={{
          paddingLeft: `${8 + depth * 12}px`,
          backgroundColor: isActive ? 'var(--ada-p-600)' : 'transparent',
          color: isActive ? 'white' : 'var(--ada-text-2)',
          fontSize: 'var(--ada-fs-xs)',
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--ada-btn-ghost-hover)'; }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        {isFolder ? (
          <>
            {open ? <ChevronDown size={11} style={{ color: 'var(--ada-text-4)', flexShrink: 0 }} /> : <ChevronRight size={11} style={{ color: 'var(--ada-text-4)', flexShrink: 0 }} />}
            {open ? <FolderOpen size={13} style={{ color: '#f59e0b', flexShrink: 0 }} /> : <Folder size={13} style={{ color: '#f59e0b', flexShrink: 0 }} />}
          </>
        ) : (
          <>
            <span style={{ width: 11, flexShrink: 0 }} />
            <FileIcon ext={node.ext} />
          </>
        )}
        <span className="flex-1 truncate ml-1">{node.name}</span>
        {node.dirty && <Circle size={7} fill="currentColor" style={{ color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--ada-w-500)', flexShrink: 0 }} />}
      </button>
      {isFolder && open && node.children?.map(child => (
        <TreeNode key={child.name} node={child} depth={depth + 1} onSelect={onSelect} activeFile={activeFile} />
      ))}
    </div>
  );
}

/* ─── Code Content ────────────────────────────────────────── */
const codeContent: Record<string, string[]> = {
  'Dashboard.tsx': [
    `import { useState } from 'react';`,
    `import { AreaChart, Area, XAxis, YAxis,`,
    `  CartesianGrid, Tooltip, ResponsiveContainer`,
    `} from 'recharts';`,
    `import { KPICard } from '../components/KPICard';`,
    ``,
    `const revenueData = [`,
    `  { month: 'Jan', revenue: 42000 },`,
    `  { month: 'Feb', revenue: 58000 },`,
    `  { month: 'Mar', revenue: 71240 },`,
    `];`,
    ``,
    `export function DashboardPage() {`,
    `  const [range, setRange] = useState('7d');`,
    ``,
    `  return (`,
    `    <div className="p-6 space-y-6">`,
    `      <div className="grid grid-cols-4 gap-4">`,
    `        <KPICard`,
    `          title="Monthly Revenue"`,
    `          value="$71,240"`,
    `          delta="+18.3%"`,
    `          deltaDir="up"`,
    `        />`,
    `      </div>`,
    ``,
    `      <ResponsiveContainer width="100%" height={200}>`,
    `        <AreaChart data={revenueData}>`,
    `          <CartesianGrid strokeDasharray="3 3" />`,
    `          <XAxis dataKey="month" />`,
    `          <YAxis />`,
    `          <Tooltip />`,
    `          <Area`,
    `            type="monotone"`,
    `            dataKey="revenue"`,
    `            stroke="#2563eb"`,
    `            fill="#eff6ff"`,
    `          />`,
    `        </AreaChart>`,
    `      </ResponsiveContainer>`,
    `    </div>`,
    `  );`,
    `}`,
  ],
  'Input.tsx': [
    `import { useState, forwardRef } from 'react';`,
    `import { AlertCircle, Eye, EyeOff } from 'lucide-react';`,
    ``,
    `interface InputProps {`,
    `  label?: string;`,
    `  placeholder?: string;`,
    `  error?: string;`,
    `  helper?: string;`,
    `  disabled?: boolean;`,
    `  type?: 'text' | 'email' | 'password';`,
    `  icon?: React.ReactNode;`,
    `}`,
    ``,
    `export const Input = forwardRef<HTMLInputElement, InputProps>(`,
    `  ({ label, placeholder, error, helper, disabled,`,
    `     type = 'text', icon }, ref) => {`,
    ``,
    `    const [focused, setFocused] = useState(false);`,
    `    const [showPw, setShowPw] = useState(false);`,
    `    const isPassword = type === 'password';`,
    ``,
    `    return (`,
    `      <div className="flex flex-col gap-1.5">`,
    `        {label && (`,
    `          <label style={{`,
    `            fontSize: 'var(--ada-fs-xs)',`,
    `            fontWeight: 'var(--ada-fw-medium)',`,
    `            color: disabled`,
    `              ? 'var(--ada-text-disabled)'`,
    `              : 'var(--ada-text-2)'`,
    `          }}>`,
    `            {label}`,
    `          </label>`,
    `        )}`,
    `        <input`,
    `          ref={ref}`,
    `          type={isPassword && showPw ? 'text' : type}`,
    `          placeholder={placeholder}`,
    `          disabled={disabled}`,
    `          onFocus={() => setFocused(true)}`,
    `          onBlur={() => setFocused(false)}`,
    `          style={{`,
    `            borderColor: error`,
    `              ? 'var(--ada-e-500)'`,
    `              : focused`,
    `                ? 'var(--ada-focus-ring)'`,
    `                : 'var(--ada-border-default)',`,
    `          }}`,
    `        />`,
    `      </div>`,
    `    );`,
    `  }`,
    `);`,
  ],
  'App.tsx': [
    `import { RouterProvider } from 'react-router';`,
    `import { router } from './routes';`,
    `import { ThemeProvider } from './context/ThemeContext';`,
    ``,
    `export default function App() {`,
    `  return (`,
    `    <ThemeProvider>`,
    `      <RouterProvider router={router} />`,
    `    </ThemeProvider>`,
    `  );`,
    `}`,
  ],
  'theme.css': [
    `:root {`,
    `  --ada-font-sans: 'Inter', sans-serif;`,
    `  --ada-font-mono: 'JetBrains Mono', monospace;`,
    ``,
    `  /* Primary Scale */`,
    `  --ada-p-50:  #eff6ff;`,
    `  --ada-p-100: #dbeafe;`,
    `  --ada-p-200: #bfdbfe;`,
    `  --ada-p-300: #93c5fd;`,
    `  --ada-p-400: #60a5fa;`,
    `  --ada-p-500: #3b82f6;`,
    `  --ada-p-600: #2563eb;`,
    `  --ada-p-700: #1d4ed8;`,
    `  --ada-p-800: #1e40af;`,
    `  --ada-p-900: #1e3a8a;`,
    ``,
    `  /* Semantic Tokens */`,
    `  --ada-bg-base:    #ffffff;`,
    `  --ada-surface-1:  #ffffff;`,
    `  --ada-surface-2:  #f8fafc;`,
    `  --ada-text-1:     #0f172a;`,
    `  --ada-text-2:     #334155;`,
    `  --ada-text-3:     #64748b;`,
    `  --ada-text-4:     #94a3b8;`,
    `  --ada-focus-ring: #2563eb;`,
    ``,
    `  /* Borders */`,
    `  --ada-border-default: #e2e8f0;`,
    `  --ada-border-strong:  #cbd5e1;`,
    `}`,
  ],
};

/* ─── Console Log ─────────────────────────────────────────── */
type LogEntry = { type: 'info' | 'warn' | 'error' | 'success'; msg: string; time: string };
const consoleLogs: LogEntry[] = [
  { type: 'info', msg: 'Starting development server...', time: '09:41:01' },
  { type: 'success', msg: 'Local:   http://localhost:5173/', time: '09:41:02' },
  { type: 'success', msg: 'Network: http://192.168.1.100:5173/', time: '09:41:02' },
  { type: 'info', msg: 'Watching for changes...', time: '09:41:03' },
  { type: 'info', msg: 'HMR update: /src/app/pages/Dashboard.tsx', time: '09:43:12' },
  { type: 'warn', msg: 'Warning: React key prop missing in list render at Dashboard.tsx:187', time: '09:43:12' },
  { type: 'info', msg: 'HMR update: /src/app/components/Input.tsx', time: '09:44:07' },
  { type: 'error', msg: "TypeError: Cannot read properties of undefined (reading 'map') at Input.tsx:24", time: '09:44:08' },
  { type: 'info', msg: 'HMR update: /src/app/components/Input.tsx', time: '09:44:35' },
  { type: 'success', msg: 'Compiled successfully in 48ms', time: '09:44:35' },
];

/* ─── Right Panel: Problems ───────────────────────────────── */
const problems = [
  { type: 'error', file: 'Input.tsx', line: 24, msg: 'Object is possibly undefined' },
  { type: 'warning', file: 'Dashboard.tsx', line: 187, msg: 'Each child in a list should have a unique "key" prop' },
  { type: 'info', file: 'theme.css', line: 12, msg: 'Color value could be simplified' },
];

/* ─── Main Page ───────────────────────────────────────────── */
export function IDEPage() {
  const [activeFile, setActiveFile] = useState('Dashboard.tsx');
  const [openTabs, setOpenTabs] = useState(['Dashboard.tsx', 'Input.tsx']);
  const [consolePanelOpen, setConsolePanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState<'problems' | 'outline'>('problems');
  const [consoleFilter, setConsoleFilter] = useState<'all' | 'error' | 'warn'>('all');

  const closeTab = (tab: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenTabs(t => {
      const rest = t.filter(x => x !== tab);
      if (activeFile === tab && rest.length) setActiveFile(rest[rest.length - 1]);
      return rest;
    });
  };

  const openFile = (name: string) => {
    setActiveFile(name);
    if (!openTabs.includes(name)) setOpenTabs(t => [...t, name]);
  };

  const code = codeContent[activeFile] || ['// No content'];

  const logColors: Record<string, string> = {
    info: 'var(--ada-text-3)', warn: 'var(--ada-w-500)', error: 'var(--ada-e-500)', success: 'var(--ada-s-600)'
  };

  const filteredLogs = consoleLogs.filter(l => consoleFilter === 'all' || l.type === consoleFilter);

  return (
    <div className="flex overflow-hidden" style={{ backgroundColor: 'var(--ada-bg-base)', height: 'calc(100vh - 48px)' }}>

      {/* ── Activity Bar (narrow) ──────────────────────────── */}
      <div className="flex flex-col items-center py-2 gap-1 flex-shrink-0 border-r" style={{ width: 40, backgroundColor: 'var(--ada-surface-3)', borderColor: 'var(--ada-border-default)' }}>
        {[
          { icon: <File size={16} />, label: 'Explorer', active: true },
          { icon: <Search size={16} />, label: 'Search' },
          { icon: <GitBranch size={16} />, label: 'Source Control' },
          { icon: <Terminal size={16} />, label: 'Terminal' },
        ].map(item => (
          <button
            key={item.label}
            title={item.label}
            className="flex items-center justify-center w-8 h-8 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)] transition-colors"
            style={{
              color: item.active ? 'var(--ada-p-600)' : 'var(--ada-text-4)',
              backgroundColor: item.active ? 'var(--ada-surface-1)' : 'transparent',
            }}
            onMouseEnter={e => { if (!item.active) e.currentTarget.style.color = 'var(--ada-text-2)'; }}
            onMouseLeave={e => { if (!item.active) e.currentTarget.style.color = 'var(--ada-text-4)'; }}
          >
            {item.icon}
          </button>
        ))}
        <div className="flex-1" />
        <button title="Settings" className="flex items-center justify-center w-8 h-8 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
          style={{ color: 'var(--ada-text-4)' }}>
          <Settings size={16} />
        </button>
      </div>

      {/* ── File Explorer Sidebar ──────────────────────────── */}
      <div className="flex flex-col flex-shrink-0 border-r" style={{ width: 200, backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
        <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: 'var(--ada-border-default)' }}>
          <span style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Explorer
          </span>
          <div className="flex gap-1">
            <button title="New file" className="focus:outline-none" style={{ color: 'var(--ada-text-4)' }}><Plus size={13} /></button>
            <button title="New folder" className="focus:outline-none" style={{ color: 'var(--ada-text-4)' }}><Folder size={13} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {fileTree.map(node => (
            <TreeNode key={node.name} node={node} depth={0} onSelect={openFile} activeFile={activeFile} />
          ))}
        </div>
      </div>

      {/* ── Editor Area ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Bar */}
        <div className="flex items-center border-b flex-shrink-0 overflow-x-auto" style={{ backgroundColor: 'var(--ada-surface-3)', borderColor: 'var(--ada-border-default)', minHeight: 36 }}>
          {openTabs.map(tab => {
            const ext = tab.split('.').pop();
            const dirty = fileTree.flatMap(n => n.children || []).flatMap(n => n.children || []).some(n => n.name === tab && n.dirty);
            return (
              <div
                key={tab}
                role="tab"
                aria-selected={activeFile === tab}
                onClick={() => setActiveFile(tab)}
                className="flex items-center gap-1.5 px-4 py-2 cursor-pointer border-r flex-shrink-0 transition-colors group"
                style={{
                  borderColor: 'var(--ada-border-default)',
                  backgroundColor: activeFile === tab ? 'var(--ada-surface-1)' : 'transparent',
                  borderTop: activeFile === tab ? `2px solid var(--ada-p-600)` : '2px solid transparent',
                }}
              >
                <FileIcon ext={ext} />
                <span style={{ fontSize: 'var(--ada-fs-xs)', color: activeFile === tab ? 'var(--ada-text-1)' : 'var(--ada-text-3)', fontWeight: activeFile === tab ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)' }}>
                  {tab}
                </span>
                {dirty && <Circle size={6} fill="currentColor" style={{ color: 'var(--ada-w-500)' }} />}
                <button
                  onClick={e => closeTab(tab, e)}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none rounded"
                  style={{ color: 'var(--ada-text-4)' }}
                  aria-label={`Close ${tab}`}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Editor + Bottom Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code */}
          <div className="flex-1 overflow-auto" style={{ backgroundColor: 'var(--ada-surface-1)' }}>
            <div className="flex">
              {/* Line numbers */}
              <div className="flex-shrink-0 select-none py-4 pr-3 pl-3 text-right" style={{ backgroundColor: 'var(--ada-surface-2)', borderRight: '1px solid var(--ada-border-subtle)', minWidth: 44 }}>
                {code.map((_, i) => (
                  <div key={i} style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-4)', lineHeight: '1.6', userSelect: 'none' }}>
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Code content */}
              <pre className="flex-1 py-4 px-4 overflow-x-auto" style={{ fontFamily: 'var(--ada-font-mono)', fontSize: 'var(--ada-fs-xs)', lineHeight: '1.6', color: 'var(--ada-text-2)', margin: 0, whiteSpace: 'pre' }}>
                {code.map((line, i) => (
                  <div key={i} className="hover:bg-[var(--ada-surface-2)]">
                    <SyntaxLine line={line} />
                  </div>
                ))}
              </pre>
            </div>
          </div>

          {/* Console Panel */}
          {consolePanelOpen && (
            <div className="flex-shrink-0 border-t" style={{ height: 160, borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-bg-base)' }}>
              <div className="flex items-center border-b" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)', height: 30 }}>
                {[
                  { id: 'terminal', label: 'Terminal' },
                  { id: 'console', label: 'Console' },
                  { id: 'output', label: 'Output' },
                ].map(tab => (
                  <button key={tab.id}
                    className="px-4 h-full border-r transition-colors focus:outline-none"
                    style={{ fontSize: 'var(--ada-fs-xs)', borderColor: 'var(--ada-border-default)', color: tab.id === 'console' ? 'var(--ada-text-1)' : 'var(--ada-text-3)', fontWeight: tab.id === 'console' ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)', backgroundColor: tab.id === 'console' ? 'var(--ada-surface-1)' : 'transparent' }}>
                    {tab.label}
                  </button>
                ))}

                {/* Filter pills */}
                <div className="flex gap-1 ml-3">
                  {(['all', 'error', 'warn'] as const).map(f => (
                    <button key={f} onClick={() => setConsoleFilter(f)}
                      className="px-2 py-0.5 rounded focus:outline-none"
                      style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: consoleFilter === f ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)', color: consoleFilter === f ? 'var(--ada-p-600)' : 'var(--ada-text-4)', backgroundColor: consoleFilter === f ? 'var(--ada-p-50)' : 'transparent' }}>
                      {f === 'all' ? 'All' : f === 'error' ? `Errors (${consoleLogs.filter(l => l.type === 'error').length})` : `Warnings (${consoleLogs.filter(l => l.type === 'warn').length})`}
                    </button>
                  ))}
                </div>

                <div className="flex-1" />
                <button onClick={() => setConsolePanelOpen(false)} className="px-3 focus:outline-none" style={{ color: 'var(--ada-text-4)' }} aria-label="Close panel">
                  <X size={13} />
                </button>
              </div>
              <div className="overflow-y-auto px-3 py-2 space-y-0.5" style={{ height: 'calc(100% - 30px)' }}>
                {filteredLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)', flexShrink: 0, lineHeight: '1.5' }}>{log.time}</span>
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: logColors[log.type] || 'var(--ada-text-2)', fontFamily: 'var(--ada-font-mono)', lineHeight: '1.5' }}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Panel ───────────────────────────────────── */}
      <div className="flex-shrink-0 border-l flex flex-col" style={{ width: 220, backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
        {/* Tab bar */}
        <div className="flex border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          {(['problems', 'outline'] as const).map(t => (
            <button key={t} onClick={() => setRightPanelTab(t)}
              className="flex-1 py-2 capitalize focus:outline-none transition-colors"
              style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: rightPanelTab === t ? 'var(--ada-fw-medium)' : 'var(--ada-fw-regular)', color: rightPanelTab === t ? 'var(--ada-text-1)' : 'var(--ada-text-3)', borderBottom: rightPanelTab === t ? '2px solid var(--ada-p-600)' : '2px solid transparent', marginBottom: '-1px' }}>
              {t === 'problems' ? `Problems (${problems.length})` : 'Outline'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {rightPanelTab === 'problems' ? (
            <div className="space-y-1">
              {problems.map((p, i) => {
                const cfg = { error: { icon: <AlertCircle size={12} />, color: 'var(--ada-e-500)' }, warning: { icon: <AlertTriangle size={12} />, color: 'var(--ada-w-500)' }, info: { icon: <Info size={12} />, color: 'var(--ada-i-500)' } };
                const c = cfg[p.type as keyof typeof cfg];
                return (
                  <div key={i} className="flex items-start gap-2 p-2 rounded" style={{ backgroundColor: 'var(--ada-surface-1)', border: '1px solid var(--ada-border-subtle)' }}>
                    <span style={{ color: c.color, flexShrink: 0, marginTop: '1px' }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-1)', lineHeight: 1.4 }}>{p.msg}</div>
                      <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)', marginTop: '2px' }}>
                        {p.file}:{p.line}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-0.5">
              {[
                { label: 'imports', depth: 0 },
                { label: 'revenueData', depth: 0 },
                { label: 'DashboardPage', depth: 0 },
                { label: '  range', depth: 1 },
                { label: '  return', depth: 1 },
                { label: '    div.p-6', depth: 2 },
                { label: '      KPICard ×4', depth: 3 },
                { label: '      AreaChart', depth: 3 },
                { label: '      BarChart', depth: 3 },
              ].map((item, i) => (
                <div key={i} className="py-0.5 rounded cursor-pointer"
                  style={{ paddingLeft: `${8 + item.depth * 12}px`, fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: item.depth === 0 ? 'var(--ada-p-600)' : 'var(--ada-text-3)' }}>
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="border-t px-3 py-1.5 flex items-center gap-3" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-3)' }}>
          <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>
            Ln {Math.floor(Math.random() * 40) + 1}, Col 24
          </span>
          <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>TSX</span>
          <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>UTF-8</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Simple Syntax Highlighter ───────────────────────────── */
function SyntaxLine({ line }: { line: string }) {
  // Very basic tokenizer for visual effect
  const tokens: { text: string; color: string }[] = [];
  let rest = line;

  const push = (text: string, color: string) => { tokens.push({ text, color }); };

  // Comment
  if (rest.trim().startsWith('//') || rest.trim().startsWith('*') || rest.trim().startsWith('/*')) {
    push(rest, '#64748b');
    return <>{tokens.map((t, i) => <span key={i} style={{ color: t.color }}>{t.text}</span>)}</>;
  }

  // Process keywords
  const keywords = ['import', 'export', 'from', 'const', 'let', 'return', 'function', 'interface', 'type', 'default', 'extends', 'forwardRef'];
  const parts = rest.split(/\b/);

  return (
    <>
      {parts.map((part, i) => {
        if (keywords.includes(part)) return <span key={i} style={{ color: '#9333ea' }}>{part}</span>;
        if (part.match(/^['"`]/)) return <span key={i} style={{ color: '#16a34a' }}>{part}</span>;
        if (part.match(/^\d+/)) return <span key={i} style={{ color: '#f59e0b' }}>{part}</span>;
        if (part.match(/^[A-Z]/)) return <span key={i} style={{ color: '#3b82f6' }}>{part}</span>;
        return <span key={i} style={{ color: 'var(--ada-text-2)' }}>{part}</span>;
      })}
    </>
  );
}