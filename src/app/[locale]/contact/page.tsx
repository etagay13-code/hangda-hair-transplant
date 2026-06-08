import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getPageSeo, getSetting, getSiteSettings } from '@/lib/settings';
import { PageHero } from '@/components/layout/PageHero';
import { ContactForm } from '@/components/home/ContactForm';
import { GoogleMap } from '@/components/layout/GoogleMap';
import type { Faq } from '@/types';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getPageSeo('contact', locale);
  return {
    title: seo?.title || 'Contact',
    description: seo?.description ?? undefined,
    keywords: seo?.keywords ?? undefined,
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const [{ data: servicesData }, { data: faqData }, settings, t, tNav, tCommon] = await Promise.all([
    supabase
      .from('services')
      .select('slug,title')
      .eq('locale', locale)
      .eq('is_active', true)
      .order('order_index', { ascending: true }),
    supabase
      .from('faq')
      .select('*')
      .eq('locale', locale)
      .eq('is_active', true)
      .eq('category', 'travel')
      .order('order_index', { ascending: true })
      .limit(6),
    getSiteSettings(locale),
    getTranslations('Contact'),
    getTranslations('Navigation'),
    getTranslations('Common'),
  ]);

  const services = (servicesData ?? []).map((s) => ({ slug: s.slug, title: s.title }));
  const faqs = (faqData ?? []) as Faq[];

  const phone = getSetting(settings, 'contact_phone');
  const whatsapp = getSetting(settings, 'contact_whatsapp');
  const email = getSetting(settings, 'contact_email');
  const address = getSetting(settings, 'contact_address');
  const hours = getSetting(settings, 'contact_hours');
  const mapQuery = getSetting(settings, 'contact_map_query') || address;
  const waNumber = whatsapp.replace(/[^0-9]/g, '');

  return (
    <main>
      <PageHero
        eyebrow={t('title')}
        title={t('title')}
        subtitle={t('subtitle')}
        crumbs={[{ label: tNav('home'), href: '/' }, { label: tNav('contact') }]}
      />

      {/* Contact info strip — quick at-a-glance */}
      <section className="bg-white">
        <div className="container-page -mt-8 sm:-mt-12">
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-4">
            {address && (
              <InfoChip
                icon="📍"
                label={t('addressLabel')}
                value={address}
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`}
                external
              />
            )}
            {phone && (
              <InfoChip
                icon="📞"
                label={t('phoneLabel')}
                value={phone}
                href={`tel:${phone.replace(/\s+/g, '')}`}
              />
            )}
            {email && (
              <InfoChip
                icon="✉️"
                label={t('emailLabel')}
                value={email}
                href={`mailto:${email}`}
              />
            )}
            {hours && (
              <InfoChip icon="🕐" label={t('hoursLabel')} value={hours} />
            )}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--color-primary)]/15 text-[var(--color-primary-darker)]">
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path d="M3 8l9 6 9-6" />
                  <rect x={3} y={6} width={18} height={14} rx={2} />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-primary-darker)] sm:text-2xl">
                  Request your free consultation
                </h2>
                <p className="mt-1.5 text-sm text-slate-600">
                  A medical coordinator replies within 24 hours with a surgeon-led
                  assessment, a custom plan, and a written quote.
                </p>
              </div>
            </div>
            <div className="mt-8">
              <ContactForm services={services as { slug: string; title: string }[]} />
            </div>
          </div>

          {/* Map + Talk now */}
          <aside className="lg:col-span-2 space-y-6">
            <GoogleMap query={mapQuery} title={`MyHaar Clinic — ${address}`} />

            <div className="rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/15 to-white p-5 ring-1 ring-[var(--color-primary)]/20 sm:p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                Talk to us right now
              </h3>
              <div className="mt-4 space-y-3 text-sm">
                {waNumber && (
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200 transition hover:ring-[var(--color-primary)]"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366] text-white">💬</span>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">WhatsApp · fastest</p>
                      <p className="truncate font-semibold text-[var(--color-primary-darker)]">{whatsapp}</p>
                    </div>
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200 transition hover:ring-[var(--color-primary)]"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-primary)] text-white">📞</span>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">{t('phoneLabel')}</p>
                      <p className="truncate font-semibold text-[var(--color-primary-darker)]">{phone}</p>
                    </div>
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200 transition hover:ring-[var(--color-primary)]"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-700 text-white">✉</span>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">{t('emailLabel')}</p>
                      <p className="truncate font-semibold text-[var(--color-primary-darker)]">{email}</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-page mx-auto max-w-3xl">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Travel & logistics
            </p>
            <h2 className="heading-display mt-3 text-center text-3xl sm:text-4xl">
              Planning your trip
            </h2>
            <div className="mt-10 space-y-3">
              {faqs.map((q) => (
                <details
                  key={q.id}
                  className="group rounded-xl border border-slate-200 bg-white p-5 open:border-[var(--color-primary)] open:shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[var(--color-primary-darker)]">
                    <span>{q.question}</span>
                    <span aria-hidden="true" className="ml-4 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-primary)]/12 text-[var(--color-primary-darker)] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-slate-700">{q.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[var(--color-primary-darker)] text-white">
        <div className="container-page grid gap-6 py-14 text-center sm:py-16 md:grid-cols-3">
          <Stat label="Reply within" value="24 hours" />
          <Stat label="Languages spoken" value="EN · NL · DE · TR · AR" />
          <Stat label="Free consultation" value={tCommon('freeConsultation')} />
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-[var(--color-primary)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoChip({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)]/12 text-lg">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-sm font-semibold text-[var(--color-primary-darker)]">
          {value}
        </span>
      </span>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition hover:border-[var(--color-primary)] hover:shadow-sm"
      >
        {inner}
      </a>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3">
      {inner}
    </div>
  );
}
