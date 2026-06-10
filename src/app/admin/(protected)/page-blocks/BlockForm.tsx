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
  ar: 'Arapça (AR)',
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

      {defaults.page_key === 'home' && defaults.section_key === 'hero' && (
        <HeroExtras defaults={defaults.extra as HeroExtra | null} />
      )}

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

interface HeroStat { label: string; value: string; visible?: boolean }
interface HeroBadge { label: string; value: string; visible?: boolean }
interface HeroResultCard { eyebrow: string; title: string; visible?: boolean }
interface HeroExtra {
  stats?: HeroStat[];
  badgeTopLeft?: HeroBadge;
  badgeBottomRight?: HeroBadge;
  resultCard?: HeroResultCard;
}

function HeroExtras({ defaults }: { defaults: HeroExtra | null }) {
  const d = defaults ?? {};
  const stats: HeroStat[] = d.stats ?? [
    { label: 'Happy Patients', value: '15K+', visible: true },
    { label: 'Years Experience', value: '20+', visible: true },
    { label: 'Success Rate', value: '98%', visible: true },
    { label: 'Countries Served', value: '60+', visible: true },
  ];
  while (stats.length < 4) stats.push({ label: '', value: '', visible: false });
  const badgeTL = d.badgeTopLeft ?? { label: 'Success rate', value: '98%', visible: true };
  const badgeBR = d.badgeBottomRight ?? { label: 'Written guarantee', value: '18 mo.', visible: true };
  const resultCard = d.resultCard ?? {
    eyebrow: 'Recent result · MyHaar FUE',
    title: '3,400 grafts · 12 months',
    visible: true,
  };

  return (
    <>
      <div className="h-px bg-slate-100" />

      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-500">
        Hero özel alanları
      </h3>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h4 className="text-sm font-bold text-[var(--color-primary-darker)]">
          İstatistik şeridi
        </h4>
        <p className="mt-1 text-xs text-slate-600">
          Hero altındaki 4 istatistik kutusu. Etiket boş bırakırsanız veya "Göster" kapalıysa o sütun gizlenir. Değer alanına <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px]">15K+</code> / <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px]">98%</code> gibi yazın; rakam kısmı say-sayım animasyonu ile çıkar.
        </p>
        <div className="mt-4 space-y-3">
          {stats.slice(0, 4).map((s, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[1fr_140px_100px]">
              <input
                type="text"
                name={`stat_${i}_label`}
                defaultValue={s.label}
                placeholder={`Etiket ${i + 1}`}
                className="input-field"
              />
              <input
                type="text"
                name={`stat_${i}_value`}
                defaultValue={s.value}
                placeholder="15K+"
                className="input-field"
              />
              <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  name={`stat_${i}_visible`}
                  defaultChecked={s.visible !== false}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Göster
              </label>
            </div>
          ))}
        </div>
      </div>

      <BadgeEditor
        prefix="badgeTopLeft"
        title="Sol üst rozet (görselin üstünde)"
        defaults={badgeTL}
        labelExample="Success rate"
        valueExample="98%"
      />

      <BadgeEditor
        prefix="badgeBottomRight"
        title="Sağ alt rozet (görselin üstünde)"
        defaults={badgeBR}
        labelExample="Written guarantee"
        valueExample="18 mo."
      />

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h4 className="text-sm font-bold text-[var(--color-primary-darker)]">
          🏷 Sonuç kartı (görselin altındaki kutu)
        </h4>
        <p className="mt-1 text-xs text-slate-600">
          Hero görselinin altındaki beyaz kutu — "Recent result · MyHaar FUE / 3,400 grafts · 12 months".
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            name="resultCard_eyebrow"
            defaultValue={resultCard.eyebrow}
            placeholder="Recent result · MyHaar FUE"
            className="input-field"
          />
          <input
            type="text"
            name="resultCard_title"
            defaultValue={resultCard.title}
            placeholder="3,400 grafts · 12 months"
            className="input-field"
          />
        </div>
        <label className="mt-3 inline-flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            name="resultCard_visible"
            defaultChecked={resultCard.visible !== false}
            className="h-4 w-4 rounded border-slate-300"
          />
          Bu kutuyu göster
        </label>
      </div>
    </>
  );
}

function BadgeEditor({
  prefix,
  title,
  defaults,
  labelExample,
  valueExample,
}: {
  prefix: string;
  title: string;
  defaults: HeroBadge;
  labelExample: string;
  valueExample: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <h4 className="text-sm font-bold text-[var(--color-primary-darker)]">{title}</h4>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          name={`${prefix}_label`}
          defaultValue={defaults.label}
          placeholder={labelExample}
          className="input-field"
        />
        <input
          type="text"
          name={`${prefix}_value`}
          defaultValue={defaults.value}
          placeholder={valueExample}
          className="input-field"
        />
      </div>
      <label className="mt-3 inline-flex items-center gap-2 text-xs text-slate-600">
        <input
          type="checkbox"
          name={`${prefix}_visible`}
          defaultChecked={defaults.visible !== false}
          className="h-4 w-4 rounded border-slate-300"
        />
        Bu rozeti göster
      </label>
    </div>
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
