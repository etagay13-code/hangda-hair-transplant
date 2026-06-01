import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { saveSettings, addSetting } from './actions';
import type { SiteSetting } from '@/types';

export const dynamic = 'force-dynamic';

const CATEGORIES = ['general', 'contact', 'social', 'tracking'] as const;

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function SettingsAdminPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const current = (CATEGORIES as readonly string[]).includes(category || '')
    ? category!
    : 'general';

  const supabase = await createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .eq('category', current)
    .order('locale', { ascending: true })
    .order('key', { ascending: true });
  const rows = (data ?? []) as SiteSetting[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site Settings"
        description="Manage dynamic content like contact info, social links, and tracking IDs."
      />

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/admin/settings?category=${c}`}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase transition ${
              c === current
                ? 'bg-[var(--color-primary)] text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-[var(--color-primary)]'
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <form action={saveSettings} className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">No settings in this category. Add one below.</p>
        ) : (
          rows.map((s) => (
            <div key={s.id} className="grid grid-cols-1 items-center gap-3 sm:grid-cols-12">
              <input type="hidden" name="id" value={s.id} />
              <div className="sm:col-span-4">
                <p className="font-mono text-xs text-[var(--color-primary-darker)]">{s.key}</p>
                <p className="text-xs text-slate-500">locale: {s.locale}</p>
              </div>
              <div className="sm:col-span-8">
                <input
                  type="text"
                  name="value"
                  defaultValue={s.value ?? ''}
                  className="input-field"
                />
              </div>
            </div>
          ))
        )}
        {rows.length > 0 && (
          <div className="flex justify-end pt-4">
            <button type="submit" className="btn-primary">Save changes</button>
          </div>
        )}
      </form>

      <details className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--color-primary-darker)]">
          + Add new setting
        </summary>
        <form action={addSetting} className="mt-4 grid gap-4 sm:grid-cols-4">
          <label className="block sm:col-span-1">
            <span className="label-field">Key</span>
            <input name="key" required className="input-field mt-1.5" />
          </label>
          <label className="block sm:col-span-2">
            <span className="label-field">Value</span>
            <input name="value" className="input-field mt-1.5" />
          </label>
          <label className="block">
            <span className="label-field">Locale</span>
            <select name="locale" defaultValue="all" className="input-field mt-1.5">
              <option value="all">all</option>
              <option value="en">en</option>
              <option value="nl">nl</option>
              <option value="tr">tr</option>
            </select>
          </label>
          <input type="hidden" name="category" value={current} />
          <div className="sm:col-span-4 flex justify-end">
            <button type="submit" className="btn-primary">Add</button>
          </div>
        </form>
      </details>
    </div>
  );
}
