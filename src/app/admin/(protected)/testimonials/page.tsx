import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NewButton, PageHeader } from '@/components/admin/Toolbar';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteTestimonial } from './actions';
import type { Testimonial } from '@/types';

export const dynamic = 'force-dynamic';

export default async function TestimonialsAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });
  const rows = (data ?? []) as Testimonial[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Patient stories and reviews."
        actions={<NewButton href="/admin/testimonials/new" />}
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {rows.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">No testimonials yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Procedure</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((t) => {
                const del = async () => {
                  'use server';
                  await deleteTestimonial(t.id);
                };
                return (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-[var(--color-primary-darker)]">
                      <Link href={`/admin/testimonials/${t.id}`} className="hover:underline">
                        {t.name}
                      </Link>
                      {t.country && <div className="text-xs text-slate-500">{t.country}</div>}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{'★'.repeat(t.rating)}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {[t.technique, t.grafts ? `${t.grafts} grafts` : null]
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                            t.is_active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {t.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {t.is_featured && (
                          <span className="inline-block rounded-full bg-[var(--color-primary)]/12 px-2 py-0.5 text-xs font-medium text-[var(--color-primary-darker)]">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-4">
                        <Link
                          href={`/admin/testimonials/${t.id}`}
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
