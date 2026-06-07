import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { getSetting, getSiteSettings } from '@/lib/settings';
import { blockField, getPageBlock } from '@/lib/page-blocks';
import type { Service } from '@/types';
import { ContactForm } from './ContactForm';

export async function ContactSection({ locale }: { locale: string }) {
  const supabase = await createClient();
  const [{ data: servicesData }, settings, t, block] = await Promise.all([
    supabase
      .from('services')
      .select('slug,title')
      .eq('locale', locale)
      .eq('is_active', true)
      .order('order_index', { ascending: true }),
    getSiteSettings(locale),
    getTranslations('Contact'),
    getPageBlock('home', 'contact', locale),
  ]);

  const eyebrow = blockField(block?.eyebrow, t('title'));
  const title = blockField(block?.title, t('title'));
  const subtitle = blockField(block?.subtitle, t('subtitle'));

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
    <section id="contact" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-0 -z-10 h-80 w-80 rounded-full bg-[var(--color-primary)]/15 blur-3xl"
      />
      <div className="container-page">
        <div className="grid items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
              {eyebrow}
            </p>
            <h2 className="heading-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600">{subtitle}</p>

            <div className="relative mt-8 overflow-hidden rounded-3xl shadow-xl ring-1 ring-[var(--color-primary)]/15">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccc?auto=format&fit=crop&w=1000&q=80"
                  alt="MyHaar Clinic — Den Haag"
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-darker)]/70 via-[var(--color-primary-darker)]/10 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/95 px-5 py-4 backdrop-blur">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                    Visit our clinic
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-primary-darker)]">
                    {address || 'Waldorpstraat 215, 2521 CJ Den Haag, Netherlands'}
                  </p>
                </div>
              </div>
            </div>

            <dl className="mt-8 space-y-4 text-sm">
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

          <div className="lg:col-span-7">
            <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-xl font-semibold text-[var(--color-primary-darker)]">
                Request your free consultation
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Send us a few details and a couple of photos. A medical coordinator will reply within 24 hours with a surgeon-led assessment and a written quote.
              </p>
              <div className="mt-6">
                <ContactForm services={services} />
              </div>
            </div>
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
