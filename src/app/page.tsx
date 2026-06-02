import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

// Safety-net root route: redirects to the default locale.
// In normal operation, src/proxy.ts (next-intl) catches `/` first and chooses
// a locale based on Accept-Language. If the proxy is skipped or fails (e.g. on
// edge deploy boundaries), this page guarantees `/` does not 404.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
