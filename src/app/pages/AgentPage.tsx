import { useState, useRef, useEffect } from 'react';
import {
  Send, Bot, Cpu, Zap, GitBranch, CheckCircle2, Circle, Loader2,
  ArrowRight, ChevronDown, ChevronRight, Terminal, Eye, Code2,
  FileText, Search, Globe, Database, Shield, Plug, Settings,
  RotateCcw, Sparkles, AlertTriangle, Clock, Play, Pause,
  BarChart3, Workflow, Layers, Plus, X, Copy,
} from 'lucide-react';

/* ─── Types ─── */
interface ToolCall {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  input?: string;
  output?: string;
  duration?: string;
  icon: React.ReactNode;
}

interface AgentStep {
  id: string;
  type: 'thought' | 'tool_call' | 'observation' | 'response';
  content: string;
  toolCalls?: ToolCall[];
  timestamp: string;
}

interface AgentDef {
  id: string;
  name: string;
  role: string;
  model: string;
  status: 'idle' | 'thinking' | 'acting' | 'done' | 'error';
  avatar: string;
  color: string;
}

/* ─── Mock Data ─── */
const agents: AgentDef[] = [
  { id: 'orchestrator', name: 'Orchestrator', role: 'Plans and delegates tasks', model: 'GPT-4o', status: 'done', avatar: '🧠', color: 'var(--ada-p-600)' },
  { id: 'researcher', name: 'Research Agent', role: 'Web search & data gathering', model: 'Claude 3.5', status: 'thinking', avatar: '🔍', color: 'var(--ada-s-600)' },
  { id: 'coder', name: 'Code Agent', role: 'Writes and reviews code', model: 'GPT-4o', status: 'acting', avatar: '💻', color: '#10b981' },
  { id: 'reviewer', name: 'Review Agent', role: 'Quality assurance & testing', model: 'Claude 3.5', status: 'idle', avatar: '✅', color: '#f59e0b' },
];

const availableTools = [
  { name: 'web_search', desc: 'Search the web for real-time information', icon: <Globe size={14} /> },
  { name: 'read_file', desc: 'Read file contents from the workspace', icon: <FileText size={14} /> },
  { name: 'write_file', desc: 'Create or modify files in workspace', icon: <Code2 size={14} /> },
  { name: 'run_terminal', desc: 'Execute shell commands', icon: <Terminal size={14} /> },
  { name: 'query_db', desc: 'Run SQL queries against databases', icon: <Database size={14} /> },
  { name: 'search_code', desc: 'Semantic search across codebase', icon: <Search size={14} /> },
];

const mockSteps: AgentStep[] = [
  {
    id: 's1',
    type: 'thought',
    content: 'The user wants to refactor the authentication module. I need to first understand the current file structure, then identify the auth-related files, and propose a cleaner architecture.',
    timestamp: '2:14:01 PM',
  },
  {
    id: 's2',
    type: 'tool_call',
    content: 'Searching for authentication-related files in the codebase.',
    timestamp: '2:14:02 PM',
    toolCalls: [
      { id: 't1', name: 'search_code', status: 'success', input: 'query: "authentication middleware auth login"', output: 'Found 12 files matching query', duration: '340ms', icon: <Search size={13} /> },
      { id: 't2', name: 'read_file', status: 'success', input: 'path: "src/auth/middleware.ts"', output: '142 lines read', duration: '12ms', icon: <FileText size={13} /> },
      { id: 't3', name: 'read_file', status: 'success', input: 'path: "src/auth/providers.ts"', output: '89 lines read', duration: '8ms', icon: <FileText size={13} /> },
    ],
  },
  {
    id: 's3',
    type: 'observation',
    content: 'The auth module has 3 main files: middleware.ts (142 LOC), providers.ts (89 LOC), and session.ts (67 LOC). The middleware mixes JWT validation with role-based access control. These should be separated.',
    timestamp: '2:14:03 PM',
  },
  {
    id: 's4',
    type: 'tool_call',
    content: 'Creating the refactored file structure.',
    timestamp: '2:14:05 PM',
    toolCalls: [
      { id: 't4', name: 'write_file', status: 'success', input: 'path: "src/auth/jwt.ts"', output: 'Created (48 lines)', duration: '15ms', icon: <Code2 size={13} /> },
      { id: 't5', name: 'write_file', status: 'success', input: 'path: "src/auth/rbac.ts"', output: 'Created (62 lines)', duration: '14ms', icon: <Code2 size={13} /> },
      { id: 't6', name: 'run_terminal', status: 'running', input: 'npm test -- --filter auth', output: '', duration: '', icon: <Terminal size={13} /> },
    ],
  },
  {
    id: 's5',
    type: 'response',
    content: 'I\'ve refactored the authentication module into smaller, focused files:\n\n• **jwt.ts** — Token validation & refresh logic\n• **rbac.ts** — Role-based access control middleware\n• **session.ts** — Session management (unchanged)\n• **providers.ts** — OAuth provider configs (unchanged)\n\nAll existing tests pass. The middleware.ts barrel file now re-exports from the new modules for backward compatibility.',
    timestamp: '2:14:08 PM',
  },
];

