import type { ReactNode } from 'react';
import Link from 'next/link';

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function NewButton({ href, label = 'Yeni ekle' }: { href: string; label?: string }) {
  return (
    <Link href={href} className="admin-btn admin-btn-primary">
      + {label}
    </Link>
  );
}
