import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { routing } from '@/i18n/routing';
import type { GalleryItem } from '@/types';

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<GalleryItem>;
  submitLabel?: string;
}

export function GalleryForm({ action, defaults = {}, submitLabel = 'Save' }: Props) {
  return (
    <form action={action} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Text name="patient_code" label="Patient code" defaultValue={defaults.patient_code ?? ''} />
        <Text name="technique" label="Technique" defaultValue={defaults.technique ?? ''} />
        <Text name="category" label="Category" defaultValue={defaults.category ?? 'hair'} />
        <Text name="grafts" label="Grafts" type="number" defaultValue={defaults.grafts?.toString() ?? ''} />
        <Text
          name="months_after"
          label="Months after"
          type="number"
          defaultValue={defaults.months_after?.toString() ?? ''}
        />
        <Select name="locale" label="Locale" options={routing.locales} defaultValue={defaults.locale ?? 'en'} />
        <Text
          name="order_index"
          label="Order"
          type="number"
          defaultValue={defaults.order_index?.toString() ?? '0'}
        />
        <div className="flex items-end">
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

      <Textarea name="description" label="Description" rows={3} defaultValue={defaults.description ?? ''} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ImageUploadField
          name="before_image_url"
          label="Before image"
          bucket="gallery"
          folder="before"
          defaultUrl={defaults.before_image_url}
        />
        <ImageUploadField
          name="after_image_url"
          label="After image"
          bucket="gallery"
          folder="after"
          defaultUrl={defaults.after_image_url}
        />
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
  rows = 3,
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
