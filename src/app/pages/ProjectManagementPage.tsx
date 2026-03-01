import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Plus, MoreHorizontal, CheckCircle, Circle, Clock, AlertCircle,
  User, Calendar, Tag, Filter, Search, ChevronRight, X, Flag,
  Layers, Zap, ArrowUpRight,
} from 'lucide-react';

const sprint = { name: 'Sprint 24', start: 'Feb 24', end: 'Mar 7', velocity: 42, completed: 31, remaining: 11 };

const columns = [
  {
    id: 'backlog', label: 'Backlog', color: 'var(--ada-n-400)',
    tasks: [
      { id: 'T-112', title: 'Implement OAuth2 refresh token rotation', priority: 'high', assignee: 'AK', points: 5, label: 'auth' },
      { id: 'T-113', title: 'Add CSV export to analytics reports', priority: 'medium', assignee: 'SL', points: 3, label: 'feature' },
      { id: 'T-114', title: 'Migrate legacy user table to new schema', priority: 'low', assignee: '', points: 8, label: 'backend' },
    ],
  },
  {
    id: 'todo', label: 'To Do', color: 'var(--ada-p-400)',
    tasks: [
      { id: 'T-108', title: 'Design new onboarding flow mockups', priority: 'high', assignee: 'MR', points: 5, label: 'design' },
      { id: 'T-109', title: 'Write unit tests for payment module', priority: 'medium', assignee: 'JP', points: 3, label: 'testing' },
    ],
  },
  {
    id: 'inprogress', label: 'In Progress', color: 'var(--ada-w-500)',
    tasks: [
      { id: 'T-103', title: 'Refactor dashboard data fetching layer', priority: 'high', assignee: 'AK', points: 8, label: 'backend' },
      { id: 'T-104', title: 'Fix timezone bug in calendar component', priority: 'high', assignee: 'MR', points: 2, label: 'bug' },
      { id: 'T-105', title: 'Update design tokens for dark mode', priority: 'medium', assignee: 'SL', points: 3, label: 'design' },
    ],
  },
  {
    id: 'review', label: 'In Review', color: 'var(--ada-i-500)',
    tasks: [
      { id: 'T-100', title: 'Implement real-time notifications', priority: 'high', assignee: 'JP', points: 13, label: 'feature' },
      { id: 'T-101', title: 'Add keyboard shortcuts to editor', priority: 'low', assignee: 'AK', points: 5, label: 'feature' },
    ],
  },
  {
    id: 'done', label: 'Done', color: 'var(--ada-s-500)',
    tasks: [
      { id: 'T-095', title: 'Launch API rate limiting v2', priority: 'high', assignee: 'JP', points: 8, label: 'backend' },
      { id: 'T-096', title: 'Accessibility audit — WCAG AA pass', priority: 'medium', assignee: 'SL', points: 5, label: 'a11y' },
      { id: 'T-097', title: 'Update third-party dependencies', priority: 'low', assignee: 'MR', points: 2, label: 'maintenance' },
    ],
  },
];

const workloadData = [
  { name: 'AK', tasks: 3, points: 18 },
  { name: 'MR', tasks: 4, points: 12 },
  { name: 'SL', tasks: 3, points: 11 },
  { name: 'JP', tasks: 3, points: 24 },
];

const priorityColors: Record<string, string> = {
  high: 'var(--ada-text-error)',
  medium: 'var(--ada-text-warning)',
  low: 'var(--ada-text-3)',
};
const labelColors: Record<string, string> = {
  auth: 'var(--ada-p-100)',
  feature: 'var(--ada-s-100)',
  backend: 'var(--ada-w-100)',
  design: '#f3e8ff',
  testing: 'var(--ada-i-100)',
  bug: 'var(--ada-e-100)',
  a11y: 'var(--ada-s-100)',
  maintenance: 'var(--ada-n-100)',
};
const labelTextColors: Record<string, string> = {
  auth: 'var(--ada-p-700)',
  feature: 'var(--ada-s-700)',
  backend: 'var(--ada-w-700)',
  design: '#7e22ce',
  testing: 'var(--ada-i-700)',
  bug: 'var(--ada-e-700)',
  a11y: 'var(--ada-s-700)',
  maintenance: 'var(--ada-n-700)',
};

function PriorityIcon({ p }: { p: string }) {
  if (p === 'high') return <Flag size={10} style={{ color: priorityColors[p], fill: priorityColors[p] }} />;
  if (p === 'medium') return <Flag size={10} style={{ color: priorityColors[p] }} />;
  return <Flag size={10} style={{ color: priorityColors[p] }} />;
}

