import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { getSetting, getSiteSettings } from '@/lib/settings';
import type { Service } from '@/types';
import { ContactForm } from './ContactForm';

export async function ContactSection({ locale }: { locale: string }) {
  const supabase = await createClient();
  const [{ data: servicesData }, settings, t] = await Promise.all([
    supabase
      .from('services')
      .select('slug,title')
      .eq('locale', locale)
      .eq('is_active', true)
      .order('order_index', { ascending: true }),
    getSiteSettings(locale),
    getTranslations('Contact'),
  ]);

  const services = ((servicesData ?? []) as Pick<Service, 'slug' | 'title'>[]).map((s) => ({
    slug: s.slug,
    title: s.title,
  }));

  const phone = getSetting(settings, 'contact_phone');
  const whatsapp = getSetting(settings, 'contact_whatsapp');
  const email = getSetting(settings, 'contact_email');
  const address = getSetting(settings, 'contact_address');
  const hours = getSetting(settings, 'contact_hours');

  return (
    <section id="contact" className="section bg-white">
      <div className="container-page">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              {t('title')}
            </p>
            <h2 className="heading-display mt-3 text-3xl sm:text-4xl">{t('title')}</h2>
            <p className="mt-4 max-w-md text-base text-slate-600">{t('subtitle')}</p>
            <dl className="mt-8 space-y-5 text-sm">
              {address && (
                <Row label={t('addressLabel')} value={address} />
              )}
              {phone && (
                <Row label={t('phoneLabel')} value={phone} href={`tel:${phone.replace(/\s+/g, '')}`} />
              )}
              {whatsapp && (
                <Row
                  label="WhatsApp"
                  value={whatsapp}
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                />
              )}
              {email && (
                <Row label={t('emailLabel')} value={email} href={`mailto:${email}`} />
              )}
              {hours && (
                <Row label={t('hoursLabel')} value={hours} />
              )}
            </dl>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <ContactForm services={services} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-[var(--color-primary)] pl-4">
      <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="text-base text-[var(--color-primary-darker)]">
        {href ? (
          <a href={href} className="hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
