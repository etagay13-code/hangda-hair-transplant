import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/blog', label: 'Blog Posts' },
  { href: '/admin/team', label: 'Team Members' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/faq', label: 'FAQ' },
  { href: '/admin/contacts', label: 'Contact Submissions' },
  { href: '/admin/settings', label: 'Site Settings' },
  { href: '/admin/seo', label: 'Page SEO' },
  { href: '/admin/forms', label: 'Form Settings' },
  { href: '/admin/analytics', label: 'Analytics' },
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
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800">
          <h1 className="font-semibold text-lg">Hang Da Admin</h1>
          <p className="text-xs text-slate-400 mt-1 truncate">{user.email}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-slate-800 hover:text-white transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form
          action="/admin/logout"
          method="post"
          className="p-3 border-t border-slate-800"
        >
          <button
            type="submit"
            className="w-full px-3 py-2 rounded-md text-sm bg-slate-800 hover:bg-slate-700 text-slate-100 transition"
          >
            Logout
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="px-8 py-6 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
