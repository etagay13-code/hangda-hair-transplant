import { BarChart3, Search, Flame, Settings } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { saveIntegrations } from './actions';
import type { SiteSetting } from '@/types';

export const dynamic = 'force-dynamic';

interface Field {
  key: string;
  label: string;
  description: string;
  placeholder: string;
  helpLink?: { href: string; label: string };
  multiline?: boolean;
}

const FIELDS: Field[] = [
  {
    key: 'gtm_id',
    label: 'Google Tag Manager',
    description:
      'GTM container ID — diğer tüm üçüncü-taraf etiketlerini buradan yönetebilirsiniz.',
    placeholder: 'GTM-XXXXXXX',
    helpLink: {
      href: 'https://tagmanager.google.com',
      label: 'tagmanager.google.com',
    },
  },
  {
    key: 'ga_measurement_id',
    label: 'Google Analytics 4',
    description:
      'GA4 Measurement ID — sayfa görüntülemeleri ve form gönderimleri otomatik tetiklenir.',
    placeholder: 'G-XXXXXXXXXX',
    helpLink: {
      href: 'https://analytics.google.com',
      label: 'analytics.google.com',
    },
  },
  {
    key: 'meta_pixel_id',
    label: 'Meta (Facebook) Pixel',
    description:
      'Facebook / Instagram reklamlarının dönüşümlerini takip etmek için Pixel ID.',
    placeholder: '1234567890123456',
    helpLink: {
      href: 'https://business.facebook.com/events_manager',
      label: 'business.facebook.com',
    },
  },
  {
    key: 'search_console_verification',
    label: 'Google Search Console',
    description:
      'Site doğrulama meta tag içeriği. Sadece content="..." kısmındaki kodu yapıştırın.',
    placeholder: 'XXXXXXXXXXXXXXXXX',
    helpLink: {
      href: 'https://search.google.com/search-console',
      label: 'search.google.com/search-console',
    },
  },
  {
    key: 'bing_site_verification',
    label: 'Bing Webmaster Tools',
    description: 'Bing site doğrulama kodu.',
    placeholder: 'XXXXXXXXXX',
    helpLink: {
      href: 'https://www.bing.com/webmasters',
      label: 'bing.com/webmasters',
    },
  },
  {
    key: 'yandex_verification',
    label: 'Yandex Webmaster',
    description: 'Yandex site doğrulama kodu (gerekirse).',
    placeholder: 'XXXXXXXXXX',
  },
  {
    key: 'hotjar_id',
    label: 'Hotjar',
    description: 'Hotjar Site ID — ısı haritaları ve oturum kayıtları için.',
    placeholder: '1234567',
    helpLink: { href: 'https://hotjar.com', label: 'hotjar.com' },
  },
  {
    key: 'clarity_id',
    label: 'Microsoft Clarity',
    description: 'Clarity Project ID — ücretsiz oturum kayıt + ısı haritası.',
    placeholder: 'abcdefghij',
    helpLink: {
      href: 'https://clarity.microsoft.com',
      label: 'clarity.microsoft.com',
    },
  },
];

const HTML_FIELDS: Field[] = [
  {
    key: 'custom_head_html',
    label: 'Özel HTML — <head> içine',
    description:
      'Sayfanın <head> bölümüne her sayfada eklenir. Buraya doğrulama meta tag\'leri, üçüncü-taraf script\'ler veya analytics snippet\'i yapıştırabilirsiniz.',
    placeholder: '<script src="..."></script>\n<meta name="..." content="..." />',
    multiline: true,
  },
  {
    key: 'custom_body_html',
    label: 'Özel HTML — </body> öncesi',
    description:
      'Sayfanın sonuna her sayfada eklenir. Buraya canlı sohbet widget\'ı, retargeting pixel\'leri veya sayfa sonu script\'leri ekleyebilirsiniz.',
    placeholder: '<script src="..."></script>',
    multiline: true,
  },
];

