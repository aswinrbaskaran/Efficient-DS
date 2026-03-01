import { useState } from 'react';

/* ─── Color Swatch ─────────────────────────────────── */
function Swatch({ token, hex, textDark = false }: { token: string; hex: string; textDark?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(hex); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
      className="group text-left rounded overflow-hidden border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ada-focus-ring)]"
      style={{ borderColor: 'var(--ada-border-default)' }}
      title={`Copy ${hex}`}
    >
      <div className="h-10 w-full" style={{ backgroundColor: hex }} />
      <div className="px-2 py-1.5" style={{ backgroundColor: 'var(--ada-surface-1)' }}>
        <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-1)', fontFamily: 'var(--ada-font-mono)' }}>
          {token}
        </div>
        <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)' }}>
          {copied ? 'Copied!' : hex}
        </div>
      </div>
    </button>
  );
}

function ColorRow({ name, swatches }: { name: string; swatches: { stop: string; token: string; hex: string }[] }) {
  return (
    <div className="mb-6">
      <div style={{ fontSize: 'var(--ada-fs-sm)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '8px' }}>
        {name}
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${swatches.length}, 1fr)` }}>
        {swatches.map(s => <Swatch key={s.stop} token={s.stop} hex={s.hex} />)}
      </div>
    </div>
  );
}

/* ─── Section Header ────────────────────────────────── */
function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <h2 style={{ fontSize: 'var(--ada-fs-xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '4px' }}>{title}</h2>
      {desc && <p style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-text-3)' }}>{desc}</p>}
    </div>
  );
}

function Divider() {
  return <hr className="my-12" style={{ borderColor: 'var(--ada-border-default)', borderTopWidth: '1px' }} />;
}

/* ─── Typography Row ───────────────────────────────── */
function TypeRow({ label, size, weight, sampleText }: { label: string; size: string; weight?: string; sampleText?: string }) {
  return (
    <div className="flex items-baseline gap-6 py-4 border-b" style={{ borderColor: 'var(--ada-border-subtle)' }}>
      <div className="w-36 flex-shrink-0">
        <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)' }}>{label}</div>
        <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)', marginTop: '2px' }}>{size}{weight ? ` / ${weight}` : ''}</div>
      </div>
      <div style={{ fontSize: size, fontWeight: weight || '400', color: 'var(--ada-text-1)', lineHeight: 1.3 }}>
        {sampleText || 'The quick brown fox jumps'}
      </div>
    </div>
  );
}

/* ─── Spacing Row ──────────────────────────────────── */
function SpaceRow({ token, px, label }: { token: string; px: number; label: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="w-28" style={{ fontSize: 'var(--ada-fs-xs)', fontFamily: 'var(--ada-font-mono)', color: 'var(--ada-text-3)' }}>{token}</div>
      <div className="w-10 text-right" style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-4)', fontFamily: 'var(--ada-font-mono)' }}>{px}px</div>
      <div className="h-5 rounded" style={{ width: `${Math.min(px * 2, 320)}px`, minWidth: '4px', backgroundColor: 'var(--ada-p-400)' }} />
      <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{label}</div>
    </div>
  );
}

/* ─── Shadow Card ──────────────────────────────────── */
function ShadowCard({ level, css }: { level: string; css: string }) {
  return (
    <div className="flex flex-col items-center gap-3 p-5">
      <div className="w-20 h-20 rounded-lg" style={{ backgroundColor: 'var(--ada-surface-1)', boxShadow: css, border: '1px solid var(--ada-border-subtle)' }} />
      <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-2)', fontFamily: 'var(--ada-font-mono)' }}>{level}</div>
    </div>
  );
}

export function FoundationsPage() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <div className="mb-10">
        <h1 style={{ fontSize: 'var(--ada-fs-3xl)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '6px' }}>Foundations</h1>
        <p style={{ fontSize: 'var(--ada-fs-base)', color: 'var(--ada-text-3)' }}>The primitive design decisions that underpin the entire system.</p>
      </div>

      {/* ── Color System ───────────────────────────────────── */}
      <section id="colors">
        <SectionHeader title="Color System" desc="Click any swatch to copy its hex value. All semantic text colors meet WCAG AA (4.5:1 for normal text)." />

        <ColorRow name="Neutral — Slate" swatches={[
          { stop: '50', token: '--ada-n-50', hex: '#f8fafc' },
          { stop: '100', token: '--ada-n-100', hex: '#f1f5f9' },
          { stop: '200', token: '--ada-n-200', hex: '#e2e8f0' },
          { stop: '300', token: '--ada-n-300', hex: '#cbd5e1' },
          { stop: '400', token: '--ada-n-400', hex: '#94a3b8' },
          { stop: '500', token: '--ada-n-500', hex: '#64748b' },
          { stop: '600', token: '--ada-n-600', hex: '#475569' },
          { stop: '700', token: '--ada-n-700', hex: '#334155' },
          { stop: '800', token: '--ada-n-800', hex: '#1e293b' },
          { stop: '900', token: '--ada-n-900', hex: '#0f172a' },
          { stop: '950', token: '--ada-n-950', hex: '#020617' },
        ]} />

        <ColorRow name="Primary — Enterprise Blue" swatches={[
          { stop: '50', token: '--ada-p-50', hex: '#eff6ff' },
          { stop: '100', token: '--ada-p-100', hex: '#dbeafe' },
          { stop: '200', token: '--ada-p-200', hex: '#bfdbfe' },
          { stop: '300', token: '--ada-p-300', hex: '#93c5fd' },
          { stop: '400', token: '--ada-p-400', hex: '#60a5fa' },
          { stop: '500', token: '--ada-p-500', hex: '#3b82f6' },
          { stop: '600', token: '--ada-p-600', hex: '#2563eb' },
          { stop: '700', token: '--ada-p-700', hex: '#1d4ed8' },
          { stop: '800', token: '--ada-p-800', hex: '#1e40af' },
          { stop: '900', token: '--ada-p-900', hex: '#1e3a8a' },
          { stop: '950', token: '--ada-p-950', hex: '#172554' },
        ]} />

        <div className="grid grid-cols-4 gap-6">
          <div>
            <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '8px' }}>Success — Green</div>
            {[
              { stop: '50', hex: '#f0fdf4' }, { stop: '100', hex: '#dcfce7' }, { stop: '200', hex: '#bbf7d0' },
              { stop: '500', hex: '#22c55e' }, { stop: '600', hex: '#16a34a' }, { stop: '700', hex: '#15803d' },
            ].map(s => <Swatch key={s.stop} token={s.stop} hex={s.hex} />)}
          </div>
          <div>
            <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '8px' }}>Warning — Amber</div>
            {[
              { stop: '50', hex: '#fffbeb' }, { stop: '100', hex: '#fef3c7' }, { stop: '200', hex: '#fde68a' },
              { stop: '500', hex: '#f59e0b' }, { stop: '600', hex: '#d97706' }, { stop: '700', hex: '#b45309' },
            ].map(s => <Swatch key={s.stop} token={s.stop} hex={s.hex} />)}
          </div>
          <div>
            <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '8px' }}>Error — Red</div>
            {[
              { stop: '50', hex: '#fef2f2' }, { stop: '100', hex: '#fee2e2' }, { stop: '200', hex: '#fecaca' },
              { stop: '500', hex: '#ef4444' }, { stop: '600', hex: '#dc2626' }, { stop: '700', hex: '#b91c1c' },
            ].map(s => <Swatch key={s.stop} token={s.stop} hex={s.hex} />)}
          </div>
          <div>
            <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', marginBottom: '8px' }}>Info — Cyan</div>
            {[
              { stop: '50', hex: '#ecfeff' }, { stop: '100', hex: '#cffafe' }, { stop: '200', hex: '#a5f3fc' },
              { stop: '500', hex: '#06b6d4' }, { stop: '600', hex: '#0891b2' }, { stop: '700', hex: '#0e7490' },
            ].map(s => <Swatch key={s.stop} token={s.stop} hex={s.hex} />)}
          </div>
        </div>

        {/* Semantic Tokens */}
        <div className="mt-8 rounded-lg border overflow-hidden" style={{ borderColor: 'var(--ada-border-default)' }}>
          <div className="px-4 py-2.5 border-b" style={{ backgroundColor: 'var(--ada-surface-2)', borderColor: 'var(--ada-border-default)' }}>
            <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Semantic Color Tokens
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x" style={{ divideColor: 'var(--ada-border-default)' }}>
            {[
              { cat: 'Backgrounds', items: [['--ada-bg-base', 'White base'], ['--ada-bg-subtle', 'Subtle tint'], ['--ada-bg-muted', 'Muted fill'], ['--ada-bg-success', 'Success fill'], ['--ada-bg-warning', 'Warning fill'], ['--ada-bg-error', 'Error fill'], ['--ada-bg-info', 'Info fill']] },
              { cat: 'Borders', items: [['--ada-border-subtle', 'Subtle divider'], ['--ada-border-default', 'Default border'], ['--ada-border-strong', 'Strong border'], ['--ada-border-success', 'Success border'], ['--ada-border-warning', 'Warning border'], ['--ada-border-error', 'Error border'], ['--ada-border-info', 'Info border']] },
              { cat: 'Text', items: [['--ada-text-1', 'Primary text'], ['--ada-text-2', 'Secondary text'], ['--ada-text-3', 'Muted text'], ['--ada-text-4', 'Placeholder'], ['--ada-text-success', 'Success text'], ['--ada-text-warning', 'Warning text'], ['--ada-text-error', 'Error text']] },
            ].map(group => (
              <div key={group.cat} className="p-4">
                <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  {group.cat}
                </div>
                {group.items.map(([token, desc]) => (
                  <div key={token} className="flex items-center gap-2 py-1">
                    <div className="w-3 h-3 rounded-sm border flex-shrink-0" style={{ backgroundColor: `var(${token})`, borderColor: 'var(--ada-border-strong)' }} />
                    <div style={{ fontFamily: 'var(--ada-font-mono)', fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-2)' }}>{token}</div>
                    <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-4)' }}>{desc}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── Typography ─────────────────────────────────────── */}
      <section id="typography">
        <SectionHeader title="Typography Scale" desc="Built on Inter for UI and JetBrains Mono for code. Base size: 14px (dense developer tool sizing)." />

        <div className="mb-6">
          <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Display / Headings</div>
          {[
            { label: 'H1 / Display', size: 'var(--ada-fs-5xl)', weight: '600', text: 'Dashboard Overview' },
            { label: 'H2 / Section', size: 'var(--ada-fs-4xl)', weight: '600', text: 'User Management' },
            { label: 'H3 / Subsection', size: 'var(--ada-fs-3xl)', weight: '600', text: 'Recent Activity' },
            { label: 'H4 / Card Title', size: 'var(--ada-fs-xl)', weight: '600', text: 'API Endpoints' },
            { label: 'H5 / Label Lg', size: 'var(--ada-fs-base)', weight: '600', text: 'Configuration' },
            { label: 'H6 / Label', size: 'var(--ada-fs-xs)', weight: '600', text: 'SECTION HEADER' },
          ].map(r => (
            <div key={r.label} className="flex items-baseline gap-6 py-3 border-b" style={{ borderColor: 'var(--ada-border-subtle)' }}>
              <div className="w-32 flex-shrink-0">
                <div style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)' }}>{r.label}</div>
              </div>
              <div style={{ fontSize: r.size, fontWeight: r.weight, color: 'var(--ada-text-1)', lineHeight: 1.3 }}>{r.text}</div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Body & Caption</div>
          {[
            { label: 'Body Large', size: 'var(--ada-fs-lg)', weight: '400', text: 'The design system uses a structured 8pt grid for all spacing decisions.' },
            { label: 'Body Base', size: 'var(--ada-fs-base)', weight: '400', text: 'The design system uses a structured 8pt grid for all spacing decisions.' },
            { label: 'Body Small', size: 'var(--ada-fs-sm)', weight: '400', text: 'The design system uses a structured 8pt grid for all spacing decisions.' },
            { label: 'Caption', size: 'var(--ada-fs-xs)', weight: '400', text: 'Last updated 2 minutes ago · 14,321 events' },
            { label: 'Caption XS', size: 'var(--ada-fs-2xs)', weight: '500', text: 'BADGE · OVERLINE · MICRO LABEL' },
          ].map(r => (
            <div key={r.label} className="flex items-start gap-6 py-3 border-b" style={{ borderColor: 'var(--ada-border-subtle)' }}>
              <div className="w-32 flex-shrink-0 pt-0.5">
                <div style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)' }}>{r.label}</div>
              </div>
              <div style={{ fontSize: r.size, fontWeight: r.weight, color: 'var(--ada-text-1)', lineHeight: 1.5 }}>{r.text}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Monospace — JetBrains Mono</div>
          {[
            { label: 'Code Base', sample: 'const server = createServer({ port: 3000 });' },
            { label: 'Code Small', sample: 'git commit -m "feat: add authentication middleware"' },
            { label: 'Token', sample: '--ada-primary-600: #2563eb' },
          ].map(r => (
            <div key={r.label} className="flex items-start gap-6 py-3 border-b" style={{ borderColor: 'var(--ada-border-subtle)' }}>
              <div className="w-32 flex-shrink-0 pt-0.5">
                <div style={{ fontSize: 'var(--ada-fs-2xs)', fontWeight: 'var(--ada-fw-medium)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)' }}>{r.label}</div>
              </div>
              <code style={{ fontSize: 'var(--ada-fs-sm)', color: 'var(--ada-p-600)', fontFamily: 'var(--ada-font-mono)' }}>{r.sample}</code>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── Spacing ────────────────────────────────────────── */}
      <section id="spacing">
        <SectionHeader title="Spacing Scale" desc="Built on an 8pt grid. Every spacing value is a multiple of 4px, giving the system visual rhythm and consistency." />
        <div className="p-5 rounded-lg border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
          {[
            { token: '--ada-sp-1', px: 4, label: 'Micro gap — icon to text' },
            { token: '--ada-sp-2', px: 8, label: 'Small gap — form fields' },
            { token: '--ada-sp-3', px: 12, label: 'Inner padding — compact' },
            { token: '--ada-sp-4', px: 16, label: 'Inner padding — default' },
            { token: '--ada-sp-5', px: 20, label: 'Section padding — tight' },
            { token: '--ada-sp-6', px: 24, label: 'Section padding — default' },
            { token: '--ada-sp-8', px: 32, label: 'Card padding' },
            { token: '--ada-sp-10', px: 40, label: 'Section gap' },
            { token: '--ada-sp-12', px: 48, label: 'Block gap' },
            { token: '--ada-sp-16', px: 64, label: 'Page section gap' },
            { token: '--ada-sp-20', px: 80, label: 'Hero padding' },
            { token: '--ada-sp-24', px: 96, label: 'Page margin' },
          ].map(s => <SpaceRow key={s.token} {...s} />)}
        </div>
      </section>

      <Divider />

      {/* ── Border Radius ──────────────────────────────────── */}
      <section id="radius">
        <SectionHeader title="Border Radius" desc="Purposefully minimal — designed for dense, professional interfaces." />
        <div className="flex gap-6 flex-wrap">
          {[
            { name: 'None', token: '--ada-radius-none', px: '0px' },
            { name: 'XS', token: '--ada-radius-xs', px: '2px' },
            { name: 'SM', token: '--ada-radius-sm', px: '4px' },
            { name: 'MD', token: '--ada-radius-md', px: '6px' },
            { name: 'LG', token: '--ada-radius-lg', px: '8px' },
            { name: 'XL', token: '--ada-radius-xl', px: '12px' },
            { name: '2XL', token: '--ada-radius-2xl', px: '16px' },
            { name: 'Full', token: '--ada-radius-full', px: '9999px' },
          ].map(r => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 border-2" style={{ borderColor: 'var(--ada-p-400)', borderRadius: r.px, backgroundColor: 'var(--ada-p-50)' }} />
              <div style={{ fontSize: 'var(--ada-fs-xs)', fontWeight: 'var(--ada-fw-semibold)', color: 'var(--ada-text-1)', textAlign: 'center' }}>{r.name}</div>
              <div style={{ fontSize: 'var(--ada-fs-2xs)', color: 'var(--ada-text-3)', fontFamily: 'var(--ada-font-mono)', textAlign: 'center' }}>{r.px}</div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── Elevation ──────────────────────────────────────── */}
      <section id="elevation">
        <SectionHeader title="Elevation & Shadows" desc="Subtle shadows that convey depth without distraction." />
        <div className="flex gap-6 p-8 rounded-lg" style={{ backgroundColor: 'var(--ada-bg-muted)' }}>
          {[
            { level: 'shadow-0', css: 'none' },
            { level: 'shadow-1', css: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
            { level: 'shadow-2', css: '0 1px 3px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.10)' },
            { level: 'shadow-3', css: '0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)' },
            { level: 'shadow-4', css: '0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10)' },
            { level: 'shadow-modal', css: '0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.10)' },
          ].map(s => <ShadowCard key={s.level} {...s} />)}
        </div>
      </section>

      <Divider />

      {/* ── Focus States ───────────────────────────────────── */}
      <section id="focus">
        <SectionHeader title="Focus States" desc="Visible focus rings are required for WCAG 2.4.7. Every interactive element in Efficient Design System has a 2px ring with 2px offset." />
        <div className="flex gap-4 flex-wrap">
          {[
            { label: 'Button Focus', el: <button className="px-4 py-2 rounded border" style={{ outline: '2px solid var(--ada-focus-ring)', outlineOffset: '2px', backgroundColor: 'var(--ada-btn-primary-bg)', color: 'white', borderColor: 'transparent' }}>Submit</button> },
            { label: 'Input Focus', el: <input readOnly value="Focus example" className="px-3 py-1.5 rounded border" style={{ outline: '2px solid var(--ada-focus-ring)', outlineOffset: '2px', borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)', color: 'var(--ada-text-1)' }} /> },
            { label: 'Link Focus', el: <a href="#" className="underline" style={{ outline: '2px solid var(--ada-focus-ring)', outlineOffset: '2px', borderRadius: '2px', color: 'var(--ada-p-600)' }} onClick={e => e.preventDefault()}>Anchor Link</a> },
            { label: 'Ghost Focus', el: <button className="px-4 py-2 rounded" style={{ outline: '2px solid var(--ada-focus-ring)', outlineOffset: '2px', backgroundColor: 'transparent', color: 'var(--ada-text-1)', border: '1px solid var(--ada-border-default)' }}>Ghost</button> },
          ].map(f => (
            <div key={f.label} className="flex flex-col items-start gap-2 p-4 rounded border" style={{ borderColor: 'var(--ada-border-default)', backgroundColor: 'var(--ada-surface-1)' }}>
              {f.el}
              <div style={{ fontSize: 'var(--ada-fs-xs)', color: 'var(--ada-text-3)' }}>{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="h-16" />
    </div>
  );
}