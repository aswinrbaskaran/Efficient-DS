import { useState, useRef, useEffect } from 'react';
import {
  Send, Plus, Trash2, Copy, RotateCcw, ChevronDown,
  Cpu, Zap, Settings, MoreHorizontal, Clock, Sparkles,
  ChevronRight, Pin, Search,
} from 'lucide-react';

const models = [
  { id: 'gpt4o', name: 'GPT-4o', provider: 'OpenAI', ctx: '128k', speed: 'Fast', tier: 'Premium' },
  { id: 'claude35', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', ctx: '200k', speed: 'Fast', tier: 'Premium' },
  { id: 'gemini15', name: 'Gemini 1.5 Pro', provider: 'Google', ctx: '1M', speed: 'Medium', tier: 'Premium' },
  { id: 'llama3', name: 'Llama 3.1 70B', provider: 'Meta', ctx: '128k', speed: 'Fast', tier: 'Open' },
  { id: 'mistral', name: 'Mistral Large', provider: 'Mistral AI', ctx: '32k', speed: 'Very Fast', tier: 'Open' },
];

const historyItems = [
  { id: 'h1', title: 'React performance optimisation', time: '2h ago', pinned: true },
  { id: 'h2', title: 'SQL query for monthly cohort analysis', time: '5h ago', pinned: false },
  { id: 'h3', title: 'Write a product launch email', time: '1d ago', pinned: false },
  { id: 'h4', title: 'Debug TypeScript generic constraint', time: '1d ago', pinned: false },
  { id: 'h5', title: 'Summarise Q4 board report', time: '2d ago', pinned: false },
  { id: 'h6', title: 'Design system token naming conventions', time: '3d ago', pinned: true },
];

const initialMessages = [
  {
    role: 'user',
    content: 'Explain the difference between useMemo and useCallback in React, and when to use each one.',
    time: '2:14 PM',
  },
  {
    role: 'assistant',
    content: `Both \`useMemo\` and \`useCallback\` are React hooks for memoisation, but they serve different purposes:

**useMemo** memoises a *computed value* — it runs a function and caches its return value.

\`\`\`tsx
const sortedList = useMemo(() => items.sort(...), [items]);
\`\`\`

Use it when you have an expensive computation (like sorting, filtering, or complex calculations) that shouldn't re-run on every render.

**useCallback** memoises a *function reference* — it returns the same function instance between renders.

\`\`\`tsx
const handleClick = useCallback(() => doSomething(id), [id]);
\`\`\`

Use it when passing callbacks to child components wrapped in \`React.memo\`, or as a dependency of another hook like \`useEffect\`.

**Rule of thumb:** Reach for these when you have a measurable performance problem — premature optimisation adds complexity without benefit.`,
    time: '2:14 PM',
  },
];

export function AIToolPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [temp, setTemp] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful, concise technical assistant. Provide accurate, well-structured answers with code examples when relevant.');
  const [streamOutput, setStreamOutput] = useState(true);
  const [showReasoning, setShowReasoning] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [selectedHistory, setSelectedHistory] = useState('h1');
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: `Generating a response using **${selectedModel.name}**…\n\nThis is a mock response. In production, this would stream tokens from the ${selectedModel.provider} API.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 600);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div className="flex h-full" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* Left: History Sidebar */}
      <div className="w-56 border-r flex flex-col flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
        <div className="p-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)' }}>
            <Plus size={13} /> New Chat
          </button>
        </div>
        <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
            <Search size={12} style={{ color: 'var(--ada-text-3)' }} />
            <input value={historySearch} onChange={e => setHistorySearch(e.target.value)} placeholder="Search history…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-1)', flex: 1 }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {historyItems.filter(h => h.title.toLowerCase().includes(historySearch.toLowerCase())).map(h => (
            <button key={h.id} onClick={() => setSelectedHistory(h.id)} className="w-full text-left px-2.5 py-2 rounded group relative" style={{
              backgroundColor: selectedHistory === h.id ? 'var(--ada-p-50)' : 'transparent',
              borderLeft: selectedHistory === h.id ? '2px solid var(--ada-p-600)' : '2px solid transparent',
            }}
              onMouseEnter={e => { if (selectedHistory !== h.id) e.currentTarget.style.backgroundColor = 'var(--ada-surface-3)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = selectedHistory === h.id ? 'var(--ada-p-50)' : 'transparent'; }}>
              <div className="flex items-start justify-between gap-1">
                <span style={{ fontSize: 'var(--ada-fs-xs)', color: selectedHistory === h.id ? 'var(--ada-p-700)' : 'var(--ada-text-2)', fontWeight: selectedHistory === h.id ? 'var(--ada-fw-medium)' : undefined, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{h.title}</span>
                {h.pinned && <Pin size={10} style={{ color: 'var(--ada-text-4)', flexShrink: 0, marginTop: '2px' }} />}
              </div>
              <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', marginTop: '2px' }}>{h.time}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Center: Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Model Bar */}
        <div className="px-4 py-2.5 border-b flex items-center gap-3 flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
          <div className="relative">
            <button onClick={() => setShowModelPicker(!showModelPicker)} className="flex items-center gap-2 px-3 py-1.5 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)', fontSize: 'var(--ada-fs-xs)' }}>
              <Cpu size={13} style={{ color: 'var(--ada-p-500)' }} />
              <span style={{ fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{selectedModel.name}</span>
              <span style={{ color: 'var(--ada-text-4)' }}>{selectedModel.provider}</span>
              <ChevronDown size={12} style={{ color: 'var(--ada-text-3)' }} />
            </button>
            {showModelPicker && (
              <div className="absolute top-full left-0 mt-1 w-64 rounded-lg border shadow-lg z-20" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', boxShadow: 'var(--ada-shadow-3)' }}>
                {models.map(m => (
                  <button key={m.id} onClick={() => { setSelectedModel(m); setShowModelPicker(false); }} className="w-full flex items-start gap-3 px-4 py-3 text-left border-b last:border-0" style={{ borderColor: 'var(--ada-border-subtle)', backgroundColor: selectedModel.id === m.id ? 'var(--ada-p-50)' : 'transparent' }}>
                    <div>
                      <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{m.name}</div>
                      <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>{m.provider} · {m.ctx} ctx · {m.speed}</div>
                    </div>
                    <span className="ml-auto px-1.5 py-0.5 rounded flex-shrink-0" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: m.tier === 'Premium' ? 'var(--ada-p-100)' : 'var(--ada-s-100)', color: m.tier === 'Premium' ? 'var(--ada-p-700)' : 'var(--ada-s-700)' }}>{m.tier}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>
            <Zap size={12} style={{ color: 'var(--ada-text-success)' }} />
            <span>{selectedModel.speed}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="p-1.5 rounded" style={{ color: 'var(--ada-text-3)' }} title="Regenerate"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              <RotateCcw size={14} />
            </button>
            <button className="p-1.5 rounded" style={{ color: 'var(--ada-text-3)' }} title="Clear"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--ada-surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: msg.role === 'user' ? 'var(--ada-p-600)' : 'var(--ada-surface-3)', color: msg.role === 'user' ? 'white' : 'var(--ada-text-2)' }}>
                {msg.role === 'user' ? <span style={{ fontSize: '11px', fontWeight: 'bold' }}>U</span> : <Sparkles size={13} />}
              </div>
              <div className="flex-1 max-w-2xl">
                <div className="rounded-xl px-4 py-3" style={{
                  backgroundColor: msg.role === 'user' ? 'var(--ada-p-600)' : 'var(--ada-surface-2)',
                  color: msg.role === 'user' ? 'white' : 'var(--ada-text-1)',
                }}>
                  {msg.content.split('\n').map((line, j) => {
                    if (line.startsWith('```')) return null;
                    if (line.startsWith('**') && line.endsWith('**')) return (
                      <p key={j} style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', marginBottom: '4px', color: 'inherit' }}>{line.replace(/\*\*/g, '')}</p>
                    );
                    if (line.startsWith('`') && line.includes('`')) return (
                      <code key={j} style={{ fontFamily: 'var(--ada-font-mono)', fontSize: 'var(--ada-fs-xs)', backgroundColor: msg.role === 'user' ? 'rgba(255,255,255,0.2)' : 'var(--ada-surface-3)', padding: '1px 4px', borderRadius: 3, color: 'inherit', display: 'block', marginBottom: '4px' }}>{line}</code>
                    );
                    if (line === '') return <div key={j} style={{ height: '8px' }} />;
                    return <p key={j} style={{ fontSize: 'var(--ada-fs-sm)', color: 'inherit', lineHeight: 1.6, marginBottom: '2px' }}>{line.replace(/\*\*/g, '')}</p>;
                  })}
                </div>
                <div className="flex items-center gap-2 mt-1.5 px-1">
                  <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>{msg.time}</span>
                  {msg.role === 'assistant' && (
                    <button style={{ color: 'var(--ada-text-4)' }}><Copy size={11} /></button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
              rows={2}
              className="flex-1 resize-none rounded-lg border px-4 py-3"
              style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)', fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)', outline: 'none', fontFamily: 'inherit' }}
            />
            <button onClick={send} className="px-4 py-2 rounded-lg self-end flex items-center gap-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)' }}>
              <Send size={14} /> Send
            </button>
          </div>
        </div>
      </div>

      {/* Right: Settings Panel */}
      <div className="w-56 border-l flex flex-col flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--ada-border-default)' }}>
          <Settings size={14} style={{ color: 'var(--ada-text-3)' }} />
          <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Parameters</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Temperature</span>
              <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-1)' }}>{temp}</span>
            </div>
            <input type="range" min={0} max={1} step={0.1} value={temp} onChange={e => setTemp(parseFloat(e.target.value))} className="w-full" style={{ accentColor: 'var(--ada-p-600)' }} />
            <div className="flex justify-between mt-1">
              <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>Precise</span>
              <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>Creative</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)' }}>Max Tokens</span>
              <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-1)' }}>{maxTokens.toLocaleString()}</span>
            </div>
            <input type="range" min={256} max={8192} step={256} value={maxTokens} onChange={e => setMaxTokens(parseInt(e.target.value))} className="w-full" style={{ accentColor: 'var(--ada-p-600)' }} />
          </div>
          <div>
            <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)', marginBottom: '6px' }}>System Prompt</div>
            <textarea
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              rows={5}
              className="w-full resize-none rounded border px-2.5 py-2"
              style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-1)', backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)', outline: 'none', lineHeight: 1.5, fontFamily: 'inherit' }}
            />
          </div>
          <div className="pt-2 border-t space-y-2" style={{ borderColor: 'var(--ada-border-default)' }}>
            {[
              { label: 'Stream output', value: streamOutput, setter: setStreamOutput },
              { label: 'Show reasoning', value: showReasoning, setter: setShowReasoning },
              { label: 'Web search', value: webSearch, setter: setWebSearch },
            ].map(({ label, value, setter }) => (
              <div key={label} className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{label}</span>
                <button onClick={() => setter(!value)} className="w-8 h-4 rounded-full relative transition-colors" style={{ backgroundColor: value ? 'var(--ada-p-600)' : 'var(--ada-surface-3)' }}>
                  <span className="absolute top-0.5 w-3 h-3 rounded-full transition-all" style={{ backgroundColor: 'white', left: value ? '18px' : '2px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}