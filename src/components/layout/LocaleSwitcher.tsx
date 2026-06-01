'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';
import { routing } from '@/i18n/routing';

const LABELS: Record<string, string> = {
  en: 'EN',
  nl: 'NL',
  tr: 'TR',
};

export function LocaleSwitcher({ variant = 'inline' }: { variant?: 'inline' | 'block' }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function change(next: string) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  if (variant === 'block') {
    return (
      <div className="flex gap-2" aria-label="Language">
        {routing.locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => change(l)}
            disabled={isPending}
            aria-current={l === locale ? 'true' : undefined}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              l === locale
                ? 'bg-[var(--color-primary)] text-white'
                : 'border border-slate-200 text-slate-700 hover:border-[var(--color-primary)]'
            }`}
          >
            {LABELS[l]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1" aria-label="Language">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => change(l)}
          disabled={isPending}
          aria-current={l === locale ? 'true' : undefined}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
            l === locale
              ? 'bg-[var(--color-primary)] text-white'
              : 'text-slate-600 hover:text-[var(--color-primary-darker)]'
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
