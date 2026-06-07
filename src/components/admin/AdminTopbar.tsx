import Link from 'next/link';
import { routing } from '@/i18n/routing';
import type { ReactNode } from 'react';

interface Props {
  crumb?: string;
  preview?: string;
  locale?: string;
  hideLocale?: boolean;
  children?: ReactNode;
}

const LOCALE_LABELS: Record<string, string> = {
  all: 'All locales',
  en: 'English',
  nl: 'Nederlands',
  tr: 'Türkçe',
};

const FLAGS: Record<string, string> = {
  all: '🌐',
  en: '🇬🇧',
  nl: '🇳🇱',
  tr: '🇹🇷',
};

export function AdminTopbar({ crumb, preview, locale = 'all', hideLocale, children }: Props) {
  return (
    <header className="admin-topbar sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-3">
      <div className="flex items-center gap-3">
        <span className="admin-pill">
          <span className="dot" />
          Canlı
        </span>
        {crumb && (
          <>
            <span className="text-slate-600">·</span>
            <span className="text-sm font-semibold text-slate-200">{crumb}</span>
          </>
        )}
        {preview && (
          <a
            href={preview}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-100"
          >
            ↗ Önizle
          </a>
        )}
      </div>
      <div className="flex items-center gap-3">
        {!hideLocale && (
          <div className="hidden items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm sm:inline-flex">
            <span className="text-xs uppercase tracking-wider text-slate-500">Düzenleniyor</span>
            <span>{FLAGS[locale] ?? '🌐'}</span>
            <span className="font-semibold text-slate-100">{LOCALE_LABELS[locale] ?? locale}</span>
          </div>
        )}
        {children}
      </div>
    </header>
  );
}

export function LocaleSwitcherTabs({
  current,
  buildHref,
}: {
  current: string;
  buildHref: (locale: string) => string;
}) {
  const locales = ['all', ...routing.locales];
  return (
    <div className="inline-flex rounded-lg border border-slate-700 bg-slate-900 p-1">
      {locales.map((l) => (
        <Link
          key={l}
          href={buildHref(l)}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
            l === current
              ? 'bg-[var(--color-primary)] text-slate-900'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          {FLAGS[l]} <span className="ml-1 uppercase">{l === 'all' ? 'All' : l}</span>
        </Link>
      ))}
    </div>
  );
}
