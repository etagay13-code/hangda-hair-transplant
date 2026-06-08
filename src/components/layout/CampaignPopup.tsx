'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { gaEvent, pushDataLayer } from '@/lib/analytics';

interface Props {
  whatsapp?: string;
  /** When to show the popup, ms after first visit. */
  delayMs?: number;
  /** Dismissed state survives this many hours before showing again. */
  dismissHours?: number;
}

const STORAGE_KEY = 'myhaar:popup:dismissed_until';

export function CampaignPopup({
  whatsapp,
  delayMs = 6000,
  dismissHours = 24,
}: Props) {
  const t = useTranslations('Popup');
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const until = Number(window.localStorage.getItem(STORAGE_KEY) || '0');
      if (until > Date.now()) return;
    } catch {
      // localStorage blocked — proceed anyway, popup shows once per session.
    }
    const timer = window.setTimeout(() => {
      setVisible(true);
      gaEvent('popup_shown', { locale });
      pushDataLayer({ event: 'popup_shown', locale });
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, locale]);

  function dismiss(reason: 'close' | 'cta') {
    try {
      const until = Date.now() + dismissHours * 60 * 60 * 1000;
      window.localStorage.setItem(STORAGE_KEY, String(until));
    } catch {
      // ignore
    }
    setVisible(false);
    gaEvent('popup_dismissed', { reason, locale });
    pushDataLayer({ event: 'popup_dismissed', reason, locale });
  }

  if (!visible) return null;

  const waNumber = whatsapp ? whatsapp.replace(/[^0-9]/g, '') : '';
  const waMessage = encodeURIComponent(t('whatsappMessage'));
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${waMessage}`
    : `/${locale}/contact`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('lineOne')}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={() => dismiss('close')}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl lg:grid-cols-2"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => dismiss('close')}
          aria-label={t('close')}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-black"
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* LEFT — headline + checklist + CTA */}
        <div className="flex flex-col justify-center gap-6 bg-white p-6 sm:p-8 lg:p-10">
          <h2 className="text-2xl font-black uppercase leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            <span className="block">{t('lineOne')}</span>
            <span className="block text-[var(--color-primary)]">{t('lineTwo')}</span>
            <span className="block">{t('lineThree')}</span>
          </h2>

          <ul className="space-y-3 text-sm font-medium text-slate-700 sm:text-base">
            <li className="flex items-center gap-3">
              <CheckBadge />
              <span>{t('checks.summer')}</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckBadge />
              <span>{t('checks.slots')}</span>
            </li>
          </ul>

          <a
            href={waHref}
            target={waNumber ? '_blank' : undefined}
            rel={waNumber ? 'noopener noreferrer' : undefined}
            onClick={() => dismiss('cta')}
            className="block w-full rounded-xl bg-[var(--color-primary-darker)] px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[var(--color-primary-dark)] sm:text-base"
          >
            {t('cta')}
          </a>

          <p className="text-[11px] leading-relaxed text-slate-500">
            {t('disclaimer')}
          </p>
        </div>

        {/* RIGHT — package cards */}
        <div className="bg-[var(--color-primary)]/15 p-6 sm:p-8 lg:p-10">
          <h3 className="text-center text-lg font-extrabold text-[var(--color-primary-darker)] sm:text-xl lg:text-2xl">
            {t('rightTitle')}
          </h3>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
            <PackageCard icon={<PlanIcon />} label={t('cards.plan')} />
            <PackageCard icon={<ClinicIcon />} label={t('cards.clinic')} />
            <PackageCard icon={<ConsultIcon />} label={t('cards.consult')} />
            <PackageCard icon={<GuaranteeIcon />} label={t('cards.guarantee')} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckBadge() {
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-white shadow">
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l4 4 10-10" />
      </svg>
    </span>
  );
}

function PackageCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white px-3 py-4 text-center shadow-sm sm:py-5">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-primary)]/15 text-[var(--color-primary-darker)] sm:h-11 sm:w-11">
        {icon}
      </span>
      <p className="text-[11px] font-semibold leading-tight text-slate-800 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

function PlanIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x={4} y={4} width={16} height={18} rx={2} />
      <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1z" />
      <path d="M9 13l2 2 4-4" />
      <path d="M9 18h6" />
    </svg>
  );
}

function ClinicIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V8l9-6 9 6v14" />
      <path d="M9 22v-6h6v6" />
      <path d="M12 11v4M10 13h4" />
    </svg>
  );
}

function ConsultIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
    </svg>
  );
}

function GuaranteeIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
