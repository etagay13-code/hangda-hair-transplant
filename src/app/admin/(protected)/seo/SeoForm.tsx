import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { routing } from '@/i18n/routing';
import type { PageSeo } from '@/types';

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<PageSeo>;
  lockKey?: boolean;
  submitLabel?: string;
}

export function SeoForm({ action, defaults = {}, lockKey = false, submitLabel = 'Save' }: Props) {
  return (
    <form action={action} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label-field">Page key{!lockKey && <span className="text-red-500"> *</span>}</span>
          <input
            type="text"
            name="page_key"
            required={!lockKey}
            readOnly={lockKey}
            defaultValue={defaults.page_key ?? ''}
            className="input-field mt-1.5"
          />
        </label>
        <label className="block">
          <span className="label-field">Locale</span>
          <select
            name="locale"
            defaultValue={defaults.locale ?? 'en'}
            disabled={lockKey}
            className="input-field mt-1.5"
          >
            {routing.locales.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="label-field">Title</span>
        <input type="text" name="title" defaultValue={defaults.title ?? ''} className="input-field mt-1.5" />
      </label>
      <label className="block">
        <span className="label-field">Description</span>
        <textarea name="description" rows={3} defaultValue={defaults.description ?? ''} className="input-field mt-1.5" />
      </label>
      <label className="block">
        <span className="label-field">Keywords</span>
        <input type="text" name="keywords" defaultValue={defaults.keywords ?? ''} className="input-field mt-1.5" />
      </label>
      <label className="block">
        <span className="label-field">Canonical URL</span>
        <input
          type="url"
          name="canonical_url"
          defaultValue={defaults.canonical_url ?? ''}
          className="input-field mt-1.5"
        />
      </label>
      <ImageUploadField
        name="og_image"
        label="OG image"
        bucket="general"
        folder="seo"
        defaultUrl={defaults.og_image}
      />
      <div className="flex justify-end">
        <button type="submit" className="btn-primary">{submitLabel}</button>
      </div>
    </form>
  );
}
