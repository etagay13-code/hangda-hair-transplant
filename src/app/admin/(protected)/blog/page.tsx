import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NewButton, PageHeader } from '@/components/admin/Toolbar';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteBlogPost } from './actions';
import type { BlogPost } from '@/types';

export const dynamic = 'force-dynamic';

export default async function BlogAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  const rows = (data ?? []) as BlogPost[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Posts"
        description="Write and manage content."
        actions={<NewButton href="/admin/blog/new" />}
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {rows.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">No posts yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Locale</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((p) => {
                const del = async () => {
                  'use server';
                  await deleteBlogPost(p.id);
                };
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-[var(--color-primary-darker)]">
                      <Link href={`/admin/blog/${p.id}`} className="hover:underline">
                        {p.title}
                      </Link>
                      <div className="text-xs text-slate-500">/{p.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 uppercase">{p.locale}</td>
                    <td className="px-4 py-3 text-slate-600">{p.category || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.is_published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-4">
                        <Link
                          href={`/admin/blog/${p.id}`}
                          className="text-xs font-medium text-[var(--color-primary-dark)] hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteButton action={del} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
