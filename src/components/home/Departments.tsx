'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Procedure {
  slug: string;
  titleKey: string;
}

interface Department {
  key: string;
  procedures: Procedure[];
  badge?: boolean;
  stats: { labelKey: string; valueKey: string; em?: string }[];
  icon: React.ReactNode;
}

const HairIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M12 2v3M5 8c0-2 3-3 7-3s7 1 7 3v3c0 4-3 11-7 11s-7-7-7-11z" />
    <path d="M9 10v2M15 10v2" />
  </svg>
);
const BeardIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx={12} cy={9} r={4} />
    <path d="M5 22c0-4 3-6 7-6s7 2 7 6" />
    <path d="M8 14c1 3 2 4 4 4s3-1 4-4" />
  </svg>
);
const PrpIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M18 2l-1 3M9 5l-2 2M6 7l-4 4 5 5 4-4M15 17l4-4 3 3-4 4" />
    <path d="M13 11l-2 2" />
  </svg>
);

const DEPARTMENTS: Department[] = [
  {
    key: 'surgical',
    badge: true,
    stats: [
      { labelKey: 'duration', valueKey: 'hours6to8', em: 'hrs' },
      { labelKey: 'setting', valueKey: 'dayClinic' },
      { labelKey: 'recovery', valueKey: 'days10to14', em: 'days' },
      { labelKey: 'patientsPerYear', valueKey: 'patients', em: '+' },
    ],
    procedures: [
      { slug: 'sapphire-fue', titleKey: 'fue' },
      { slug: 'dhi-hair-transplant', titleKey: 'dhi' },
      { slug: 'women-hair-transplant', titleKey: 'women' },
    ],
    icon: HairIcon,
  },
  {
    key: 'specialty',
    stats: [
      { labelKey: 'duration', valueKey: 'hours3to6', em: 'hrs' },
      { labelKey: 'setting', valueKey: 'dayClinic' },
      { labelKey: 'recovery', valueKey: 'days7to10', em: 'days' },
      { labelKey: 'graftsPerBrow', valueKey: 'grafts' },
    ],
    procedures: [
      { slug: 'beard-transplant', titleKey: 'beard' },
      { slug: 'eyebrow-transplant', titleKey: 'eyebrow' },
    ],
    icon: BeardIcon,
  },
  {
    key: 'wellness',
    stats: [
      { labelKey: 'duration', valueKey: 'min45to60', em: 'min' },
      { labelKey: 'downtime', valueKey: 'none' },
      { labelKey: 'course', valueKey: 'sessions3' },
      { labelKey: 'spacing', valueKey: 'weeks4' },
    ],
    procedures: [{ slug: 'prp-treatment', titleKey: 'prp' }],
    icon: PrpIcon,
  },
];

export function Departments({ locale }: { locale: string }) {
  const t = useTranslations('Departments');
  const tTreat = useTranslations('QuoteQuiz.treatments');
  const [active, setActive] = useState(DEPARTMENTS[0].key);
  const current = DEPARTMENTS.find((d) => d.key === active) ?? DEPARTMENTS[0];

  return (
    <section className="relative bg-slate-50 py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
            {t('eyebrow')}
          </span>
          <h2 className="heading-display mt-4 text-3xl sm:text-4xl lg:text-5xl leading-tight">
            <span>{t('titlePre')}</span>{' '}
            <span className="text-[var(--color-primary)]">{t('titleHighlight')}</span>
            <br />
            <span>{t('titlePost')}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600">{t('subtitle')}</p>
        </div>

        <div className="mt-12 grid gap-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[320px_1fr] lg:p-6">
          {/* Sidebar */}
          <aside className="rounded-2xl bg-slate-50 p-4">
            <p className="px-2 pb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
              {t('sidebarLabel')}
            </p>
            <div className="space-y-2">
              {DEPARTMENTS.map((dept) => {
                const isActive = dept.key === active;
                return (
                  <button
                    key={dept.key}
                    type="button"
                    onClick={() => setActive(dept.key)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                      isActive
                        ? 'bg-white shadow-sm ring-1 ring-[var(--color-primary)]'
                        : 'hover:bg-white/60'
                    }`}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                        isActive
                          ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary-darker)]'
                          : 'bg-white text-slate-600 ring-1 ring-slate-200'
                      }`}
                    >
                      {dept.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[var(--color-primary-darker)] truncate">
                        {t(`${dept.key}.title`)}
                      </span>
                      <span className="block text-xs text-slate-500 truncate">
                        {t(`${dept.key}.navSub`)}
                      </span>
                    </span>
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className={`shrink-0 transition ${
                        isActive ? 'text-[var(--color-primary)]' : 'text-slate-400'
                      }`}
                    >
                      <path d="M5 3l4 4-4 4" />
                    </svg>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 ring-1 ring-emerald-500/20">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              {t('acceptingNew')}
            </div>
          </aside>

          {/* Content panel */}
          <div className="rounded-2xl bg-white p-6 lg:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary-darker)]">
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M9 12l2 2 4-4" />
                <circle cx={12} cy={12} r={9} />
              </svg>
              {t('panelBadge')}
            </span>
            <h3 className="mt-4 text-3xl font-semibold text-[var(--color-primary-darker)] sm:text-4xl">
              {t(`${current.key}.title`)}
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              {t(`${current.key}.description`)}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 sm:grid-cols-4">
              {current.stats.map((s) => (
                <div key={s.labelKey} className="bg-slate-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    {t(`stat.${s.labelKey}`)}
                  </p>
                  <p className="mt-1 text-xl font-bold text-[var(--color-primary-darker)]">
                    {t(`value.${s.valueKey}`)}
                    {s.em && <em className="ml-1 text-xs font-medium not-italic text-slate-500">{s.em}</em>}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-10 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {t('proceduresLabel')}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {current.procedures.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${locale}/services/${p.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-[var(--color-primary-darker)] transition hover:bg-[var(--color-primary)]/15"
                >
                  {tTreat(p.titleKey)}
                  <svg
                    width={12}
                    height={12}
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]"
                  >
                    <path d="M3 7h8M7 3l4 4-4 4" />
                  </svg>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)]/12 text-[var(--color-primary-darker)]">
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-[var(--color-primary-darker)]">
                    {t(`${current.key}.featureTitle`)}
                  </p>
                  <p className="text-xs text-slate-600">{t(`${current.key}.featureSub`)}</p>
                </div>
              </div>
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
              >
                {t('ctaLabel')}
                <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <path d="M3 7h8M7 3l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
