import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'nl', 'tr', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type AppLocale = (typeof routing.locales)[number];

// Right-to-left scripts. The root layout flips `dir` based on this.
export const RTL_LOCALES: ReadonlySet<string> = new Set(['ar']);
