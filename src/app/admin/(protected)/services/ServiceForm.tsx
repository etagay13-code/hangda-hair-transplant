import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { Service } from '@/types';
import { routing } from '@/i18n/routing';

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<Service>;
  submitLabel?: string;
}

export function ServiceForm({ action, defaults = {}, submitLabel = 'Save' }: Props) {
  return (
    <form action={action} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <Text name="title" label="Title" required defaultValue={defaults.title ?? ''} />
        <Text name="slug" label="Slug" required defaultValue={defaults.slug ?? ''} />
        <Select name="locale" label="Locale" options={routing.locales} defaultValue={defaults.locale ?? 'en'} />
        <Text name="icon" label="Icon (lucide name)" defaultValue={defaults.icon ?? ''} />
        <Text name="duration" label="Duration" defaultValue={defaults.duration ?? ''} />
        <Text
          name="price_from"
          type="number"
          label="Price from (€)"
          defaultValue={defaults.price_from?.toString() ?? ''}
        />
        <Text
          name="order_index"
          type="number"
          label="Order"
          defaultValue={defaults.order_index?.toString() ?? '0'}
        />
        <div className="flex items-end gap-3">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={defaults.is_active ?? true}
              className="h-4 w-4 rounded border-slate-300"
            />
            Active
          </label>
        </div>
      </div>

      <Text
        name="short_description"
        label="Short description"
        defaultValue={defaults.short_description ?? ''}
      />
      <Textarea
        name="description"
        label="Description"
        rows={3}
        defaultValue={defaults.description ?? ''}
      />
      <Textarea
        name="content"
        label="Long content (HTML or plain text)"
        rows={6}
        defaultValue={defaults.content ?? ''}
      />

      <ImageUploadField
        name="image_url"
        label="Image"
        bucket="general"
        folder="services"
        defaultUrl={defaults.image_url}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Text name="meta_title" label="SEO title" defaultValue={defaults.meta_title ?? ''} />
        <Text name="meta_description" label="SEO description" defaultValue={defaults.meta_description ?? ''} />
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
  required = false,
  defaultValue = '',
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="label-field">{label}{required && <span className="text-red-500"> *</span>}</span>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="input-field mt-1.5"
      />
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

function Select({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: readonly string[];
  defaultValue: string;
}) {
  return (
    <label className="block">
      <span className="label-field">{label}</span>
      <select name={name} defaultValue={defaultValue} className="input-field mt-1.5">
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
