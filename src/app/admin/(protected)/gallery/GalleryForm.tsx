import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { routing } from '@/i18n/routing';
import type { GalleryItem } from '@/types';

interface ServiceOption {
  slug: string;
  title: string;
}

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<GalleryItem> & { service_slug?: string | null };
  submitLabel?: string;
  services?: ServiceOption[];
}

export function GalleryForm({ action, defaults = {}, submitLabel = 'Save', services = [] }: Props) {
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

      <label className="block">
        <span className="label-field">Bu vaka hangi hizmet detay sayfasında gösterilsin?</span>
        <select
          name="service_slug"
          defaultValue={defaults.service_slug ?? ''}
          className="input-field mt-1.5"
        >
          <option value="">— Hiçbiri (sadece /gallery sayfasında) —</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title} ({s.slug})
            </option>
          ))}
        </select>
        <span className="mt-1 block text-xs text-slate-500">
          Seçtiğiniz hizmetin detay sayfasındaki &quot;Real results&quot; bölümünde görünür.
          Boş bırakırsanız sadece genel galeri sayfasında çıkar.
        </span>
      </label>

      <ImageUploadField
        name="image_url"
        label="Vaka görseli (öncesi/sonrası yan yana hazırlanmış tek görsel)"
        bucket="gallery"
        folder="cases"
        defaultUrl={defaults.before_image_url || defaults.after_image_url || null}
      />
      <p className="-mt-3 text-xs text-slate-500">
        Tek bir görsel yükleyin — öncesi ve sonrası bu görselin içinde yan yana
        olmalı. Site bu görseli olduğu gibi gösterir.
      </p>

      <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <summary className="cursor-pointer text-xs font-semibold text-slate-600">
          Gelişmiş: ayrı öncesi + sonrası yüklemek istiyorum
        </summary>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          <ImageUploadField
            name="before_image_url_explicit"
            label="Sadece öncesi"
            bucket="gallery"
            folder="before"
            defaultUrl={
              defaults.before_image_url &&
              defaults.before_image_url !== defaults.after_image_url
                ? defaults.before_image_url
                : null
            }
          />
          <ImageUploadField
            name="after_image_url_explicit"
            label="Sadece sonrası"
            bucket="gallery"
            folder="after"
            defaultUrl={
              defaults.after_image_url &&
              defaults.after_image_url !== defaults.before_image_url
                ? defaults.after_image_url
                : null
            }
          />
          <p className="lg:col-span-2 text-[11px] text-slate-500">
            İkisini ayrı yüklerseniz site 2 sütunlu kart olarak gösterir. Bu
            alanları doldurursanız yukarıdaki tek görsel ihmal edilir.
          </p>
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