/* ─── Component ─── */
export function AgentPage() {
  const [input, setInput] = useState('');
  const [activeAgent, setActiveAgent] = useState<string>('orchestrator');
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(['s2', 's4']));
  const [showToolPanel, setShowToolPanel] = useState(true);
  const [agentMode, setAgentMode] = useState<'single' | 'multi'>('multi');
  const [autoApprove, setAutoApprove] = useState(false);
  const [maxSteps, setMaxSteps] = useState(25);
  const [verbosity, setVerbosity] = useState<'compact' | 'detailed'>('detailed');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, []);

  const toggleStep = (id: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const statusColor = (s: AgentDef['status']) => {
    switch (s) {
      case 'thinking': return 'var(--ada-p-500)';
      case 'acting': return '#10b981';
      case 'done': return 'var(--ada-text-success)';
      case 'error': return 'var(--ada-text-error)';
      default: return 'var(--ada-text-4)';
    }
  };

  const stepTypeStyle = (type: AgentStep['type']) => {
    switch (type) {
      case 'thought': return { bg: 'var(--ada-p-50)', border: 'var(--ada-p-200)', icon: <Sparkles size={14} style={{ color: 'var(--ada-p-600)' }} />, label: 'Thinking' };
      case 'tool_call': return { bg: 'var(--ada-surface-2)', border: 'var(--ada-border-default)', icon: <Plug size={14} style={{ color: 'var(--ada-s-600)' }} />, label: 'Tool Use' };
      case 'observation': return { bg: 'var(--ada-w-50, var(--ada-surface-2))', border: 'var(--ada-w-200, var(--ada-border-default))', icon: <Eye size={14} style={{ color: 'var(--ada-w-600, #f59e0b)' }} />, label: 'Observation' };
      case 'response': return { bg: 'var(--ada-s-50, var(--ada-surface-2))', border: 'var(--ada-s-200, var(--ada-border-default))', icon: <Bot size={14} style={{ color: 'var(--ada-s-600)' }} />, label: 'Response' };
    }
  };

  const toolStatusIcon = (s: ToolCall['status']) => {
    switch (s) {
      case 'pending': return <Circle size={12} style={{ color: 'var(--ada-text-4)' }} />;
      case 'running': return <Loader2 size={12} style={{ color: 'var(--ada-p-500)' }} className="animate-spin" />;
      case 'success': return <CheckCircle2 size={12} style={{ color: 'var(--ada-text-success)' }} />;
      case 'error': return <AlertTriangle size={12} style={{ color: 'var(--ada-text-error)' }} />;
    }
  };

  return (
    <div className="flex h-full" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* ─── Left: Agent Roster ─── */}
      <div className="w-60 border-r flex flex-col flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
        {/* Mode Toggle */}
        <div className="p-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--ada-border-default)' }}>
            {(['single', 'multi'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setAgentMode(mode)}
                className="flex-1 py-1.5 text-center capitalize"
                style={{
                  fontSize: 'var(--ada-fs-xs)',
                  fontWeight: agentMode === mode ? 'var(--ada-fw-semibold)' : 'var(--ada-fw-normal)',
                  backgroundColor: agentMode === mode ? 'var(--ada-p-600)' : 'var(--ada-surface-1)',
                  color: agentMode === mode ? 'white' : 'var(--ada-text-2)',
                }}
              >
                {mode === 'single' ? 'Single Agent' : 'Multi-Agent'}
              </button>
            ))}
          </div>
        </div>

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 pt-1 pb-2" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Active Agents
          </div>
          {agents.map(a => (
            <button
              key={a.id}
              onClick={() => setActiveAgent(a.id)}
              className="w-full text-left px-3 py-2.5 rounded-lg transition-colors"
              style={{
                backgroundColor: activeAgent === a.id ? 'var(--ada-p-50)' : 'transparent',
                borderLeft: activeAgent === a.id ? `3px solid ${a.color}` : '3px solid transparent',
              }}
              onMouseEnter={e => { if (activeAgent !== a.id) e.currentTarget.style.backgroundColor = 'var(--ada-surface-3)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = activeAgent === a.id ? 'var(--ada-p-50)' : 'transparent'; }}
            >
              <div className="flex items-center gap-2.5">
                <span style={{ fontSize: '16px' }}>{a.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{a.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusColor(a.status) }} />
                  </div>
                  <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)', marginTop: '1px' }}>{a.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1.5 pl-7">
                <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-surface-3)', color: 'var(--ada-text-3)' }}>{a.model}</span>
                <span className="capitalize" style={{ fontSize: 'var(--ada-fs-2xs)', color: statusColor(a.status), fontWeight: 'var(--ada-fw-medium)' }}>{a.status}</span>
              </div>
            </button>
          ))}
          <button
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed mt-2"
            style={{ borderColor: 'var(--ada-border-default)', color: 'var(--ada-text-3)', fontSize: 'var(--ada-fs-xs)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ada-p-400)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--ada-border-default)')}
          >
            <Plus size={13} /> Add Agent
          </button>
        </div>

        {/* Agent Stats */}
        <div className="p-3 border-t space-y-2" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)' }}>Total Steps</span>
            <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-1)' }}>14 / {maxSteps}</span>
          </div>
          <div className="w-full rounded-full h-1.5" style={{ backgroundColor: 'var(--ada-surface-3)' }}>
            <div className="h-1.5 rounded-full" style={{ width: `${(14 / maxSteps) * 100}%`, backgroundColor: 'var(--ada-p-600)' }} />
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)' }}>Tools Used</span>
            <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-1)' }}>6</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)' }}>Elapsed</span>
            <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-1)' }}>7.2s</span>
          </div>
        </div>
      </div>

      {/* ─── Center: Agent Trace / Chat ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="px-4 py-2.5 border-b flex items-center gap-3 flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
          <div className="flex items-center gap-2">
            <Workflow size={15} style={{ color: 'var(--ada-p-500)' }} />
            <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Agent Trace</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ backgroundColor: 'var(--ada-surface-2)', fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)' }}>
            <Clock size={11} />
            <span>Started 2:14 PM</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ backgroundColor: 'var(--ada-s-50, var(--ada-surface-2))', fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-s-600)' }}>
            <Zap size={11} />
            <span>5 steps · 6 tool calls</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded overflow-hidden border" style={{ borderColor: 'var(--ada-border-default)' }}>
              {(['compact', 'detailed'] as const).map(v => (
                <button key={v} onClick={() => setVerbosity(v)} className="px-2.5 py-1 capitalize" style={{
                  fontSize: 'var(--ada-fs-2xs)',
                  backgroundColor: verbosity === v ? 'var(--ada-p-600)' : 'var(--ada-surface-1)',
                  color: verbosity === v ? 'white' : 'var(--ada-text-3)',
                }}>{v}</button>
              ))}
            </div>
            <button className="p-1.5 rounded" style={{ color: 'var(--ada-text-3)' }} title="Restart"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* User Message */}
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: 'var(--ada-p-600)', color: 'white' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold' }}>U</span>
            </div>
            <div className="flex-1 max-w-3xl">
              <div className="rounded-xl px-4 py-3" style={{ backgroundColor: 'var(--ada-p-600)', color: 'white' }}>
                <p style={{ fontSize: 'var(--ada-fs-sm)', lineHeight: 1.6 }}>
                  Refactor the authentication module — separate JWT validation from role-based access control into individual files.
                </p>
              </div>
              <div className="mt-1 px-1" style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>2:14 PM</div>
            </div>
          </div>

          {/* Agent Steps */}
          {mockSteps.map(step => {
            const style = stepTypeStyle(step.type);
            const isExpanded = expandedSteps.has(step.id);
            return (
              <div key={step.id} className="flex gap-3 items-start">
                {/* Timeline dot */}
                <div className="flex flex-col items-center flex-shrink-0 pt-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: style.bg, border: `1.5px solid ${style.border}` }}>
                    {style.icon}
                  </div>
                  {step.id !== 's5' && <div className="w-px flex-1 min-h-[16px]" style={{ backgroundColor: 'var(--ada-border-default)' }} />}
                </div>
                {/* Content */}
                <div className="flex-1 max-w-3xl pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{style.label}</span>
                    <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>{step.timestamp}</span>
                  </div>
                  <div className="rounded-lg px-4 py-3 border" style={{ backgroundColor: style.bg, borderColor: style.border }}>
                    {step.type === 'response' ? (
                      <div>
                        {step.content.split('\n').map((line, i) => {
                          if (line.startsWith('•')) return (
                            <div key={i} className="flex gap-2 ml-1 mb-1" style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)', lineHeight: 1.6 }}>
                              <span>•</span>
                              <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            </div>
                          );
                          if (line === '') return <div key={i} style={{ height: '6px' }} />;
                          return <p key={i} style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)', lineHeight: 1.6, marginBottom: '2px' }}>{line}</p>;
                        })}
                      </div>
                    ) : (
                      <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', lineHeight: 1.6 }}>{step.content}</p>
                    )}

                    {/* Tool Calls */}
                    {step.toolCalls && step.toolCalls.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <button onClick={() => toggleStep(step.id)} className="flex items-center gap-1" style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)', fontWeight: 'var(--ada-fw-medium)' }}>
                          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          {step.toolCalls.length} tool call{step.toolCalls.length > 1 ? 's' : ''}
                        </button>
                        {isExpanded && (
                          <div className="space-y-1.5 mt-1">
                            {step.toolCalls.map(tc => (
                              <div key={tc.id} className="flex items-center gap-2.5 px-3 py-2 rounded border" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-subtle)' }}>
                                {toolStatusIcon(tc.status)}
                                <span style={{ color: 'var(--ada-text-3)' }}>{tc.icon}</span>
                                <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', fontFamily: 'var(--ada-font-mono)' }}>{tc.name}</span>
                                {tc.input && <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)' }}>{tc.input}</span>}
                                <div className="ml-auto flex items-center gap-2">
                                  {tc.output && <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-success)' }}>{tc.output}</span>}
                                  {tc.duration && <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>{tc.duration}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); } }}
              placeholder="Describe a task for the agent… (Enter to send)"
              rows={2}
              className="flex-1 resize-none rounded-lg border px-4 py-3"
              style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)', outline: 'none', fontFamily: 'inherit' }}
            />
            <div className="flex flex-col gap-2 self-end">
              <button className="px-4 py-2 rounded-lg flex items-center gap-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)' }}>
                <Play size={13} /> Run Agent
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={autoApprove} onChange={e => setAutoApprove(e.target.checked)} style={{ accentColor: 'var(--ada-p-600)' }} />
              <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)' }}>Auto-approve tool calls</span>
            </label>
            <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>|</span>
            <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)' }}>Max steps: {maxSteps}</span>
          </div>
        </div>
      </div>

      {/* ─── Right: Tools & Config Panel ─── */}
      <div className="w-60 border-l flex flex-col flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
        {/* Available Tools */}
        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--ada-border-default)' }}>
          <Plug size={14} style={{ color: 'var(--ada-text-3)' }} />
          <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Available Tools</span>
          <span className="ml-auto px-1.5 py-0.5 rounded" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-surface-3)', color: 'var(--ada-text-3)' }}>{availableTools.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {availableTools.map(tool => (
            <div key={tool.name} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg border" style={{ borderColor: 'var(--ada-border-subtle)', backgroundColor: 'var(--ada-surface-1)' }}>
              <span className="mt-0.5" style={{ color: 'var(--ada-p-500)' }}>{tool.icon}</span>
              <div>
                <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', fontFamily: 'var(--ada-font-mono)' }}>{tool.name}</div>
                <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)', lineHeight: 1.4, marginTop: '1px' }}>{tool.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Config */}
        <div className="border-t p-4 space-y-4" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Settings size={14} style={{ color: 'var(--ada-text-3)' }} />
            <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Config</span>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>Max Steps</span>
              <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-1)' }}>{maxSteps}</span>
            </div>
            <input type="range" min={5} max={100} step={5} value={maxSteps} onChange={e => setMaxSteps(parseInt(e.target.value))} className="w-full" style={{ accentColor: 'var(--ada-p-600)' }} />
          </div>
          <div className="space-y-2">
            {[
              { label: 'Auto-approve', val: autoApprove, set: setAutoApprove },
            ].map(({ label, val, set }) => (
              <div key={label} className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{label}</span>
                <button onClick={() => set(!val)} className="w-8 h-4 rounded-full relative transition-colors" style={{ backgroundColor: val ? 'var(--ada-p-600)' : 'var(--ada-surface-3)' }}>
                  <span className="absolute top-0.5 w-3 h-3 rounded-full transition-all" style={{ backgroundColor: 'white', left: val ? '18px' : '2px' }} />
                </button>
              </div>
            ))}
          </div>

          {/* Execution Log Summary */}
          <div className="pt-3 border-t" style={{ borderColor: 'var(--ada-border-default)' }}>
            <div style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Execution Log</div>
            <div className="space-y-1">
              {[
                { label: 'search_code', count: 1, color: 'var(--ada-p-500)' },
                { label: 'read_file', count: 2, color: 'var(--ada-s-500)' },
                { label: 'write_file', count: 2, color: '#10b981' },
                { label: 'run_terminal', count: 1, color: '#f59e0b' },
              ].map(t => (
                <div key={t.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                    <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-2)', fontFamily: 'var(--ada-font-mono)' }}>{t.label}</span>
                  </div>
                  <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)' }}>×{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
