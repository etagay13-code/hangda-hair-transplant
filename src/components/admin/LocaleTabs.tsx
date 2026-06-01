'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function LocaleTabs({ current }: { current: string }) {
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <div className="inline-flex rounded-md border border-slate-200 bg-white p-1">
      {routing.locales.map((l) => {
        const next = new URLSearchParams(params.toString());
        next.set('locale', l);
        return (
          <Link
            key={l}
            href={`${pathname}?${next.toString()}`}
            className={`rounded px-3 py-1 text-xs font-semibold uppercase transition ${
              l === current
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-slate-600 hover:text-[var(--color-primary-darker)]'
            }`}
          >
            {l}
          </Link>
        );
      })}
    </div>
  );
}