export default async function IntegrationsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .eq('category', 'tracking')
    .eq('locale', 'all');
  const rows = (data ?? []) as SiteSetting[];
  const valueOf = (key: string) =>
    rows.find((r) => r.key === key)?.value ?? '';

  return (
    <>
      <AdminTopbar crumb="Entegrasyonlar" hideLocale />
      <div className="px-8 py-8">
        <PageHeader
          title="Entegrasyonlar"
          description="Google Tag Manager, Analytics, Pixel, arama motoru doğrulamaları ve özel HTML kodları. Buradaki değişiklikler tüm sayfalarda her dil için anında yayınlanır."
        />

        <form action={saveIntegrations} className="mt-8 space-y-6">
          <section className="admin-card overflow-hidden">
            <header className="border-b border-slate-800 bg-slate-900/40 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <BarChart3 size={20} strokeWidth={1.8} className="text-[var(--color-primary)]" />
                <span>Analytics & Pazarlama Tag&apos;leri</span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                ID girip kaydedin — script otomatik enjekte edilir.
              </p>
            </header>
            <div className="grid gap-5 p-6 sm:grid-cols-2">
              {FIELDS.slice(0, 3).map((f) => (
                <IntegrationField key={f.key} field={f} value={valueOf(f.key)} />
              ))}
            </div>
          </section>

          <section className="admin-card overflow-hidden">
            <header className="border-b border-slate-800 bg-slate-900/40 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Search size={20} strokeWidth={1.8} className="text-[var(--color-primary)]" />
                <span>Arama Motoru Doğrulamaları</span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Search Console / Bing / Yandex için meta tag içerikleri.
              </p>
            </header>
            <div className="grid gap-5 p-6 sm:grid-cols-3">
              {FIELDS.slice(3, 6).map((f) => (
                <IntegrationField key={f.key} field={f} value={valueOf(f.key)} />
              ))}
            </div>
          </section>

          <section className="admin-card overflow-hidden">
            <header className="border-b border-slate-800 bg-slate-900/40 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Flame size={20} strokeWidth={1.8} className="text-[var(--color-primary)]" />
                <span>Davranış Analizi</span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Ziyaretçi davranışını izleyen araçlar.
              </p>
            </header>
            <div className="grid gap-5 p-6 sm:grid-cols-2">
              {FIELDS.slice(6).map((f) => (
                <IntegrationField key={f.key} field={f} value={valueOf(f.key)} />
              ))}
            </div>
          </section>

          <section className="admin-card overflow-hidden">
            <header className="border-b border-slate-800 bg-slate-900/40 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Settings size={20} strokeWidth={1.8} className="text-[var(--color-primary)]" />
                <span>Özel HTML / Script Enjeksiyonu</span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Yukarıdaki seçenekler ihtiyacınızı karşılamıyorsa, buraya
                doğrudan HTML/JavaScript yapıştırabilirsiniz. Dikkat:
                eklenen kod tüm sayfalarda çalışır.
              </p>
            </header>
            <div className="space-y-5 p-6">
              {HTML_FIELDS.map((f) => (
                <IntegrationField key={f.key} field={f} value={valueOf(f.key)} />
              ))}
            </div>
          </section>

          <div className="sticky bottom-4 z-10 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/95 px-5 py-3 shadow-lg backdrop-blur">
            <p className="text-xs text-slate-400">
              Değişiklikler tüm sayfalara anında uygulanır.
            </p>
            <button type="submit" className="admin-btn admin-btn-primary">
              Tüm Entegrasyonları Kaydet
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function IntegrationField({ field, value }: { field: Field; value: string }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm font-semibold text-slate-200">
        <span>{field.label}</span>
        {value && (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
            ● aktif
          </span>
        )}
      </span>
      <p className="mt-1 text-xs text-slate-400">{field.description}</p>
      {field.helpLink && (
        <a
          href={field.helpLink.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-[11px] text-[var(--color-primary)] hover:underline"
        >
          ↗ {field.helpLink.label}
        </a>
      )}
      {field.multiline ? (
        <textarea
          name={field.key}
          defaultValue={value}
          rows={6}
          placeholder={field.placeholder}
          className="admin-input mt-2 w-full font-mono text-xs"
          spellCheck={false}
        />
      ) : (
        <input
          name={field.key}
          defaultValue={value}
          placeholder={field.placeholder}
          className="admin-input mt-2 w-full font-mono text-sm"
          spellCheck={false}
        />
      )}
    </label>
  );
}
