import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Play, CheckCircle, Lock, Clock, Star, Users, BookOpen,
  ChevronRight, ChevronDown, Award, TrendingUp, ChartBar,
  ArrowLeft, Circle, Check,
} from 'lucide-react';

const courses = [
  { id: 'c1', title: 'React 18 Advanced Patterns', instructor: 'Sarah Chen', category: 'Frontend', duration: '8h 24m', lessons: 42, enrolled: 3241, rating: 4.9, progress: 72, thumbnail: '#2563eb' },
  { id: 'c2', title: 'System Design at Scale', instructor: 'James Wilson', category: 'Architecture', duration: '12h 10m', lessons: 58, enrolled: 5102, rating: 4.8, progress: 38, thumbnail: '#16a34a' },
  { id: 'c3', title: 'TypeScript Deep Dive', instructor: 'Marcus Reed', category: 'Languages', duration: '6h 45m', lessons: 34, enrolled: 7812, rating: 4.7, progress: 100, thumbnail: '#d97706' },
  { id: 'c4', title: 'PostgreSQL Performance Tuning', instructor: 'Aiko Tanaka', category: 'Database', duration: '5h 20m', lessons: 28, enrolled: 1890, rating: 4.6, progress: 0, thumbnail: '#0891b2' },
  { id: 'c5', title: 'CI/CD with GitHub Actions', instructor: 'James Wilson', category: 'DevOps', duration: '4h 50m', lessons: 24, enrolled: 4320, rating: 4.7, progress: 15, thumbnail: '#9333ea' },
  { id: 'c6', title: 'Accessibility & WCAG 2.1', instructor: 'Priya Patel', category: 'Design', duration: '3h 30m', lessons: 18, enrolled: 2103, rating: 4.9, progress: 0, thumbnail: '#ec4899' },
];

const lessons = [
  { id: 'l1', title: 'Introduction to Concurrent Features', duration: '12:40', status: 'done' },
  { id: 'l2', title: 'useTransition and startTransition', duration: '18:25', status: 'done' },
  { id: 'l3', title: 'Suspense Boundaries in Depth', duration: '22:10', status: 'current' },
  { id: 'l4', title: 'React Server Components (RSC)', duration: '31:05', status: 'locked' },
  { id: 'l5', title: 'Custom Hook Composition Patterns', duration: '25:18', status: 'locked' },
  { id: 'l6', title: 'Memoisation Strategies', duration: '19:42', status: 'locked' },
  { id: 'l7', title: 'Context Optimization', duration: '14:55', status: 'locked' },
  { id: 'l8', title: 'Module 1 Quiz', duration: '15:00', status: 'locked' },
];

const progressData = [
  { week: 'W1', mins: 90 }, { week: 'W2', mins: 140 }, { week: 'W3', mins: 60 },
  { week: 'W4', mins: 185 }, { week: 'W5', mins: 120 }, { week: 'W6', mins: 210 },
];

const quizQuestions = [
  {
    q: 'What is the primary benefit of useTransition in React 18?',
    options: [
      'It replaces useState for all state updates',
      'It marks updates as non-urgent, keeping the UI responsive',
      'It automatically memoises component renders',
      'It enables server-side state synchronisation',
    ],
    correct: 1,
  },
];

function ProgressRing({ pct, size = 48, stroke = 4, color = 'var(--ada-p-500)' }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ada-surface-3)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round" />
    </svg>
  );
}

