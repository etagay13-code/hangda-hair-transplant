import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getSetting, getSiteSettings } from '@/lib/settings';

export async function Footer({ locale }: { locale: string }) {
  const [settings, t, tNav] = await Promise.all([
    getSiteSettings(locale),
    getTranslations('Footer'),
    getTranslations('Navigation'),
  ]);

  const brand = getSetting(settings, 'site_name', 'MyHaar Hair Transplant');
  // Admin can upload a footer-specific (white) logo via /admin/settings —
  // key: footer_logo_url. If missing, fall back to the regular logo and
  // invert it to white via a CSS filter so it stays legible on dark green.
  const footerLogo = getSetting(settings, 'footer_logo_url');
  const logoUrl = getSetting(settings, 'logo_url');
  const phone = getSetting(settings, 'contact_phone');
  const whatsapp = getSetting(settings, 'contact_whatsapp');
  const email = getSetting(settings, 'contact_email');
  const address = getSetting(settings, 'contact_address');
  const hours = getSetting(settings, 'contact_hours');
  const year = new Date().getFullYear();

  const logo = footerLogo || logoUrl;

  return (
    <footer className="bg-[var(--color-primary-darker)] text-slate-200">
      <div className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" aria-label={brand} className="inline-flex items-center">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={brand}
                  className="h-14 w-auto"
                  style={footerLogo ? undefined : { filter: 'brightness(0) invert(1)' }}
                />
              ) : (
                <span className="text-xl font-semibold text-white">{brand}</span>
              )}
            </Link>
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