export function ProjectManagementPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const sprintPct = Math.round((sprint.completed / (sprint.completed + sprint.remaining)) * 100);

  const flatTasks = columns.flatMap(c => c.tasks);
  const selectedTaskData = flatTasks.find(t => t.id === selectedTask);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* Sprint Header */}
      <div className="px-6 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <h1 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{sprint.name}</h1>
            <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{sprint.start} – {sprint.end}</span>
            <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: 'var(--ada-bg-success)', color: 'var(--ada-text-success)' }}>Active</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 text-xs">
              <div className="text-center">
                <div style={{ fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', fontFamily: 'var(--ada-font-mono)' }}>{sprint.velocity}</div>
                <div style={{ color: 'var(--ada-text-4)' }}>velocity</div>
              </div>
              <div className="text-center">
                <div style={{ fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-success)', fontFamily: 'var(--ada-font-mono)' }}>{sprint.completed}</div>
                <div style={{ color: 'var(--ada-text-4)' }}>done</div>
              </div>
              <div className="text-center">
                <div style={{ fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-warning)', fontFamily: 'var(--ada-font-mono)' }}>{sprint.remaining}</div>
                <div style={{ color: 'var(--ada-text-4)' }}>remaining</div>
              </div>
            </div>
            <div className="w-32">
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)' }}>Progress</span>
                <span style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{sprintPct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-3)' }}>
                <div className="h-full rounded-full" style={{ width: `${sprintPct}%`, backgroundColor: 'var(--ada-s-500)' }} />
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)' }}>
              <Plus size={13} /> Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-3 h-full" style={{ minWidth: 'max-content' }}>
            {columns.map(col => (
              <div key={col.id} className="flex flex-col rounded-lg border" style={{ width: '240px', backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
                <div className="px-3 py-2.5 border-b flex items-center gap-2" style={{ borderColor: 'var(--ada-border-default)' }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: col.color }} />
                  <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{col.label}</span>
                  <span className="ml-auto px-1.5 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-surface-3)', color: 'var(--ada-text-3)' }}>{col.tasks.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {col.tasks.map(task => (
                    <button key={task.id} onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)} className="w-full text-left p-3 rounded-md border transition-all" style={{
                      backgroundColor: selectedTask === task.id ? 'var(--ada-p-50)' : 'var(--ada-surface-1)',
                      borderColor: selectedTask === task.id ? 'var(--ada-p-300)' : 'var(--ada-border-default)',
                    }}>
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)', lineHeight: 1.4 }}>{task.title}</span>
                        <PriorityIcon p={task.priority} />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: labelColors[task.label] || 'var(--ada-surface-3)', color: labelTextColors[task.label] || 'var(--ada-text-3)' }}>{task.label}</span>
                        <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>{task.id}</span>
                        <div className="ml-auto flex items-center gap-1.5">
                          {task.assignee && (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ada-p-100)', color: 'var(--ada-p-700)', fontSize: '9px', fontWeight: 'var(--ada-fw-bold)' }}>{task.assignee}</div>
                          )}
                          <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 'var(--ada-fs-2xs)', backgroundColor: 'var(--ada-surface-3)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)' }}>{task.points}pt</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Task Detail or Workload */}
        <div className="w-72 border-l flex flex-col flex-shrink-0 overflow-y-auto" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
          {selectedTaskData ? (
            <>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--ada-border-default)' }}>
                <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Task Detail</span>
                <button onClick={() => setSelectedTask(null)} style={{ color: 'var(--ada-text-3)' }}><X size={14} /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>{selectedTaskData.id}</span>
                  <h3 style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginTop: '4px', lineHeight: 1.4 }}>{selectedTaskData.title}</h3>
                </div>
                {[
                  { label: 'Assignee', value: selectedTaskData.assignee || 'Unassigned' },
                  { label: 'Priority', value: selectedTaskData.priority },
                  { label: 'Story Points', value: `${selectedTaskData.points} pts` },
                  { label: 'Label', value: selectedTaskData.label },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{f.label}</span>
                    <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)', textTransform: 'capitalize' }}>{f.value}</span>
                  </div>
                ))}
                <div className="pt-3 border-t" style={{ borderColor: 'var(--ada-border-default)' }}>
                  <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', marginBottom: '8px' }}>Description</div>
                  <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)', lineHeight: 1.6 }}>
                    Implementation required for the upcoming Q1 release. Coordinate with the platform team before merging. Add test coverage above 80%.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
                <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Workload Overview</span>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={workloadData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                    <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--ada-text-2)' }} axisLine={false} tickLine={false} width={28} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--ada-surface-1)', border: '1px solid var(--ada-border-default)', borderRadius: 6, fontSize: 12 }} />
                    <Bar dataKey="points" fill="var(--ada-p-400)" radius={[0, 3, 3, 0]} name="Story Points" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {workloadData.map(m => (
                    <div key={m.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ada-p-100)', color: 'var(--ada-p-700)', fontSize: '10px', fontWeight: 'var(--ada-fw-bold)' }}>{m.name}</div>
                        <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>{m.tasks} tasks</span>
                      </div>
                      <span style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: m.points > 20 ? 'var(--ada-text-error)' : 'var(--ada-text-2)' }}>{m.points}pt</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
