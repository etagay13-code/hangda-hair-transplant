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
  all: 'Tüm diller (varsayılan)',
  en: 'İngilizce (EN)',
  nl: 'Felemenkçe (NL)',
  tr: 'Türkçe (TR)',
};

export function BlockForm({ action, defaults = {}, lockIdentity = false, submitLabel = 'Değişiklikleri Kaydet' }: Props) {
  const currentLocale = defaults.locale ?? 'all';
  return (
    <form action={action} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="rounded-xl border-l-4 border-[var(--color-primary)] bg-[var(--color-primary)]/8 p-5 text-sm leading-relaxed text-slate-700">
        <p className="text-base font-semibold text-[var(--color-primary-darker)]">
          📝 Düzenlenen dil: {LOCALE_LABELS[currentLocale] ?? currentLocale}
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>
            <strong>Boş bırakırsanız</strong> sitedeki yazı çeviri dosyasından gelir
            (yani şu an sitede gördüğünüz İngilizce/Türkçe/NL metin).
          </li>
          <li>
            <strong>Yazarsanız</strong> siteye onu basar, çeviri devre dışı kalır.
          </li>
          <li>
            <em>Tüm diller</em> satırı 3 dilde de geçerli; sadece bir dili özelleştirmek
            isterseniz üst kısımdaki dil seçiminden o dile geçip yazın.
          </li>
        </ul>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Sayfa" required>
          <input
            list="known-pages"
            name="page_key"
            required
            readOnly={lockIdentity}
            defaultValue={defaults.page_key ?? ''}
            className="input-field"
          />
          <datalist id="known-pages">
            {KNOWN_PAGES.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </Field>
        <Field label="Bölüm anahtarı" required>
          <input
            type="text"
            name="section_key"
            required
            readOnly={lockIdentity}
            defaultValue={defaults.section_key ?? ''}
            placeholder="hero, why_us, services…"
            className="input-field"
          />
        </Field>
        <Field label="Dil seçimi">
          <select
            name="locale"
            defaultValue={defaults.locale ?? 'all'}
            disabled={lockIdentity}
            className="input-field"
          >
            <option value="all">Tüm diller (varsayılan)</option>
            {routing.locales.map((l) => (
              <option key={l} value={l}>{LOCALE_LABELS[l] ?? l}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="h-px bg-slate-100" />

      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
        Metin alanları
      </h3>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Üst yazı (Eyebrow)" hint="Başlığın üstündeki küçük büyük harfli yeşil satır">
          <input
            type="text"
            name="eyebrow"
            defaultValue={defaults.eyebrow ?? ''}
            placeholder="Örn: PREMIUM SAÇ EKİMİ"
            className="input-field"
          />
        </Field>
        <Field label="Başlık (Title)" hint="Büyük başlık">
          <input
            type="text"
            name="title"
            defaultValue={defaults.title ?? ''}
            placeholder="Örn: Doğal Saçınızı Geri Kazanın"
            className="input-field"
          />
        </Field>
      </div>

      <Field label="Alt başlık (Subtitle)" hint="Başlığın altındaki tanıtım cümlesi">
        <input
          type="text"
          name="subtitle"
          defaultValue={defaults.subtitle ?? ''}
          placeholder="Örn: Den Haag'da güvenilir saç restorasyonu, ömür boyu garantili."
          className="input-field"
        />
      </Field>

      <Field label="Gövde (Body)" hint="Uzun açıklama paragrafı — hero gibi kısa bölümlerde kullanılmaz">
        <textarea
          name="body"
          rows={4}
          defaultValue={defaults.body ?? ''}
          className="input-field"
        />
      </Field>

      <div className="h-px bg-slate-100" />

      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
        Görsel
      </h3>

      <ImageUploadField
        name="image_url"
        label="Bölüm görseli"
        bucket="general"
        folder="blocks"
        defaultUrl={defaults.image_url}
      />

      <div className="h-px bg-slate-100" />

      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
        Buton (CTA)
      </h3>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Buton metni" hint="Örn: Ücretsiz Konsültasyon">
          <input
            type="text"
            name="cta_label"
            defaultValue={defaults.cta_label ?? ''}
            placeholder="Örn: Ücretsiz Konsültasyon"
            className="input-field"
          />
        </Field>
        <Field label="Buton bağlantısı (URL veya #anchor)" hint="Örn: #contact veya /contact">
          <input
            type="text"
            name="cta_href"
            defaultValue={defaults.cta_href ?? ''}
            placeholder="#contact"
            className="input-field"
          />
        </Field>
      </div>

      <div className="h-px bg-slate-100" />

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Sıra" hint="Küçük = üstte">
          <input
            type="number"
            name="order_index"
            defaultValue={(defaults.order_index ?? 0).toString()}
            className="input-field"
          />
        </Field>
        <label className="flex items-end gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={defaults.is_active ?? true}
            className="h-4 w-4 rounded border-slate-300"
          />
          Aktif (sitede göster)
        </label>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-6">
        <p className="text-xs text-slate-500">
          Kaydet'e bastıktan sonra 2-3 saniye içinde site güncellenir.
        </p>
        <button
          type="submit"
          className="rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--color-primary-dark)]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {hint && <span className="block text-xs text-slate-500">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
