'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import {
  X,
  Check,
  ClipboardList,
  Building2,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { gaEvent, pushDataLayer } from '@/lib/analytics';

export interface PopupCopy {
  lineOne: string;
  lineTwo: string;
  lineThree: string;
  check1: string;
  check2: string;
  cta: string;
  disclaimer: string;
  rightTitle: string;
  card1: string;
  card2: string;
  card3: string;
  card4: string;
  whatsappMessage: string;
  closeLabel: string;
}

interface Props {
  whatsapp?: string;
  delayMs?: number;
  dismissHours?: number;
  copy: PopupCopy;
}

const STORAGE_KEY = 'myhaar:popup:dismissed_until';

export function CampaignPopup({
  whatsapp,
  delayMs = 6000,
  dismissHours = 24,
  copy,
}: Props) {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const until = Number(window.localStorage.getItem(STORAGE_KEY) || '0');
      if (until > Date.now()) return;
    } catch {
      // localStorage blocked — proceed.
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
  const waMessage = encodeURIComponent(copy.whatsappMessage);
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${waMessage}`
    : `/${locale}/contact`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.lineOne}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={() => dismiss('close')}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl lg:grid-cols-2"
      >
        <button
          type="button"
          onClick={() => dismiss('close')}
          aria-label={copy.closeLabel}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-black"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col justify-center gap-6 bg-white p-6 sm:p-8 lg:p-10">
          <h2 className="text-2xl font-black uppercase leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            <span className="block">{copy.lineOne}</span>
            <span className="block text-[var(--color-primary)]">{copy.lineTwo}</span>
            <span className="block">{copy.lineThree}</span>
          </h2>

          <ul className="space-y-3 text-sm font-medium text-slate-700 sm:text-base">
            <li className="flex items-center gap-3">
              <CheckBadge />
              <span>{copy.check1}</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckBadge />
              <span>{copy.check2}</span>
            </li>
          </ul>

          <a
            href={waHref}
            target={waNumber ? '_blank' : undefined}
            rel={waNumber ? 'noopener noreferrer' : undefined}
            onClick={() => dismiss('cta')}
            className="block w-full rounded-xl bg-[var(--color-primary-darker)] px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[var(--color-primary-dark)] sm:text-base"
          >
            {copy.cta}
          </a>

          <p className="text-[11px] leading-relaxed text-slate-500">
            {copy.disclaimer}
          </p>
        </div>

        <div className="bg-[var(--color-primary)]/15 p-6 sm:p-8 lg:p-10">
          <h3 className="text-center text-lg font-extrabold text-[var(--color-primary-darker)] sm:text-xl lg:text-2xl">
            {copy.rightTitle}
          </h3>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
            <PackageCard icon={<ClipboardList size={22} strokeWidth={1.8} />} label={copy.card1} />
            <PackageCard icon={<Building2 size={22} strokeWidth={1.8} />} label={copy.card2} />
            <PackageCard icon={<MessageCircle size={22} strokeWidth={1.8} />} label={copy.card3} />
            <PackageCard icon={<ShieldCheck size={22} strokeWidth={1.8} />} label={copy.card4} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckBadge() {
  return (
    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-white shadow">
      <Check size={14} strokeWidth={3} />
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

