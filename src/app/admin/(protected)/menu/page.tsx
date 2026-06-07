import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NewButton, PageHeader } from '@/components/admin/Toolbar';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteNavItem, reorderNavItem } from './actions';
import type { NavItem } from '@/types';

export const dynamic = 'force-dynamic';

const GROUP_LABELS: Record<string, string> = {
  primary: 'Primary navigation (header)',
  footer: 'Footer links',
};

export default async function MenuAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('nav_items')
    .select('*')
    .order('group_key', { ascending: true })
    .order('order_index', { ascending: true });
  const items = (data ?? []) as NavItem[];

  const grouped = items.reduce<Record<string, NavItem[]>>((acc, row) => {
    (acc[row.group_key] ||= []).push(row);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <PageHeader
        title="Menus"
        description="Add, edit, reorder or hide navigation links. Changes apply to the live site immediately."
        actions={<NewButton href="/admin/menu/new" label="Add item" />}
      />

      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-sm text-slate-600">
            No menu items yet. Run migration{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">008_menu_and_scripts.sql</code>{' '}
            in Supabase to seed the default navbar.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([group, rows]) => (
            <section
              key={group}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <header className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary-darker)]">
                  {GROUP_LABELS[group] ?? group}
                </h2>
              </header>
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5">Order</th>
                    <th className="px-4 py-2.5">Label</th>
                    <th className="px-4 py-2.5">URL</th>
                    <th className="px-4 py-2.5">Locale</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((item) => {
                    const del = async () => {
                      'use server';
                      await deleteNavItem(item.id);
                    };
                    const up = async () => {
                      'use server';
                      await reorderNavItem(item.id, 'up');
                    };
                    const down = async () => {
                      'use server';
                      await reorderNavItem(item.id, 'down');
                    };
                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5">
                          <div className="inline-flex items-center gap-1">
                            <form action={up}>
                              <button
                                type="submit"
                                aria-label="Move up"
                                className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-[var(--color-primary-darker)]"
                              >
                                ↑
                              </button>
                            </form>
                            <span className="w-6 text-center font-mono text-xs text-slate-500">
                              {item.order_index}
                            </span>
                            <form action={down}>
                              <button
                                type="submit"
                                aria-label="Move down"
                                className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-[var(--color-primary-darker)]"
                              >
                                ↓
                              </button>
                            </form>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 font-medium text-[var(--color-primary-darker)]">
                          <Link href={`/admin/menu/${item.id}`} className="hover:underline">
                            {item.label}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-slate-600">{item.href}</td>
                        <td className="px-4 py-2.5 text-xs uppercase text-slate-500">{item.locale}</td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                              item.is_active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {item.is_active ? 'Visible' : 'Hidden'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="inline-flex items-center gap-4">
                            <Link
                              href={`/admin/menu/${item.id}`}
                              className="text-xs font-medium text-[var(--color-primary-dark)] hover:underline"
                            >
                              Edit
                            </Link>
                            <DeleteButton action={del} confirm={`Remove "${item.label}"?`} />
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
