import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NewButton, PageHeader } from '@/components/admin/Toolbar';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteBlock } from './actions';
import type { PageBlock } from '@/types';

export const dynamic = 'force-dynamic';

const PAGE_LABELS: Record<string, string> = {
  home: 'Homepage',
  about: 'About',
  services: 'Services',
  gallery: 'Gallery',
  blog: 'Blog',
  contact: 'Contact',
};

export default async function PageBlocksAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('page_blocks')
    .select('*')
    .order('page_key', { ascending: true })
    .order('section_key', { ascending: true })
    .order('locale', { ascending: true });
  const blocks = (data ?? []) as PageBlock[];

  const grouped = blocks.reduce<Record<string, PageBlock[]>>((acc, row) => {
    (acc[row.page_key] ||= []).push(row);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <PageHeader
        title="Page Blocks"
        description="Edit eyebrow, title, subtitle, body, image and CTA for every page section. Changes go live immediately — affected pages are revalidated on save."
        actions={<NewButton href="/admin/page-blocks/new" label="Add block" />}
      />

      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-sm text-slate-600">
            No blocks yet. Run the SQL migration <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">007_page_blocks.sql</code> in Supabase to seed the defaults.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([pageKey, items]) => (
            <section
              key={pageKey}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary-darker)]">
                  {PAGE_LABELS[pageKey] ?? `/${pageKey}`}
                </h2>
                <span className="text-xs text-slate-500">{items.length} block{items.length === 1 ? '' : 's'}</span>
              </header>
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5">Section</th>
                    <th className="px-4 py-2.5">Locale</th>
                    <th className="px-4 py-2.5">Title</th>
                    <th className="px-4 py-2.5">Image</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((b) => {
                    const del = async () => {
                      'use server';
                      await deleteBlock(b.id, b.page_key);
                    };
                    return (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-mono text-xs text-[var(--color-primary-darker)]">
                          {b.section_key}
                        </td>
                        <td className="px-4 py-2.5 text-xs uppercase text-slate-500">{b.locale}</td>
                        <td className="px-4 py-2.5 text-slate-700">
                          {b.title ? (
                            <span className="line-clamp-1">{b.title}</span>
                          ) : (
                            <span className="text-slate-400 italic">no title</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          {b.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={b.image_url}
                              alt=""
                              className="h-9 w-12 rounded object-cover"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                              b.is_active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {b.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="inline-flex items-center gap-4">
                            <Link
                              href={`/admin/page-blocks/${b.id}`}
                              className="text-xs font-medium text-[var(--color-primary-dark)] hover:underline"
                            >
                              Edit
                            </Link>
                            <DeleteButton action={del} confirm={`Delete ${b.section_key} (${b.locale})?`} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
