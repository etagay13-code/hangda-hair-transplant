import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteContact, updateContact } from '../actions';
import type { Contact } from '@/types';

export const dynamic = 'force-dynamic';

const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'] as const;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ContactDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('contacts').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const contact = data as Contact;

  const update = updateContact.bind(null, id);
  const del = async () => {
    'use server';
    await deleteContact(id);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={contact.name}
        description={`Submitted ${new Date(contact.created_at).toLocaleString()}`}
        actions={
          <>
            <Link
              href="/admin/contacts"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              ← Back
            </Link>
            <DeleteButton action={del} confirm="Delete this submission permanently?" />
          </>
        }
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--color-primary-darker)]">
            Submission details
          </h2>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <Detail label="Email" value={contact.email} />
            <Detail label="Phone" value={contact.phone} />
            <Detail label="Country" value={contact.country} />
            <Detail label="Locale" value={contact.locale} />
            <Detail label="Service of interest" value={contact.service_interest} />
            <Detail label="Hair loss type" value={contact.hair_loss_type} />
            <Detail label="Source page" value={contact.source_page} />
            <Detail
              label="UTM"
              value={[contact.utm_source, contact.utm_medium, contact.utm_campaign]
                .filter(Boolean)
                .join(' / ')}
            />
          </dl>
          {contact.message && (
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Message</dt>
              <dd className="mt-2 whitespace-pre-wrap rounded-md bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {contact.message}
              </dd>
            </div>
          )}
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--color-primary-darker)]">Manage</h2>
          <form action={update} className="mt-6 space-y-4">
            <label className="block">
              <span className="label-field">Status</span>
              <select name="status" defaultValue={contact.status} className="input-field mt-1.5">
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label-field">Assigned to</span>
              <input
                type="text"
                name="assigned_to"
                defaultValue={contact.assigned_to ?? ''}
                className="input-field mt-1.5"
              />
            </label>
            <label className="block">
              <span className="label-field">Follow-up date</span>
              <input
                type="date"
                name="follow_up_date"
                defaultValue={contact.follow_up_date ?? ''}
                className="input-field mt-1.5"
              />
            </label>
            <label className="block">
              <span className="label-field">Notes</span>
              <textarea
                name="notes"
                rows={5}
                defaultValue={contact.notes ?? ''}
                className="input-field mt-1.5"
              />
            </label>
            <button type="submit" className="btn-primary w-full">
              Save Changes
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-800">{value || '—'}</dd>
    </div>
  );
}
