import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NewButton, PageHeader } from '@/components/admin/Toolbar';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deletePageSeo } from './actions';
import type { PageSeo } from '@/types';

export const dynamic = 'force-dynamic';

export default async function SeoAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('page_seo')
    .select('*')
    .order('page_key', { ascending: true })
    .order('locale', { ascending: true });
  const rows = (data ?? []) as PageSeo[];

  const grouped = rows.reduce<Record<string, PageSeo[]>>((acc, row) => {
    (acc[row.page_key] ||= []).push(row);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Page SEO"
        description="Set titles, descriptions and OG images per page and locale."
        actions={<NewButton href="/admin/seo/new" label="Add entry" />}
      />

      {Object.keys(grouped).length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
          No SEO entries yet.
        </p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([key, entries]) => (
            <div key={key} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary-darker)]">
                  /{key}
                </h2>
              </div>
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5">Locale</th>
                    <th className="px-4 py-2.5">Title</th>
                    <th className="px-4 py-2.5">Description</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {entries.map((r) => {
                    const del = async () => {
                      'use server';
                      await deletePageSeo(r.id);
                    };
                    return (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 text-xs font-semibold uppercase text-slate-500">
                          {r.locale}
                        </td>
                        <td className="px-4 py-2.5 text-[var(--color-primary-darker)]">
                          {r.title || '—'}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">
                          {r.description ? (
                            <span className="line-clamp-1">{r.description}</span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="inline-flex items-center gap-4">
                            <Link
                              href={`/admin/seo/${r.id}`}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
