import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import type { Contact } from '@/types';

export const dynamic = 'force-dynamic';

const STATUSES = ['all', 'new', 'contacted', 'qualified', 'won', 'lost'] as const;

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-amber-100 text-amber-800',
  contacted: 'bg-blue-100 text-blue-800',
  qualified: 'bg-violet-100 text-violet-800',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-slate-200 text-slate-700',
};

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function ContactsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const filter = (STATUSES as readonly string[]).includes(status || '') ? status! : 'all';

  const supabase = await createClient();
  let query = supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);
  if (filter !== 'all') query = query.eq('status', filter);
  const { data } = await query;
  const rows = (data ?? []) as Contact[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Submissions"
        description="Track inbound leads, change status, and assign follow-ups."
      />

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const active = filter === s;
          return (
            <Link
              key={s}
              href={s === 'all' ? '/admin/contacts' : `/admin/contacts?status=${s}`}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase transition ${
                active
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-[var(--color-primary)]'
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {rows.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">No submissions.</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-[var(--color-primary-darker)]">
                    <Link href={`/admin/contacts/${c.id}`} className="hover:underline">
                      {c.name}
                    </Link>
                    {c.country && (
                      <div className="text-xs text-slate-500">{c.country}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {c.email && <div>{c.email}</div>}
                    {c.phone && <div className="text-xs text-slate-500">{c.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{c.service_interest || '—'}</td>
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
    </div>
  );
}
