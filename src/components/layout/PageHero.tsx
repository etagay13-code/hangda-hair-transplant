import { Link } from '@/i18n/navigation';
import type { ReactNode } from 'react';

interface Crumb {
  label: string;
  href?: string;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="container-page">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-600">
            <ol className="flex flex-wrap items-center gap-1">
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1">
                  {c.href ? (
                    <Link href={c.href} className="hover:text-[var(--color-primary-darker)]">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-[var(--color-primary-darker)]">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            {eyebrow}
          </p>
        )}
        <h1 className="heading-display mt-3 text-3xl sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-base text-slate-700 sm:text-lg">{subtitle}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
