import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ActiveLink } from '@/components/admin/ActiveLink';

interface NavLink {
  href: string;
  label: string;
  exact?: boolean;
}

interface NavGroup {
  title: string;
  items: NavLink[];
}

const NAV: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', exact: true },
      { href: '/admin/contacts', label: 'Contact Submissions' },
    ],
  },
  {
    title: 'Site content',
    items: [
      { href: '/admin/pages', label: 'Pages' },
      { href: '/admin/menu', label: 'Menus' },
      { href: '/admin/page-blocks', label: 'Page Blocks (advanced)' },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { href: '/admin/services', label: 'Services' },
      { href: '/admin/gallery', label: 'Gallery' },
      { href: '/admin/media', label: 'Media Library' },
      { href: '/admin/blog', label: 'Blog Posts' },
      { href: '/admin/team', label: 'Team Members' },
      { href: '/admin/testimonials', label: 'Testimonials' },
      { href: '/admin/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/settings', label: 'Site Settings' },
      { href: '/admin/footer', label: 'Footer & Trust Badges' },
      { href: '/admin/popup', label: 'Kampanya Pop-up' },
      { href: '/admin/integrations', label: 'Entegrasyonlar' },
      { href: '/admin/seo', label: 'Page SEO' },
      { href: '/admin/forms', label: 'Form Redirects' },
    ],
  },
];

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  return (
    <div className="flex bg-slate-50">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[var(--color-primary-darker)] text-slate-100 md:flex">
        <div className="border-b border-slate-700/60 px-6 py-5">
          <p className="text-xs uppercase tracking-widest text-[var(--color-primary)]">MyHaar</p>
          <h1 className="text-lg font-semibold">Admin Console</h1>
          <p className="mt-1 truncate text-xs text-slate-400">{user.email}</p>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {NAV.map((group) => (
            <div key={group.title}>
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                {group.title}
              </p>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => (
                  <ActiveLink key={item.href} href={item.href} exact={item.exact}>
                    {item.label}
                  </ActiveLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <form
          action="/admin/logout"
          method="post"
          className="border-t border-slate-700/60 p-3"
        >
          <button
            type="submit"
            className="w-full rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-100 transition hover:bg-slate-700"
          >
            Logout
          </button>
        </form>
      </aside>
      <main className="min-h-screen min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10">{children}</div>
      </main>
    </div>
  );
}