export function LMSPage() {
  const [view, setView] = useState<'courses' | 'lesson' | 'quiz'>('courses');
  const [selectedLesson, setSelectedLesson] = useState('l3');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--ada-bg-base)' }}>
      {/* Header */}
      <div className="px-6 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
        <div className="flex items-center gap-3">
          {view !== 'courses' && (
            <button onClick={() => { setView('courses'); setSubmitted(false); setSelectedAnswer(null); }} className="flex items-center gap-1.5 mr-2" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>
              <ArrowLeft size={14} />
            </button>
          )}
          <h1 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>
            {view === 'courses' ? 'Learning Hub' : view === 'lesson' ? 'React 18 Advanced Patterns' : 'Module Quiz'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>
            <Award size={14} style={{ color: 'var(--ada-w-500)' }} />
            <span>1,240 XP</span>
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>
            <TrendingUp size={14} style={{ color: 'var(--ada-s-500)' }} />
            <span>12-day streak</span>
          </div>
        </div>
      </div>

      {view === 'courses' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Course Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-3 gap-4">
              {courses.map(course => (
                <div key={course.id} className="rounded-lg border overflow-hidden cursor-pointer group transition-all" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}
                  onClick={() => setView('lesson')}>
                  <div className="h-28 flex items-center justify-center relative" style={{ backgroundColor: course.thumbnail + '20' }}>
                    <BookOpen size={32} style={{ color: course.thumbnail }} />
                    {course.progress === 100 && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--ada-s-500)' }}>
                        <Check size={12} style={{ color: 'white' }} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', backgroundColor: 'var(--ada-p-50)', color: 'var(--ada-p-600)' }}>{course.category}</span>
                    <h3 style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginTop: '8px', marginBottom: '4px', lineHeight: 1.4 }}>{course.title}</h3>
                    <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginBottom: '12px' }}>by {course.instructor}</p>
                    <div className="flex items-center gap-3 mb-3" style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>
                      <span className="flex items-center gap-1"><Clock size={11} />{course.duration}</span>
                      <span className="flex items-center gap-1"><BookOpen size={11} />{course.lessons} lessons</span>
                      <span className="flex items-center gap-1"><Users size={11} />{course.enrolled.toLocaleString()}</span>
                    </div>
                    {course.progress > 0 && (
                      <div>
                        <div className="flex justify-between mb-1">
                          <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)' }}>Progress</span>
                          <span style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{course.progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-3)' }}>
                          <div className="h-full rounded-full" style={{ width: `${course.progress}%`, backgroundColor: course.progress === 100 ? 'var(--ada-s-500)' : 'var(--ada-p-500)' }} />
                        </div>
                      </div>
                    )}
                    {course.progress === 0 && (
                      <button className="w-full py-1.5 rounded border mt-1" style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', borderColor: 'var(--ada-p-300)', color: 'var(--ada-p-600)', backgroundColor: 'var(--ada-p-50)' }}>Start Course</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Progress */}
          <div className="w-64 border-l flex flex-col flex-shrink-0 overflow-y-auto" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
              <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Your Progress</span>
            </div>
            <div className="p-4 space-y-5">
              <div className="flex items-center gap-3">
                <ProgressRing pct={58} size={56} stroke={5} />
                <div>
                  <div style={{ fontSize: 'var(--ada-fs-lg)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>58%</div>
                  <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Overall completion</div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Courses completed', value: '1 / 6' },
                  { label: 'Lessons done', value: '148 / 204' },
                  { label: 'Quizzes passed', value: '12 / 18' },
                  { label: 'Total hours', value: '24h 10m' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{s.label}</span>
                    <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', fontFamily: 'var(--ada-font-mono)' }}>{s.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)', marginBottom: '8px' }}>Weekly Activity</div>
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart data={progressData} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--ada-text-3)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={false} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => [`${v} min`, 'Study time']} contentStyle={{ backgroundColor: 'var(--ada-surface-1)', border: '1px solid var(--ada-border-default)', borderRadius: 6, fontSize: 12 }} />
                    <Bar dataKey="mins" fill="var(--ada-p-400)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'lesson' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Video Player */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-shrink-0 bg-black flex items-center justify-center" style={{ height: '360px', backgroundColor: '#0a0a0a' }}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center mx-auto mb-3 cursor-pointer" style={{ borderColor: 'white' }}>
                  <Play size={24} style={{ color: 'white', marginLeft: '3px' }} />
                </div>
                <p style={{ color: '#aaa', fontSize: 'var(--ada-fs-sm)' }}>Suspense Boundaries in Depth</p>
                <p style={{ color: '#666', fontSize: 'var(--ada-fs-xs)', marginTop: '4px' }}>22:10</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <h2 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '8px' }}>Suspense Boundaries in Depth</h2>
              <div className="flex items-center gap-3 mb-4" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>
                <span className="flex items-center gap-1"><Clock size={12} /> 22:10</span>
                <span className="flex items-center gap-1"><BookOpen size={12} /> Module 1, Lesson 3</span>
              </div>
              <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-2)', lineHeight: 1.7 }}>
                In this lesson we explore how Suspense boundaries integrate with React 18's concurrent rendering model. We cover error boundaries, loading states, and how to orchestrate multiple data fetchers.
              </p>
              <button onClick={() => setView('quiz')} className="mt-5 flex items-center gap-2 px-4 py-2 rounded" style={{ backgroundColor: 'var(--ada-btn-primary-bg)', color: 'var(--ada-btn-primary-text)', fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-medium)' }}>
                Take Module Quiz <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Lesson TOC */}
          <div className="w-72 border-l flex flex-col flex-shrink-0" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-2)' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--ada-border-default)' }}>
              <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>Module 1 — Concurrent React</div>
              <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', marginTop: '2px' }}>2 / 8 completed</div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {lessons.map((l, i) => (
                <button key={l.id} onClick={() => l.status !== 'locked' && setSelectedLesson(l.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md" style={{
                  backgroundColor: l.id === selectedLesson ? 'var(--ada-p-50)' : 'transparent',
                  opacity: l.status === 'locked' ? 0.5 : 1,
                  cursor: l.status === 'locked' ? 'not-allowed' : 'pointer',
                }}>
                  <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: l.status === 'done' ? 'var(--ada-s-500)' : l.status === 'current' ? 'var(--ada-p-600)' : 'var(--ada-surface-3)' }}>
                    {l.status === 'done' ? <Check size={10} style={{ color: 'white' }} /> : l.status === 'locked' ? <Lock size={9} style={{ color: 'var(--ada-text-4)' }} /> : <Play size={9} style={{ color: 'white', marginLeft: '1px' }} />}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: l.id === selectedLesson ? 'var(--ada-fw-semibold)' : 'var(--ada-fw-regular)', color: l.id === selectedLesson ? 'var(--ada-p-700)' : 'var(--ada-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                  </div>
                  <span style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)', flexShrink: 0 }}>{l.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'quiz' && (
        <div className="flex-1 overflow-y-auto flex items-start justify-center p-10">
          <div className="w-full max-w-xl">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>Question 1 of 5</span>
                <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)' }}>14:23 remaining</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--ada-surface-3)' }}>
                <div className="h-full rounded-full" style={{ width: '20%', backgroundColor: 'var(--ada-p-500)' }} />
              </div>
            </div>
            <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--ada-surface-1)', borderColor: 'var(--ada-border-default)' }}>
              <h2 style={{ fontSize: 'var(--ada-fs-lg)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '24px', lineHeight: 1.5 }}>{quizQuestions[0].q}</h2>
              <div className="space-y-3">
                {quizQuestions[0].options.map((opt, i) => {
                  const isSelected = selectedAnswer === i;
                  const isCorrect = i === quizQuestions[0].correct;
                  let bg = 'var(--ada-surface-2)';
                  let border = 'var(--ada-border-default)';
                  if (submitted && isSelected && isCorrect) { bg = 'var(--ada-bg-success)'; border = 'var(--ada-s-500)'; }
                  else if (submitted && isSelected && !isCorrect) { bg = 'var(--ada-bg-error)'; border = 'var(--ada-e-500)'; }
                  else if (submitted && isCorrect) { bg = 'var(--ada-bg-success)'; border = 'var(--ada-s-500)'; }
                  else if (isSelected) { bg = 'var(--ada-p-50)'; border = 'var(--ada-p-400)'; }
                  return (
                    <button key={i} onClick={() => !submitted && setSelectedAnswer(i)} disabled={submitted} className="w-full text-left px-4 py-3 rounded-lg border transition-all" style={{ backgroundColor: bg, borderColor: border }}>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: isSelected ? 'var(--ada-p-600)' : 'var(--ada-border-strong)', backgroundColor: isSelected ? 'var(--ada-p-600)' : 'transparent' }}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                        <span style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-1)' }}>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {!submitted ? (
                <button onClick={() => selectedAnswer !== null && setSubmitted(true)} disabled={selectedAnswer === null} className="mt-6 w-full py-3 rounded-lg" style={{ backgroundColor: selectedAnswer !== null ? 'var(--ada-btn-primary-bg)' : 'var(--ada-disabled-bg)', color: selectedAnswer !== null ? 'var(--ada-btn-primary-text)' : 'var(--ada-text-4)', fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', cursor: selectedAnswer !== null ? 'pointer' : 'not-allowed' }}>
                  Submit Answer
                </button>
              ) : (
                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: selectedAnswer === quizQuestions[0].correct ? 'var(--ada-bg-success)' : 'var(--ada-bg-error)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    {selectedAnswer === quizQuestions[0].correct ? <CheckCircle size={16} style={{ color: 'var(--ada-text-success)' }} /> : <Circle size={16} style={{ color: 'var(--ada-text-error)' }} />}
                    <span style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: selectedAnswer === quizQuestions[0].correct ? 'var(--ada-text-success)' : 'var(--ada-text-error)' }}>
                      {selectedAnswer === quizQuestions[0].correct ? 'Correct!' : 'Incorrect'}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-2)' }}>useTransition marks state updates as non-urgent transitions, allowing React to keep the UI responsive while processing them in the background.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}