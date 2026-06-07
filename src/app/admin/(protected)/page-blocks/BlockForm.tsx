import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { routing } from '@/i18n/routing';
import type { PageBlock } from '@/types';

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<PageBlock>;
  lockIdentity?: boolean;
  submitLabel?: string;
}

const KNOWN_PAGES = ['home', 'about', 'services', 'gallery', 'blog', 'contact'];

const LOCALE_LABELS: Record<string, string> = {
  all: 'All locales (master)',
  en: 'English (EN)',
  nl: 'Nederlands (NL)',
  tr: 'Türkçe (TR)',
};

export function BlockForm({ action, defaults = {}, lockIdentity = false, submitLabel = 'Save' }: Props) {
  const currentLocale = defaults.locale ?? 'all';
  return (
    <form action={action} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="rounded-lg border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/8 p-4 text-sm leading-relaxed text-[var(--color-primary-darker)]">
        <p className="font-semibold">Editing in: {LOCALE_LABELS[currentLocale] ?? currentLocale}</p>
        <p className="mt-1 text-slate-700">
          Rows with locale <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">all</code> apply to every language unless overridden. Leave a text field empty to fall back to the built-in translation. Create a locale-specific row (en / nl / tr) to override a single language.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block">
          <span className="label-field">Page <span className="text-red-500">*</span></span>
          <input
            list="known-pages"
            name="page_key"
            required
            readOnly={lockIdentity}
            defaultValue={defaults.page_key ?? ''}
            className="input-field mt-1.5"
          />
          <datalist id="known-pages">
            {KNOWN_PAGES.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </label>
        <label className="block">
          <span className="label-field">Section key <span className="text-red-500">*</span></span>
          <input
            type="text"
            name="section_key"
            required
            readOnly={lockIdentity}
            defaultValue={defaults.section_key ?? ''}
            placeholder="hero, why_us, services_intro…"
            className="input-field mt-1.5"
          />
        </label>
        <label className="block">
          <span className="label-field">Locale (which language?)</span>
          <select
            name="locale"
            defaultValue={defaults.locale ?? 'all'}
            disabled={lockIdentity}
            className="input-field mt-1.5"
          >
            <option value="all">All locales (master)</option>
            {routing.locales.map((l) => (
              <option key={l} value={l}>{LOCALE_LABELS[l] ?? l}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Text name="eyebrow" label="Eyebrow (small uppercase line above title)" defaultValue={defaults.eyebrow ?? ''} />
        <Text name="title" label="Title" defaultValue={defaults.title ?? ''} />
      </div>

      <Text name="subtitle" label="Subtitle" defaultValue={defaults.subtitle ?? ''} />

      <Textarea name="body" label="Body" rows={4} defaultValue={defaults.body ?? ''} />

      <ImageUploadField
        name="image_url"
        label="Image"
        bucket="general"
        folder="blocks"
        defaultUrl={defaults.image_url}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Text name="cta_label" label="CTA label" defaultValue={defaults.cta_label ?? ''} />
        <Text name="cta_href" label="CTA href (URL or #anchor)" defaultValue={defaults.cta_href ?? ''} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Text
          name="order_index"
          type="number"
          label="Order"
          defaultValue={(defaults.order_index ?? 0).toString()}
        />
        <label className="flex items-end gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={defaults.is_active ?? true}
            className="h-4 w-4 rounded border-slate-300"
          />
          Active
        </label>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">{submitLabel}</button>
      </div>
    </form>
  );
}

function Text({
  name,
  label,
  type = 'text',
  defaultValue = '',
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="label-field">{label}</span>
      <input type={type} name={name} defaultValue={defaultValue} className="input-field mt-1.5" />
    </label>
  );
}

function Textarea({
  name,
  label,
  rows = 4,
  defaultValue = '',
}: {
  name: string;
  label: string;
  rows?: number;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="label-field">{label}</span>
      <textarea name={name} rows={rows} defaultValue={defaultValue} className="input-field mt-1.5" />
    </label>
  );
}
