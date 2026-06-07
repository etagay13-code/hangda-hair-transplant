'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LocaleSwitcher } from './LocaleSwitcher';

interface Props {
  brand: string;
  logoUrl?: string;
  whatsapp?: string;
  items?: NavLink[];
  serviceSubmenu?: SubmenuItem[];
}

export interface NavLink {
  href: string;
  label: string;
  target?: string;
}

export interface SubmenuItem {
  href: string;
  label: string;
}

interface NavbarItem {
  href: string;
  key: 'about' | 'services' | 'gallery' | 'blog' | 'faq' | 'contact';
  type: 'page' | 'anchor';
}

const FALLBACK_NAV: NavbarItem[] = [
  { href: '/about', key: 'about', type: 'page' },
  { href: '/services', key: 'services', type: 'page' },
  { href: '/gallery', key: 'gallery', type: 'page' },
  { href: '/blog', key: 'blog', type: 'page' },
  { href: '#faq', key: 'faq', type: 'anchor' },
  { href: '/contact', key: 'contact', type: 'page' },
];

export function Navbar({ brand, logoUrl, whatsapp, items, serviceSubmenu }: Props) {
  const t = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(false);
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

  function anchorHref(hash: string) {
    return `/${locale}/${hash}`;
  }

  function isActive(href: string) {
    if (href.startsWith('#')) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const wa = whatsapp ? whatsapp.replace(/[^0-9]/g, '') : '';
  const useDb = items && items.length > 0;
  const submenu = serviceSubmenu ?? [];

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
          {useDb
            ? items!.map((item) =>
                renderDesktopItem(item.label, item.href, item.target, isActive, anchorHref, submenu)
              )
            : FALLBACK_NAV.map((item) =>
                renderDesktopItem(t(item.key), item.href, '_self', isActive, anchorHref, submenu)
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
              {(useDb ? items! : FALLBACK_NAV).map((rawItem) => {
                const label = 'label' in rawItem ? rawItem.label : t((rawItem as NavbarItem).key);
                const href = rawItem.href;
                const target = ('target' in rawItem ? rawItem.target : '_self') as string;
                const isServices = href === '/services' && submenu.length > 0;
                if (isServices) {
                  return (
                    <div key={href + label}>
                      <button
                        type="button"
                        onClick={() => setMobileSubmenu((v) => !v)}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-slate-800 hover:bg-[var(--color-primary)]/10"
                      >
                        <span>{label}</span>
                        <span
                          aria-hidden="true"
                          className={`text-[var(--color-primary)] transition ${
                            mobileSubmenu ? 'rotate-180' : ''
                          }`}
                        >
                          ▾
                        </span>
                      </button>
                      {mobileSubmenu && (
                        <div className="mt-1 ml-3 flex flex-col gap-1 border-l-2 border-[var(--color-primary)]/30 pl-3">
                          <Link
                            href="/services"
                            onClick={() => setOpen(false)}
                            className="rounded-md px-3 py-1.5 text-sm font-semibold text-[var(--color-primary-darker)] hover:bg-[var(--color-primary)]/10"
                          >
                            All services
                          </Link>
                          {submenu.map((s) => (
                            <Link
                              key={s.href}
                              href={s.href}
                              onClick={() => setOpen(false)}
                              className="rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary-darker)]"
                            >
                              {s.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                if (href.startsWith('#')) {
                  return (
                    <a
                      key={href + label}
                      href={anchorHref(href)}
                      target={target}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2 text-base font-medium text-slate-800 hover:bg-[var(--color-primary)]/10"
                    >
                      {label}
                    </a>
                  );
                }
                if (href.startsWith('http')) {
                  return (
                    <a
                      key={href + label}
                      href={href}
                      target={target || '_blank'}
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2 text-base font-medium text-slate-800 hover:bg-[var(--color-primary)]/10"
                    >
                      {label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={href + label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-base font-medium text-slate-800 hover:bg-[var(--color-primary)]/10"
                  >
                    {label}
                  </Link>
                );
              })}
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

function renderDesktopItem(
  label: string,
  href: string,
  target: string | undefined,
  isActive: (href: string) => boolean,
  anchorHref: (hash: string) => string,
  submenu: SubmenuItem[]
) {
  const baseCls = `text-sm font-medium transition hover:text-[var(--color-primary-darker)] ${
    isActive(href) ? 'text-[var(--color-primary-darker)]' : 'text-slate-700'
  }`;

  if (href === '/services' && submenu.length > 0) {
    return (
      <div key={href + label} className="group relative">
        <Link href={href} className={`inline-flex items-center gap-1 ${baseCls}`}>
          {label}
          <svg
            aria-hidden="true"
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition group-hover:rotate-180"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Link>

        {/* Bridge to prevent flicker between trigger and dropdown */}
        <div className="absolute left-0 top-full h-3 w-full" />

        <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5">
            <Link
              href="/services"
              className="block bg-[var(--color-primary)]/8 px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary-darker)] hover:bg-[var(--color-primary)]/15"
            >
              All services →
            </Link>
            <ul className="py-2">
              {submenu.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="block px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary-darker)]"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (href.startsWith('#')) {
    return (
      <a key={href + label} href={anchorHref(href)} target={target ?? '_self'} className={baseCls}>
        {label}
      </a>
    );
  }
  if (href.startsWith('http')) {
    return (
      <a
        key={href + label}
        href={href}
        target={target ?? '_blank'}
        rel="noopener noreferrer"
        className={baseCls}
      >
        {label}
      </a>
    );
  }
  return (
    <Link key={href + label} href={href} className={baseCls}>
      {label}
    </Link>
  );
}
