import { ShieldCheck, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { saveFooter } from './actions';
import type { SiteSetting } from '@/types';

export const dynamic = 'force-dynamic';

const LOCALES = ['en', 'nl', 'tr'] as const;

export default async function FooterAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .in('category', ['footer', 'general']);
  const rows = (data ?? []) as SiteSetting[];
  const get = (key: string, locale: string = 'all'): string =>
    rows.find((r) => r.key === key && r.locale === locale)?.value ?? '';
  const isOn = (key: string): boolean => {
    const v = get(key, 'all').toLowerCase().trim();
    return v === '' ? true : !(v === 'false' || v === '0' || v === 'no' || v === 'off');
  };

  return (
    <>
      <AdminTopbar crumb="Footer & Trust Badges" hideLocale />
      <div className="px-8 py-8">
        <PageHeader
          title="Footer & Güven Rozetleri"
          description="Tüm sayfaların altındaki güven rozetleri (Accreditation, Guarantee, Patients, Countries) ve Featured In şeritinin görünürlüğünü/içeriğini yönetin. Footer iletişim bilgileri 'Site Settings' altındadır."
        />

        <form action={saveFooter} className="mt-8 space-y-6">
          {/* MASTER SECTION TOGGLE */}
          <section className="admin-card overflow-hidden">
            <header className="border-b border-slate-800 bg-slate-900/40 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <ShieldCheck size={20} strokeWidth={1.8} className="text-[var(--color-primary)]" />
                <span>Güven Rozeti Bölümü</span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Anasayfa ve Hakkımızda sayfasının altındaki koyu yeşil şerit.
              </p>
            </header>
            <div className="space-y-5 p-6">
              <Toggle
                name="trust_section_visible__all"
                checked={isOn('trust_section_visible')}
                label="Tüm güven rozeti bölümü"
                hint="Kapatırsanız 4 rozet + Featured In tamamen gizlenir."
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <Toggle
                    name="trust_certifications_visible__all"
                    checked={isOn('trust_certifications_visible')}
                    label="Accreditation rozeti"
                  />
                  <input
                    type="text"
                    name="trust_certifications__all"
                    defaultValue={get('trust_certifications')}
                    placeholder="IGJ-registered · BIG-registered surgeons · ISO 9001:2015 · ISHRS member"
                    className="admin-input mt-3 w-full"
                  />
                </Card>

                <Card>
                  <Toggle
                    name="trust_guarantee_visible__all"
                    checked={isOn('trust_guarantee_visible')}
                    label="Guarantee rozeti"
                  />
                  <input
                    type="text"
                    name="trust_guarantee_years__all"
                    defaultValue={get('trust_guarantee_years')}
                    placeholder="18-month written growth guarantee"
                    className="admin-input mt-3 w-full"
                  />
                </Card>

                <Card>
                  <Toggle
                    name="trust_patients_visible__all"
                    checked={isOn('trust_patients_visible')}
                    label="Patients rozeti"
                  />
                  <input
                    type="text"
                    name="trust_patients_count__all"
                    defaultValue={get('trust_patients_count')}
                    placeholder="15,000+"
                    className="admin-input mt-3 w-full"
                  />
                </Card>

                <Card>
                  <Toggle
                    name="trust_countries_visible__all"
                    checked={isOn('trust_countries_visible')}
                    label="Countries rozeti"
                  />
                  <input
                    type="text"
                    name="trust_countries_count__all"
                    defaultValue={get('trust_countries_count')}
                    placeholder="60+"
                    className="admin-input mt-3 w-full"
                  />
                </Card>
              </div>

              <Card>
                <Toggle
                  name="trust_press_visible__all"
                  checked={isOn('trust_press_visible')}
                  label="Featured In şeridi"
                  hint="4 rozetin altında çıkan basın grubu satırı."
                />
                <input
                  type="text"
                  name="trust_press__all"
                  defaultValue={get('trust_press')}
                  placeholder="Featured in NRC, AD, Telegraaf, Algemeen Dagblad, NOS"
                  className="admin-input mt-3 w-full"
                />
              </Card>
            </div>
          </section>

          {/* FOOTER TAGLINE (per locale) */}
          <section className="admin-card overflow-hidden">
            <header className="border-b border-slate-800 bg-slate-900/40 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <FileText size={20} strokeWidth={1.8} className="text-[var(--color-primary)]" />
                <span>Footer altyazı (her dilde)</span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Footer'ın sol kolonunda logonun altındaki tek satırlık tanıtım yazısı.
              </p>
            </header>
            <div className="grid gap-4 p-6 sm:grid-cols-3">
              {LOCALES.map((l) => (
                <label key={l} className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    {l.toUpperCase()}
                  </span>
                  <textarea
                    name={`footer_tagline__${l}`}
                    defaultValue={get('footer_tagline', l)}
                    rows={3}
                    placeholder={
                      l === 'tr'
                        ? 'Dünya çapında güvenilen premium saç restorasyonu'
                        : l === 'nl'
                        ? 'Premium haarrestauratie wereldwijd vertrouwd'
                        : 'Premium hair restoration trusted worldwide'
                    }
                    className="admin-input mt-1.5 w-full"
                  />
                </label>
              ))}
            </div>
          </section>

          <div className="sticky bottom-4 z-10 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/95 px-5 py-3 shadow-lg backdrop-blur">
            <p className="text-xs text-slate-400">
              Değişiklikler her dilde anında uygulanır.
            </p>
            <button type="submit" className="admin-btn admin-btn-primary">
              Footer Ayarlarını Kaydet
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function Toggle({
  name,
  checked,
  label,
  hint,
}: {
  name: string;
  checked: boolean;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={checked}
        value="true"
        className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 accent-[var(--color-primary)]"
      />
      <span>
        <span className="block text-sm font-semibold text-slate-200">{label}</span>
        {hint && <span className="block text-xs text-slate-500">{hint}</span>}
      </span>
    </label>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4">
      {children}
    </div>
  );
}
