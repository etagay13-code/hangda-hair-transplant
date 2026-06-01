import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSetting, getSiteSettings } from '@/lib/settings';

const SOCIALS: Array<{ key: string; label: string }> = [
  { key: 'social_instagram', label: 'Instagram' },
  { key: 'social_facebook', label: 'Facebook' },
  { key: 'social_youtube', label: 'YouTube' },
  { key: 'social_tiktok', label: 'TikTok' },
  { key: 'social_x', label: 'X' },
];

export async function Footer({ locale }: { locale: string }) {
  const [settings, t, tNav] = await Promise.all([
    getSiteSettings(locale),
    getTranslations('Footer'),
    getTranslations('Navigation'),
  ]);

  const brand = getSetting(settings, 'site_name', 'Hang Da Hair Transplant');
  const phone = getSetting(settings, 'contact_phone');
  const whatsapp = getSetting(settings, 'contact_whatsapp');
  const email = getSetting(settings, 'contact_email');
  const address = getSetting(settings, 'contact_address');
  const hours = getSetting(settings, 'contact_hours');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-primary-darker)] text-slate-200">
      <div className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-primary)] text-white font-bold">
                H
              </span>
              <span className="text-lg font-semibold text-white">{brand}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {t('tagline')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              {t('quickLinks')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {(['services', 'gallery', 'testimonials', 'faq', 'contact'] as const).map((k) => (
                <li key={k}>
                  <a
                    href={`/#${k}`}
                    className="text-slate-300 transition hover:text-white"
                  >
                    {tNav(k)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              {t('contactInfo')}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {address && <li>{address}</li>}
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white">
                    {phone}
                  </a>
                </li>
              )}
              {whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    WhatsApp: {whatsapp}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="hover:text-white">
                    {email}
                  </a>
                </li>
              )}
              {hours && <li className="text-slate-400">{hours}</li>}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              {t('followUs')}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm">
              {SOCIALS.map((s) => {
                const url = getSetting(settings, s.key);
                if (!url) return null;
                return (
                  <li key={s.key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 transition hover:border-[var(--color-primary)] hover:text-white"
                    >
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-700 pt-6 text-xs text-slate-400 md:flex-row">
          <p>© {year} {brand}. {t('copyright')}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">{t('privacy')}</Link>
            <Link href="/terms" className="hover:text-white">{t('terms')}</Link>
            <Link href="/cookies" className="hover:text-white">{t('cookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
