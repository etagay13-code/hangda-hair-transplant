import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { savePopup } from '../footer/actions';
import type { SiteSetting } from '@/types';

export const dynamic = 'force-dynamic';

const LOCALES = ['en', 'nl', 'tr'] as const;

const TEXT_FIELDS: Array<{
  key: string;
  label: string;
  hint?: string;
  placeholderByLocale?: Record<string, string>;
  multiline?: boolean;
}> = [
  {
    key: 'popup_line_one',
    label: 'Başlık 1. satır',
    placeholderByLocale: {
      en: 'THE BEST TIME FOR',
      nl: 'DE BESTE TIJD VOOR',
      tr: 'SAÇ EKİMİ İÇİN',
    },
  },
  {
    key: 'popup_line_two',
    label: 'Başlık 2. satır (yeşil vurgu)',
    placeholderByLocale: {
      en: 'A HAIR RESTORATION?',
      nl: 'EEN HAARRESTAURATIE?',
      tr: 'EN İYİ ZAMAN?',
    },
  },
  {
    key: 'popup_line_three',
    label: 'Başlık 3. satır',
    placeholderByLocale: {
      en: 'NOW IS THE TIME!',
      nl: 'NU IS HET MOMENT!',
      tr: 'HEMEN ŞİMDİ!',
    },
  },
  {
    key: 'popup_check_1',
    label: 'Liste 1. madde',
    placeholderByLocale: {
      en: 'Before summer begins',
      nl: 'Voordat de zomer begint',
      tr: 'Yaz başlamadan önce',
    },
  },
  {
    key: 'popup_check_2',
    label: 'Liste 2. madde',
    placeholderByLocale: {
      en: 'Before consultation slots fill up',
      nl: 'Voordat de consultplekken vol zitten',
      tr: 'Konsültasyon kontenjanı dolmadan',
    },
  },
  {
    key: 'popup_cta',
    label: 'Buton metni',
    placeholderByLocale: {
      en: 'Book My Free Consultation',
      nl: 'Boek mijn gratis consult',
      tr: 'Hemen Ücretsiz Konsültasyon Al',
    },
  },
  {
    key: 'popup_disclaimer',
    label: 'Yasal uyarı (en altta)',
    multiline: true,
    placeholderByLocale: {
      en: '*Offer valid for bookings and procedures until the end of June 2026.',
      nl: '*Aanbod geldig tot eind juni 2026.',
      tr: '*Kampanya Haziran 2026 sonuna kadar yapılan rezervasyonlar için geçerlidir.',
    },
  },
  {
    key: 'popup_right_title',
    label: 'Sağ panel başlığı',
    placeholderByLocale: {
      en: 'Your exclusive package',
      nl: 'Uw exclusieve pakket',
      tr: 'Size özel paketi alın',
    },
  },
  { key: 'popup_card_1', label: '1. paket kartı (📋 plan)' },
  { key: 'popup_card_2', label: '2. paket kartı (🏥 klinik)' },
  { key: 'popup_card_3', label: '3. paket kartı (💬 konsültasyon)' },
  { key: 'popup_card_4', label: '4. paket kartı (🛡 garanti)' },
  {
    key: 'popup_whatsapp_message',
    label: 'WhatsApp ön-mesaj',
    hint: 'Kullanıcı butona tıklayınca WhatsApp\'a otomatik yazılır.',
    multiline: true,
  },
];

export default async function PopupAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .eq('category', 'popup');
  const rows = (data ?? []) as SiteSetting[];
  const get = (key: string, locale: string = 'all'): string =>
    rows.find((r) => r.key === key && r.locale === locale)?.value ?? '';

  const enabled = (() => {
    const v = get('popup_enabled', 'all').toLowerCase().trim();
    return v === '' ? true : !(v === 'false' || v === '0' || v === 'no' || v === 'off');
  })();
  const delay = get('popup_delay_seconds', 'all') || '6';
  const dismiss = get('popup_dismiss_hours', 'all') || '24';

  return (
    <>
      <AdminTopbar crumb="Kampanya Pop-up" hideLocale />
      <div className="px-8 py-8">
        <PageHeader
          title="Kampanya Pop-up"
          description="Siteye ilk girişte (6 sn sonra) çıkan tanıtım penceresini açıp kapatın ve içeriğini her dilde düzenleyin. Boş bıraktığınız alanlar otomatik olarak çeviri dosyasındaki varsayılan metni kullanır."
        />

        <form action={savePopup} className="mt-8 space-y-6">
          {/* MASTER */}
          <section className="admin-card overflow-hidden">
            <header className="border-b border-slate-800 bg-slate-900/40 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">⚙️ Pop-up Genel Ayarlar</h2>
            </header>
            <div className="space-y-5 p-6">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="popup_enabled__all"
                  defaultChecked={enabled}
                  value="true"
                  className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 accent-[var(--color-primary)]"
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-200">
                    Pop-up aktif
                  </span>
                  <span className="block text-xs text-slate-500">
                    Kapatırsanız hiçbir ziyaretçiye gösterilmez.
                  </span>
                </span>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Gecikme (saniye)
                  </span>
                  <input
                    type="number"
                    name="popup_delay_seconds__all"
                    defaultValue={delay}
                    min={0}
                    max={60}
                    className="admin-input mt-1.5 w-full"
                  />
                  <span className="mt-1 block text-xs text-slate-500">
                    Sayfa açıldıktan kaç saniye sonra çıksın? (örn. 6)
                  </span>
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Tekrar gösterme süresi (saat)
                  </span>
                  <input
                    type="number"
                    name="popup_dismiss_hours__all"
                    defaultValue={dismiss}
                    min={1}
                    max={720}
                    className="admin-input mt-1.5 w-full"
                  />
                  <span className="mt-1 block text-xs text-slate-500">
                    Ziyaretçi kapattıktan kaç saat boyunca tekrar göstermeyim? (örn. 24)
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* PER-LOCALE TEXTS */}
          {TEXT_FIELDS.map((f) => (
            <section key={f.key} className="admin-card overflow-hidden">
              <header className="border-b border-slate-800 bg-slate-900/40 px-6 py-3">
                <h3 className="text-sm font-semibold text-slate-200">{f.label}</h3>
                {f.hint && <p className="mt-0.5 text-xs text-slate-500">{f.hint}</p>}
              </header>
              <div className="grid gap-3 p-4 sm:grid-cols-3">
                {LOCALES.map((l) => (
                  <label key={l} className="block">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      {l.toUpperCase()}
                    </span>
                    {f.multiline ? (
                      <textarea
                        name={`${f.key}__${l}`}
                        defaultValue={get(f.key, l)}
                        rows={2}
                        placeholder={f.placeholderByLocale?.[l] ?? '(çeviri dosyasından)'}
                        className="admin-input mt-1 w-full"
                      />
                    ) : (
                      <input
                        type="text"
                        name={`${f.key}__${l}`}
                        defaultValue={get(f.key, l)}
                        placeholder={f.placeholderByLocale?.[l] ?? '(çeviri dosyasından)'}
                        className="admin-input mt-1 w-full"
                      />
                    )}
                  </label>
                ))}
              </div>
            </section>
          ))}

          <div className="sticky bottom-4 z-10 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/95 px-5 py-3 shadow-lg backdrop-blur">
            <p className="text-xs text-slate-400">
              Boş bırakılan alanlar çeviri dosyasındaki varsayılana düşer.
            </p>
            <button type="submit" className="admin-btn admin-btn-primary">
              Pop-up Ayarlarını Kaydet
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
