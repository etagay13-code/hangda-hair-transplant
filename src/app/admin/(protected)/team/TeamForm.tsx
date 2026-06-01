import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { routing } from '@/i18n/routing';
import type { TeamMember } from '@/types';

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<TeamMember>;
  submitLabel?: string;
}

export function TeamForm({ action, defaults = {}, submitLabel = 'Save' }: Props) {
  return (
    <form action={action} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <Text name="name" label="Name" required defaultValue={defaults.name ?? ''} />
        <Text name="title" label="Title" defaultValue={defaults.title ?? ''} />
        <Text name="specialization" label="Specialization" defaultValue={defaults.specialization ?? ''} />
        <Select name="locale" label="Locale" options={routing.locales} defaultValue={defaults.locale ?? 'en'} />
        <Text
          name="order_index"
          type="number"
          label="Order"
          defaultValue={defaults.order_index?.toString() ?? '0'}
        />
        <label className="inline-flex items-end gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={defaults.is_active ?? true}
            className="h-4 w-4 rounded border-slate-300"
          />
          Active
        </label>
      </div>
      <label className="block">
        <span className="label-field">Bio</span>
        <textarea name="bio" rows={4} defaultValue={defaults.bio ?? ''} className="input-field mt-1.5" />
      </label>
      <ImageUploadField
        name="image_url"
        label="Photo"
        bucket="team"
        folder="members"
        defaultUrl={defaults.image_url}
      />
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
