'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LocaleSwitcher } from './LocaleSwitcher';

interface Props {
  brand: string;
  whatsapp?: string;
}

const SECTIONS = [
  { href: '/#services', key: 'services' },
  { href: '/#gallery', key: 'gallery' },
  { href: '/#testimonials', key: 'testimonials' },
  { href: '/#faq', key: 'faq' },
  { href: '/#contact', key: 'contact' },
] as const;

export function Navbar({ brand, whatsapp }: Props) {
  const t = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
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

  const wa = whatsapp ? whatsapp.replace(/[^0-9]/g, '') : '';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition ${
        scrolled
          ? 'bg-white/90 shadow-sm backdrop-blur'
          : 'bg-white/60 backdrop-blur-sm'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-primary)] text-white font-bold">
            H
          </span>
          <span className="text-lg font-semibold tracking-tight text-[var(--color-primary-darker)]">
            {brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {SECTIONS.map((s) => (
            <a
              key={s.key}
              href={s.href}
              className="text-sm font-medium text-slate-700 transition hover:text-[var(--color-primary-darker)]"
            >
              {t(s.key)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
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
          <a href="/#contact" className="btn-outline !px-4 !py-2 text-xs">
            {t('consultation')}
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-700 md:hidden"
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
        <div id="mobile-menu" className="md:hidden">
          <div className="container-page space-y-4 border-t border-slate-100 py-6">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {SECTIONS.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  className="rounded-md px-3 py-2 text-base font-medium text-slate-800 hover:bg-[var(--color-primary)]/10"
                  onClick={() => setOpen(false)}
                >
                  {t(s.key)}
                </a>
              ))}
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
