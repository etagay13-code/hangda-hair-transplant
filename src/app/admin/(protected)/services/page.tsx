import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NewButton, PageHeader } from '@/components/admin/Toolbar';
import { LocaleTabs } from '@/components/admin/LocaleTabs';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteService } from './actions';
import { routing } from '@/i18n/routing';
import type { Service } from '@/types';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ locale?: string }>;
}

export default async function ServicesAdminPage({ searchParams }: Props) {
  const { locale } = await searchParams;
  const current = (routing.locales as readonly string[]).includes(locale || '')
    ? locale!
    : 'en';

  const supabase = await createClient();
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('locale', current)
    .order('order_index', { ascending: true });

  const rows = (data ?? []) as Service[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage hair restoration services shown on the public site."
        actions={<NewButton href={`/admin/services/new?locale=${current}`} />}
      />
      <LocaleTabs current={current} />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {rows.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">
            No services for this locale yet.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((s) => {
                const del = async () => {
                  'use server';
                  await deleteService(s.id);
                };
                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500">{s.order_index}</td>
                    <td className="px-4 py-3 font-medium text-[var(--color-primary-darker)]">
                      <Link href={`/admin/services/${s.id}`} className="hover:underline">
                        {s.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{s.slug}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {s.price_from != null ? `€${s.price_from.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          s.is_active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-4">
                        <Link
                          href={`/admin/services/${s.id}`}
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
