import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [contacts, services, posts, gallery] = await Promise.all([
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('gallery').select('*', { count: 'exact', head: true }),
  ]);

  const cards = [
    { label: 'Contact Submissions', value: contacts.count ?? 0 },
    { label: 'Services', value: services.count ?? 0 },
    { label: 'Blog Posts', value: posts.count ?? 0 },
    { label: 'Gallery Items', value: gallery.count ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="text-slate-600 mt-1">Overview of site content and activity.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-lg bg-white border border-slate-200 p-5 shadow-sm"
          >
            <div className="text-sm text-slate-500">{c.label}</div>
            <div className="text-3xl font-semibold text-slate-900 mt-2">
              {c.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
