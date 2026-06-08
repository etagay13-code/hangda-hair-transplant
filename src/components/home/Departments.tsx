'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Procedure {
  slug: string;
  title: string;
}

interface Department {
  key: string;
  title: string;
  navTitle: string;
  navSub: string;
  description: string;
  badge?: string;
  stats: { label: string; value: string; em?: string }[];
  procedures: Procedure[];
  featureTitle: string;
  featureSub: string;
  ctaHref: string;
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
    title: 'Surgical Hair Restoration',
    navTitle: 'Surgical Hair Restoration',
    navSub: '3 procedures · FUE & DHI',
    badge: 'Most popular',
    description:
      'Follicular unit extraction performed in our Den Haag clinic using sapphire-tipped blades and Choi DHI implanters. Surgeon-led, local anaesthesia, natural density with minimal scarring and faster healing.',
    stats: [
      { label: 'Avg. duration', value: '6–8', em: 'hrs' },
      { label: 'Setting', value: 'Day clinic' },
      { label: 'Recovery', value: '10–14', em: 'days' },
      { label: 'Patients / yr', value: '1,500', em: '+' },
    ],
    procedures: [
      { slug: 'sapphire-fue', title: 'Sapphire FUE' },
      { slug: 'dhi-hair-transplant', title: 'DHI Hair Transplant' },
      { slug: 'women-hair-transplant', title: "Women's Hair Transplant" },
    ],
    featureTitle: 'Sapphire blade technique',
    featureSub: 'Finer channels · faster healing',
    ctaHref: '/services',
    icon: HairIcon,
  },
  {
    key: 'specialty',
    title: 'Specialty Restorations',
    navTitle: 'Specialty Restorations',
    navSub: '2 procedures · Beard & eyebrow',
    description:
      'Facial-hair restoration with the same FUE / DHI precision used on the scalp — sculpted beard lines, natural-angle eyebrow grafts. Performed at our Den Haag clinic with single-hair follicular units.',
    stats: [
      { label: 'Avg. duration', value: '3–6', em: 'hrs' },
      { label: 'Setting', value: 'Day clinic' },
      { label: 'Recovery', value: '7–10', em: 'days' },
      { label: 'Grafts / brow', value: '250–500' },
    ],
    procedures: [
      { slug: 'beard-transplant', title: 'Beard Transplant' },
      { slug: 'eyebrow-transplant', title: 'Eyebrow Transplant' },
    ],
    featureTitle: 'Single-hair grafting',
    featureSub: 'Natural angle · undetectable result',
    ctaHref: '/services',
    icon: BeardIcon,
  },
  {
    key: 'wellness',
    title: 'Hair Wellness',
    navTitle: 'Hair Wellness',
    navSub: '1 procedure · PRP therapy',
    description:
      'Non-surgical regenerative therapy using your own platelet-rich plasma — stimulates dormant follicles, slows active loss, accelerates post-transplant healing. 45-minute sessions, zero downtime.',
    stats: [
      { label: 'Avg. duration', value: '45–60', em: 'min' },
      { label: 'Downtime', value: 'None' },
      { label: 'Course', value: '3 sessions' },
      { label: 'Spacing', value: '4 weeks' },
    ],
    procedures: [
      { slug: 'prp-treatment', title: 'PRP Hair Treatment' },
    ],
    featureTitle: 'Drawn from your own blood',
    featureSub: 'No drugs · no synthetic growth factors',
    ctaHref: '/services',
    icon: PrpIcon,
  },
];

export function Departments({ locale }: { locale: string }) {
  const [active, setActive] = useState(DEPARTMENTS[0].key);
  const current = DEPARTMENTS.find((d) => d.key === active) ?? DEPARTMENTS[0];

  return (
    <section className="relative bg-slate-50 py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Specialty Departments
          </span>
          <h2 className="heading-display mt-4 text-3xl sm:text-4xl lg:text-5xl leading-tight">
            <span>Leaders in</span>{' '}
            <span className="text-[var(--color-primary)]">hair restoration</span>
            <br />
            <span>in Den Haag.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600">
            Six surgeon-led treatments under one roof in Den Haag, organised across three
            dedicated departments. All performed personally by the lead surgical team —
            no factory clinic, no franchised partners.
          </p>
        </div>

        <div className="mt-12 grid gap-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[320px_1fr] lg:p-6">
          {/* Sidebar */}
          <aside className="rounded-2xl bg-slate-50 p-4">
            <p className="px-2 pb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
              Select a department
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
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-[var(--color-primary-darker)] truncate">
                          {dept.navTitle}
                        </span>
                        {dept.badge && (
                          <span className="rounded-full bg-[var(--color-primary)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
                            {dept.badge}
                          </span>
                        )}
                      </span>
                      <span className="block text-xs text-slate-500 truncate">
                        {dept.navSub}
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
              All departments accept new patients
            </div>
          </aside>

          {/* Content panel */}
          <div className="rounded-2xl bg-white p-6 lg:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary-darker)]">
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M9 12l2 2 4-4" />
                <circle cx={12} cy={12} r={9} />
              </svg>
              Specialist-led department
            </span>
            <h3 className="mt-4 text-3xl font-semibold text-[var(--color-primary-darker)] sm:text-4xl">
              {current.title}
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              {current.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 sm:grid-cols-4">
              {current.stats.map((s) => (
                <div key={s.label} className="bg-slate-50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    {s.label}
                  </p>
                  <p className="mt-1 text-xl font-bold text-[var(--color-primary-darker)]">
                    {s.value}
                    {s.em && <em className="ml-1 text-xs font-medium not-italic text-slate-500">{s.em}</em>}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-10 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Procedures in this department
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {current.procedures.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${locale}/services/${p.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-[var(--color-primary-darker)] transition hover:bg-[var(--color-primary)]/15"
                >
                  {p.title}
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
                    {current.featureTitle}
                  </p>
                  <p className="text-xs text-slate-600">{current.featureSub}</p>
                </div>
              </div>
              <Link
                href={`/${locale}${current.ctaHref}`}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
              >
                Explore department
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
