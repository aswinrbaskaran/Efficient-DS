import { useState } from 'react';
import { ActionsSection } from '../components/sections/ActionsSection';
import { FormsSection } from '../components/sections/FormsSection';
import { DisplaySection } from '../components/sections/DisplaySection';
import { OverlaysSection } from '../components/sections/OverlaysSection';
import { FeedbackSection } from '../components/sections/FeedbackSection';
import { NavigationSection } from '../components/sections/NavigationSection';
import { DataSection } from '../components/sections/DataSection';
import { LayoutSection } from '../components/sections/LayoutSection';

const TABS: { id: string; label: string; count: number; desc: string }[] = [
  { id: 'actions',    label: 'Actions',    count: 6,  desc: 'Button · Button Group · Toggle · Toggle Group · Kbd · Label' },
  { id: 'forms',      label: 'Forms',      count: 14, desc: 'Input · Input Group · OTP · Textarea · Field · Checkbox · Radio · Switch · Slider · Select · Combobox · Calendar · Date Picker' },
  { id: 'display',    label: 'Display',    count: 9,  desc: 'Avatar · Badge · Card · Aspect Ratio · Progress · Skeleton · Spinner · Empty State · Separator' },
  { id: 'overlays',   label: 'Overlays',   count: 10, desc: 'Dialog · Alert Dialog · Drawer · Sheet · Popover · Hover Card · Dropdown · Context Menu · Tooltip · Command Palette' },
  { id: 'feedback',   label: 'Feedback',   count: 3,  desc: 'Alert · Toast · Sonner-style Notifications' },
  { id: 'navigation', label: 'Navigation', count: 6,  desc: 'Breadcrumb · Pagination · Tabs · Navigation Menu · Menubar · Sidebar' },
  { id: 'data',       label: 'Data',       count: 7,  desc: 'Table · Data Table · Accordion · Collapsible · Carousel · Chart Container · Scroll Area' },
  { id: 'layout',     label: 'Layout',     count: 3,  desc: 'Resizable Panels · Direction Wrapper · Item List Pattern' },
];

export function ComponentsPage() {
  const [tab, setTab] = useState('actions');
  const active = TABS.find(t => t.id === tab)!;

  return (
    <div style={{ backgroundColor: 'var(--ada-bg-base)', minHeight: '100%' }}>
      {/* Page Header */}
      <div className="px-8 pt-8 pb-0">
        <h1 style={{ fontSize: 'var(--ada-fs-3xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>
          Components
        </h1>
        <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)', marginBottom: '20px' }}>
          58 components · All states · WCAG AA · Light / Dark / High-Contrast
        </p>

        {/* Component count strips */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          {[
            { label: 'Total components', value: '58' },
            { label: 'Interaction states', value: '7' },
            { label: 'Themes', value: '3' },
            { label: 'ARIA patterns', value: 'Full' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
              <span style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)' }}>{stat.value}</span>
              <span style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Bar — sticky */}
      <div
        className="sticky top-0 z-10 px-8 border-b overflow-x-auto"
        style={{ backgroundColor: 'var(--ada-bg-base)', borderColor: 'var(--ada-border-default)' }}
      >
        <div className="flex gap-0" role="tablist" aria-label="Component categories">
          {TABS.map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className="relative flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ada-focus-ring)]"
              style={{
                fontSize: 'var(--ada-fs-sm)',
                fontWeight: tab === t.id ? 'var(--ada-fw-semibold)' : 'var(--ada-fw-regular)',
                color: tab === t.id ? 'var(--ada-p-600)' : 'var(--ada-text-3)',
                borderColor: tab === t.id ? 'var(--ada-p-600)' : 'transparent',
                marginBottom: '-1px',
              }}
            >
              {t.label}
              <span
                className="px-1.5 rounded-full"
                style={{
                  fontSize: 'var(--ada-fs-2xs)',
                  fontWeight: 'var(--ada-fw-semibold)',
                  backgroundColor: tab === t.id ? 'var(--ada-p-100)' : 'var(--ada-surface-3)',
                  color: tab === t.id ? 'var(--ada-p-700)' : 'var(--ada-text-4)',
                }}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Section description */}
      <div className="px-8 pt-4 pb-2">
        <p style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)' }}>
          {active.desc}
        </p>
      </div>

      {/* Section content */}
      <div
        id={`panel-${tab}`}
        role="tabpanel"
        aria-label={active.label}
        className="px-8 pt-6 pb-16"
      >
        {tab === 'actions'    && <ActionsSection />}
        {tab === 'forms'      && <FormsSection />}
        {tab === 'display'    && <DisplaySection />}
        {tab === 'overlays'   && <OverlaysSection />}
        {tab === 'feedback'   && <FeedbackSection />}
        {tab === 'navigation' && <NavigationSection />}
        {tab === 'data'       && <DataSection />}
        {tab === 'layout'     && <LayoutSection />}
      </div>
    </div>
  );
}
