import Link from 'next/link';
import {
  Inbox,
  Sparkles,
  Stethoscope,
  PenLine,
  Image as ImageIcon,
  Users,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import type { Contact } from '@/types';

export const dynamic = 'force-dynamic';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  contacted: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  qualified: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  won: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  lost: 'bg-slate-700 text-slate-300 border-slate-600',
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

  const stats: {
    label: string;
    value: number;
    href: string;
    Icon: LucideIcon;
    accent?: boolean;
  }[] = [
    { label: 'Toplam Talep', value: contactsTotal.count ?? 0, href: '/admin/contacts', Icon: Inbox },
    { label: 'Yeni Talep',   value: newContacts.count ?? 0,   href: '/admin/contacts?status=new', Icon: Sparkles, accent: true },
    { label: 'Hizmet',        value: services.count ?? 0,      href: '/admin/services', Icon: Stethoscope },
    { label: 'Blog Yazısı',   value: posts.count ?? 0,         href: '/admin/blog', Icon: PenLine },
    { label: 'Galeri',        value: gallery.count ?? 0,       href: '/admin/gallery', Icon: ImageIcon },
    { label: 'Ekip',          value: team.count ?? 0,          href: '/admin/team', Icon: Users },
    { label: 'Yorum',         value: testimonials.count ?? 0,  href: '/admin/testimonials', Icon: Star },
  ];

  const recentRows = (recent.data ?? []) as Contact[];

  return (
    <>
      <AdminTopbar crumb="Genel Bakış" preview="/" hideLocale />
      <div className="px-8 py-8">
        <PageHeader
          title="Genel Bakış"
          description="Site içeriklerinizin ve son taleplerin özeti."
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className={`admin-card admin-card-hover p-5 transition ${
                s.accent ? 'ring-1 ring-[var(--color-primary)]' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-700/60 text-[var(--color-primary)]">
                  <s.Icon size={16} strokeWidth={1.8} />
                </span>
                {s.accent && (
                  <span className="rounded-full bg-[var(--color-primary)]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">
                    Yeni
                  </span>
                )}
              </div>
              <div className="mt-4 text-[10px] uppercase tracking-widest text-slate-500">
                {s.label}
              </div>
              <div className="mt-1 text-3xl font-bold text-white">{s.value}</div>
            </Link>
          ))}
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Son form talepleri</h2>
            <Link
              href="/admin/contacts"
              className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
            >
              Tümünü gör →
            </Link>
          </div>
          <div className="admin-card mt-3 overflow-hidden">
            {recentRows.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-slate-400">
                Henüz form talebi gelmemiş.
              </p>
            ) : (
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead className="bg-slate-900/40 text-left text-xs uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Ad Soyad</th>
                    <th className="px-4 py-3 font-medium">E-posta / Telefon</th>
                    <th className="px-4 py-3 font-medium">Durum</th>
                    <th className="px-4 py-3 font-medium">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {recentRows.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-medium text-white">
                        <Link href={`/admin/contacts/${c.id}`} className="hover:text-[var(--color-primary)]">
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{c.email || c.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${
                            STATUS_COLORS[c.status] || 'bg-slate-800 text-slate-300 border-slate-700'
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
    </>
  );
}
