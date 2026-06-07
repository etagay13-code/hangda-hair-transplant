'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function SidebarLink({
  href,
  icon,
  children,
  exact = false,
}: {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} className={`admin-link ${active ? 'is-active' : ''}`}>
      <span aria-hidden="true" className="text-base">
        {icon}
      </span>
      <span>{children}</span>
    </Link>
  );
}
