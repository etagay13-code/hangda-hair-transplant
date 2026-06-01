import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { routing } from '@/i18n/routing';
import type { Testimonial } from '@/types';

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<Testimonial>;
  submitLabel?: string;
}

export function TestimonialForm({ action, defaults = {}, submitLabel = 'Save' }: Props) {
  return (
    <form action={action} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Text name="name" label="Name" required defaultValue={defaults.name ?? ''} />
        <Text name="country" label="Country" defaultValue={defaults.country ?? ''} />
        <Select name="rating" label="Rating" options={['1', '2', '3', '4', '5']} defaultValue={(defaults.rating ?? 5).toString()} />
        <Text name="technique" label="Technique" defaultValue={defaults.technique ?? ''} />
        <Text name="grafts" type="number" label="Grafts" defaultValue={defaults.grafts?.toString() ?? ''} />
        <Select name="locale" label="Locale" options={routing.locales} defaultValue={defaults.locale ?? 'en'} />
      </div>
      <label className="block">
        <span className="label-field">Comment</span>
        <textarea name="comment" rows={4} defaultValue={defaults.comment ?? ''} className="input-field mt-1.5" />
      </label>
      <div className="grid gap-6 lg:grid-cols-2">
        <ImageUploadField
          name="image_url"
          label="Patient photo"
          bucket="general"
          folder="testimonials"
          defaultUrl={defaults.image_url}
        />
        <label className="block">
          <span className="label-field">Video URL (YouTube/Vimeo)</span>
          <input
            type="url"
            name="video_url"
            defaultValue={defaults.video_url ?? ''}
            className="input-field mt-1.5"
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={defaults.is_active ?? true}
            className="h-4 w-4 rounded border-slate-300"
          />
          Active
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={defaults.is_featured ?? false}
            className="h-4 w-4 rounded border-slate-300"
          />
          Featured
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
