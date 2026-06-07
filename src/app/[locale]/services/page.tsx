import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { getPageSeo } from '@/lib/settings';
import { PageHero } from '@/components/layout/PageHero';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { TechniqueComparison } from '@/components/home/TechniqueComparison';
import { Process } from '@/components/home/Process';
import { Included } from '@/components/home/Included';
import { TrustBadges } from '@/components/home/TrustBadges';
import type { Service, Faq } from '@/types';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getPageSeo('services', locale);
  return {
    title: seo?.title || 'Services',
    description: seo?.description ?? undefined,
    keywords: seo?.keywords ?? undefined,
  };
}

const HIGHLIGHTS = [
  { kpi: '6', label: 'Treatments under one roof' },
  { kpi: '€1,750', label: 'Surgeon-led pricing from' },
  { kpi: 'Local', label: 'Anaesthesia for every procedure' },
  { kpi: '18 mo.', label: 'Written growth guarantee' },
];

export default async function ServicesIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Services');
  const tNav = await getTranslations('Navigation');
  const tCommon = await getTranslations('Common');
  const tCTA = await getTranslations('CTA');

  const supabase = await createClient();
  const [{ data: serviceData }, { data: faqData }] = await Promise.all([
    supabase
      .from('services')
      .select('*')
      .eq('locale', locale)
      .eq('is_active', true)
      .order('order_index', { ascending: true }),
    supabase
      .from('faq')
      .select('*')
      .eq('locale', locale)
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(6),
  ]);

  const services = (serviceData ?? []) as Service[];
  const faqs = (faqData ?? []) as Faq[];

  return (
    <main>
      <PageHero
        eyebrow={t('title')}
        title={t('title')}
        subtitle={t('subtitle')}
        crumbs={[{ label: tNav('home'), href: '/' }, { label: tNav('services') }]}
      >
        <dl className="mt-2 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-5 border-t border-[var(--color-primary)]/20 pt-8 sm:grid-cols-4">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label}>
              <dt className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{h.label}</dt>
              <dd className="mt-1 text-2xl font-bold text-[var(--color-primary-darker)]">{h.kpi}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="section bg-white">
        <div className="container-page">
          <RevealOnScroll className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
              The MyHaar treatment menu
            </p>
            <h2 className="heading-display mt-3 text-3xl sm:text-4xl">
              Six surgeon-led procedures, one transparent standard of care
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Every treatment below is performed personally by our lead surgical team in Den Haag.
              From full hairline reconstruction to a delicate eyebrow restoration, the same
              philosophy applies: design first, density without compromise, and follow-up that
              lasts well beyond the day of surgery.
            </p>
          </RevealOnScroll>

          {services.length === 0 ? (
            <p className="mt-16 text-center text-slate-500">No services available.</p>
          ) : (
            <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <RevealOnScroll key={s.id} delay={((i % 3) + 1) as 1 | 2 | 3} as="article">
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      {s.image_url ? (
                        <Image
                          src={s.image_url}
                          alt={s.title}
                          fill
                          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full place-items-center bg-gradient-to-br from-[var(--color-primary)]/15 to-[var(--color-primary)]/30">
                          <span className="text-5xl font-bold text-[var(--color-primary-darker)]/40">
                            {s.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      {s.duration && (
                        <span className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary-darker)] shadow ring-1 ring-[var(--color-primary)]/15">
                          {s.duration}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-7">
                      <h3 className="text-xl font-semibold text-[var(--color-primary-darker)]">
                        {s.title}
                      </h3>
                      {s.short_description && (
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                          {s.short_description}
                        </p>
                      )}
                      <div className="mt-7 flex items-end justify-between border-t border-slate-100 pt-5">
                        {s.price_from != null ? (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                              {t('priceFrom')}
                            </p>
                            <p className="mt-0.5 text-xl font-bold text-[var(--color-primary-darker)]">
                              €{s.price_from.toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <div className="text-xs uppercase tracking-widest text-slate-400">
                            Quote on request
                          </div>
                        )}
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary-dark)] transition group-hover:translate-x-1">
                          {t('viewService')} →
                        </span>
                      </div>
                    </div>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      <TechniqueComparison locale={locale} />

      <Process />

      <Included />

      {faqs.length > 0 && (
        <section className="section bg-white">
          <div className="container-page mx-auto max-w-3xl">
            <RevealOnScroll className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                FAQ
              </p>
              <h2 className="heading-display mt-3 text-3xl sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-base text-slate-600">
                A quick browse of the questions our coordinators answer most often. Anything missing? Reach us via WhatsApp or the contact form.
              </p>
            </RevealOnScroll>
            <div className="mt-12 space-y-3">
              {faqs.map((q) => (
                <details
                  key={q.id}
                  className="group rounded-xl border border-slate-200 bg-white p-5 open:border-[var(--color-primary)] open:shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[var(--color-primary-darker)]">
                    <span>{q.question}</span>
                    <span
                      aria-hidden="true"
                      className="ml-4 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-primary)]/12 text-[var(--color-primary-darker)] transition group-open:rotate-45"
                    >
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

      <TrustBadges locale={locale} />

      <section className="bg-[var(--color-primary-darker)] text-white">
        <div className="container-page py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Ready to begin?
          </p>
          <h2 className="heading-display mt-3 text-3xl text-white sm:text-4xl lg:text-5xl">
            {tCTA('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/75">{tCTA('subtitle')}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="btn-primary !bg-white !text-[var(--color-primary-darker)] hover:!bg-slate-100"
            >
              {tCommon('freeConsultation')}
            </Link>
            <Link
              href="/gallery"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {tNav('gallery')} →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
