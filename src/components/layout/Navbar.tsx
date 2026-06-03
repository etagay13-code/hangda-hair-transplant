'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LocaleSwitcher } from './LocaleSwitcher';

interface Props {
  brand: string;
  logoUrl?: string;
  whatsapp?: string;
}

interface NavItem {
  href: string;
  key: 'about' | 'services' | 'gallery' | 'blog' | 'faq' | 'contact';
  type: 'page' | 'anchor';
}

const NAV: NavItem[] = [
  { href: '/about', key: 'about', type: 'page' },
  { href: '/services', key: 'services', type: 'page' },
  { href: '/gallery', key: 'gallery', type: 'page' },
  { href: '/blog', key: 'blog', type: 'page' },
  { href: '#faq', key: 'faq', type: 'anchor' },
  { href: '/contact', key: 'contact', type: 'page' },
];

export function Navbar({ brand, logoUrl, whatsapp }: Props) {
  const t = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // For anchor links, always link to /[locale]/#hash so they work from any page.
  function anchorHref(hash: string) {
    return `/${locale}/${hash}`;
  }

  function isActive(href: string) {
    if (href.startsWith('#')) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const wa = whatsapp ? whatsapp.replace(/[^0-9]/g, '') : '';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition ${
        scrolled
          ? 'bg-white/95 shadow-sm backdrop-blur'
          : 'bg-white/70 backdrop-blur-sm'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link href="/" aria-label={brand} className="flex items-center">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={brand} className="h-12 w-auto sm:h-14" />
          ) : (
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-primary)] text-white font-bold">
              M
            </span>
          )}
          <span className="sr-only">{brand}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) =>
            item.type === 'page' ? (
              <Link
                key={item.key}
                href={item.href}
                className={`text-sm font-medium transition hover:text-[var(--color-primary-darker)] ${
                  isActive(item.href)
                    ? 'text-[var(--color-primary-darker)]'
                    : 'text-slate-700'
                }`}
              >
                {t(item.key)}
              </Link>
            ) : (
              <a
                key={item.key}
                href={anchorHref(item.href)}
                className="text-sm font-medium text-slate-700 transition hover:text-[var(--color-primary-darker)]"
              >
                {t(item.key)}
              </a>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher />
          {wa && (
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !px-4 !py-2 text-xs"
            >
              {tCommon('whatsapp')}
            </a>
          )}
          <Link href="/contact" className="btn-outline !px-4 !py-2 text-xs">
            {t('consultation')}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <span className="sr-only">Menu</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="lg:hidden">
          <div className="container-page space-y-4 border-t border-slate-100 py-6">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {NAV.map((item) =>
                item.type === 'page' ? (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-base font-medium text-slate-800 hover:bg-[var(--color-primary)]/10"
                  >
                    {t(item.key)}
                  </Link>
                ) : (
                  <a
                    key={item.key}
                    href={anchorHref(item.href)}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-base font-medium text-slate-800 hover:bg-[var(--color-primary)]/10"
                  >
                    {t(item.key)}
                  </a>
                )
              )}
            </nav>
            <div className="flex items-center justify-between">
              <LocaleSwitcher />
              {wa && (
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary !px-4 !py-2 text-xs"
                  onClick={() => setOpen(false)}
                >
                  {tCommon('whatsapp')}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
