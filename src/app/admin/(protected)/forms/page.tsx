import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteFormRedirect, upsertFormRedirect } from './actions';
import type { FormRedirect } from '@/types';

export const dynamic = 'force-dynamic';

const KNOWN_FORMS = ['contact', 'consultation', 'quote', 'callback', 'newsletter'] as const;

export default async function FormRedirectsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('form_redirects').select('*').order('form_name');
  const existing = (data ?? []) as FormRedirect[];

  const byName = new Map(existing.map((r) => [r.form_name, r] as const));

  const allForms: Array<{ name: string; row?: FormRedirect }> = [
    ...KNOWN_FORMS.map((name) => ({ name, row: byName.get(name) })),
    ...existing
      .filter((r) => !(KNOWN_FORMS as readonly string[]).includes(r.form_name))
      .map((r) => ({ name: r.form_name, row: r })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Form Redirects"
        description="Configure where each form's submissions go: success URL, email recipients, webhook."
      />

      <div className="space-y-5">
        {allForms.map(({ name, row }) => {
          const del = row
            ? async () => {
                'use server';
                await deleteFormRedirect(row.id);
              }
            : undefined;
          return (
            <form
              key={name}
              action={upsertFormRedirect}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-[var(--color-primary-darker)]">
                  {name}
                </h2>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked={row?.is_active ?? true}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    Active
                  </label>
                  {del && <DeleteButton action={del} confirm={`Delete redirect for "${name}"?`} />}
                </div>
              </div>
              <input type="hidden" name="form_name" value={name} />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Text name="success_url" label="Success URL" placeholder="/thank-you" defaultValue={row?.success_url ?? ''} />
                <Text name="webhook_url" label="Webhook URL (POST)" defaultValue={row?.webhook_url ?? ''} />
                <Text name="email_to" label="Notify (email_to)" defaultValue={row?.email_to ?? ''} />
                <Text name="email_cc" label="CC (email_cc)" defaultValue={row?.email_cc ?? ''} />
              </div>
              <div className="mt-5 flex justify-end">
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          );
        })}
      </div>
    </div>
  );
}

function Text({
  name,
  label,
  defaultValue = '',
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="label-field">{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="input-field mt-1.5"
      />
    </label>
  );
}
