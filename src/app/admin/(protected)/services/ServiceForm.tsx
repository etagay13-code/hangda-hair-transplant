import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { ContentSectionsEditor, type ContentSection } from '@/components/admin/ContentSectionsEditor';
import type { Service } from '@/types';
import { routing } from '@/i18n/routing';

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<Service> & {
    content_sections?: unknown;
    included_items?: unknown;
    eligibility_yes?: unknown;
    eligibility_no?: unknown;
    who_for_eyebrow?: string | null;
    who_for_title?: string | null;
    who_for_subtitle?: string | null;
  };
  submitLabel?: string;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string');
  }
  return [];
}

function toSectionArray(value: unknown): ContentSection[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (v): v is { title?: unknown; body?: unknown } =>
        v != null && typeof v === 'object'
    )
    .map((v) => ({
      title: typeof v.title === 'string' ? v.title : '',
      body: typeof v.body === 'string' ? v.body : '',
    }));
}

export function ServiceForm({ action, defaults = {}, submitLabel = 'Save' }: Props) {
  const included = toStringArray(defaults.included_items).join('\n');
  const yes = toStringArray(defaults.eligibility_yes).join('\n');
  const no = toStringArray(defaults.eligibility_no).join('\n');
  const sections = toSectionArray(defaults.content_sections);

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
        label="Short description (hero altındaki kısa açıklama)"
        defaultValue={defaults.short_description ?? ''}
      />
      <Textarea
        name="description"
        label="Description (alternatif kısa açıklama)"
        rows={3}
        defaultValue={defaults.description ?? ''}
      />

      <ImageUploadField
        name="image_url"
        label="Hero görseli"
        bucket="general"
        folder="services"
        defaultUrl={defaults.image_url}
      />

      {/* Structured sections — replaces the old "Long content (HTML)" textarea */}
      <ContentSectionsEditor name="content_sections" defaultValue={sections} />

      {/* Who this procedure is for */}
      <fieldset className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <legend className="px-2 text-sm font-semibold text-slate-900">
          Kimlere uygun? bölümü
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Text
            name="who_for_eyebrow"
            label="Üst etiket"
            defaultValue={defaults.who_for_eyebrow ?? ''}
            placeholder="Are you a candidate?"
          />
          <Text
            name="who_for_title"
            label="Başlık"
            defaultValue={defaults.who_for_title ?? ''}
            placeholder="Who this procedure is for"
          />
        </div>
        <Textarea
          name="who_for_subtitle"
          label="Alt açıklama"
          rows={2}
          defaultValue={defaults.who_for_subtitle ?? ''}
          placeholder="We turn down patients when…"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Textarea
            name="eligibility_yes"
            label="✓ Uygun adaylar (her satır bir madde)"
            rows={5}
            defaultValue={yes}
            placeholder="Stable hair-loss pattern&#10;Sufficient donor density&#10;..."
          />
          <Textarea
            name="eligibility_no"
            label="✗ Uygun olmayan adaylar (her satır bir madde)"
            rows={5}
            defaultValue={no}
            placeholder="Active autoimmune hair-loss&#10;Uncontrolled diabetes&#10;..."
          />
        </div>
      </fieldset>

      <Textarea
        name="included_items"
        label="Pakete dahil olanlar (her satır bir madde)"
        rows={6}
        defaultValue={included}
        placeholder="Free surgeon consultation&#10;Pre-operative blood tests&#10;The full procedure&#10;..."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Text name="meta_title" label="SEO title" defaultValue={defaults.meta_title ?? ''} />
        <Text name="meta_description" label="SEO description" defaultValue={defaults.meta_description ?? ''} />
      </div>

      <details className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
        <summary className="cursor-pointer font-semibold text-slate-700">
          Eski HTML içerik (gelişmiş — yeni bölümler kullanılıyorsa boş bırakın)
        </summary>
        <div className="mt-3">
          <p className="text-xs text-slate-500">
            content_sections boşsa fallback olarak bu HTML kullanılır. Yeni
            yapılı bölümlere geçtiyseniz bunu temizleyebilirsiniz.
          </p>
          <textarea
            name="content"
            rows={6}
            defaultValue={defaults.content ?? ''}
            className="input-field mt-2 font-mono text-xs"
          />
        </div>
      </details>

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
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="label-field">{label}{required && <span className="text-red-500"> *</span>}</span>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
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
  placeholder,
}: {
  name: string;
  label: string;
  rows?: number;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="label-field">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
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
