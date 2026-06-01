import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import type { Contact } from '@/types';

export const dynamic = 'force-dynamic';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-amber-100 text-amber-800',
  contacted: 'bg-blue-100 text-blue-800',
  qualified: 'bg-violet-100 text-violet-800',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-slate-200 text-slate-700',
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [contactsTotal, newContacts, services, posts, gallery, team, testimonials, recent] =
    await Promise.all([
      supabase.from('contacts').select('*', { count: 'exact', head: true }),
      supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('services').select('*', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
      supabase.from('gallery').select('*', { count: 'exact', head: true }),
      supabase.from('team_members').select('*', { count: 'exact', head: true }),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }),
      supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6),
    ]);

  const stats = [
    {
      label: 'Total Contacts',
      value: contactsTotal.count ?? 0,
      href: '/admin/contacts',
    },
    {
      label: 'New (unhandled)',
      value: newContacts.count ?? 0,
      href: '/admin/contacts?status=new',
      accent: true,
    },
    { label: 'Services', value: services.count ?? 0, href: '/admin/services' },
    { label: 'Blog Posts', value: posts.count ?? 0, href: '/admin/blog' },
    { label: 'Gallery', value: gallery.count ?? 0, href: '/admin/gallery' },
    { label: 'Team', value: team.count ?? 0, href: '/admin/team' },
    { label: 'Testimonials', value: testimonials.count ?? 0, href: '/admin/testimonials' },
  ];

  const recentRows = (recent.data ?? []) as Contact[];

  return (
    <div className="space-y-10">
      <PageHeader
        title="Dashboard"
        description="Overview of submissions and site content."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
              s.accent
                ? 'border-[var(--color-primary)]'
                : 'border-slate-200 hover:border-[var(--color-primary)]/50'
            }`}
          >
            <div className="text-xs uppercase tracking-wider text-slate-500">
              {s.label}
            </div>
            <div className="mt-2 text-3xl font-bold text-[var(--color-primary-darker)]">
              {s.value}
            </div>
          </Link>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-primary-darker)]">
            Recent contact submissions
          </h2>
          <Link
            href="/admin/contacts"
            className="text-sm font-medium text-[var(--color-primary-dark)] hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {recentRows.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-slate-500">
              No submissions yet.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email / Phone</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRows.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-[var(--color-primary-darker)]">
                      <Link href={`/admin/contacts/${c.id}`} className="hover:underline">
                        {c.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {c.email || c.phone || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[c.status] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
