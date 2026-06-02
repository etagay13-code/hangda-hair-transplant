import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { TiptapEditor } from '@/components/admin/TiptapEditor';
import { routing } from '@/i18n/routing';
import type { BlogPost } from '@/types';

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<BlogPost>;
  submitLabel?: string;
}

export function BlogForm({ action, defaults = {}, submitLabel = 'Save' }: Props) {
  const tagString = (defaults.tags ?? []).join(', ');
  return (
    <form action={action} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <Text name="title" label="Title" required defaultValue={defaults.title ?? ''} />
        <Text name="slug" label="Slug" required defaultValue={defaults.slug ?? ''} />
        <Select name="locale" label="Locale" options={routing.locales} defaultValue={defaults.locale ?? 'en'} />
        <Text name="author" label="Author" defaultValue={defaults.author ?? 'MyHaar Team'} />
        <Text name="category" label="Category" defaultValue={defaults.category ?? ''} />
        <Text name="tags" label="Tags (comma-separated)" defaultValue={tagString} />
      </div>

      <Textarea name="excerpt" label="Excerpt" rows={3} defaultValue={defaults.excerpt ?? ''} />

      <ImageUploadField
        name="cover_image_url"
        label="Cover image"
        bucket="blog"
        folder="covers"
        defaultUrl={defaults.cover_image_url}
      />

      <div>
        <span className="label-field">Content</span>
        <div className="mt-2">
          <TiptapEditor name="content" defaultValue={defaults.content ?? ''} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Text name="meta_title" label="SEO title" defaultValue={defaults.meta_title ?? ''} />
        <Text name="meta_description" label="SEO description" defaultValue={defaults.meta_description ?? ''} />
      </div>

      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={defaults.is_published ?? false}
          className="h-4 w-4 rounded border-slate-300"
        />
        Published
      </label>

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
