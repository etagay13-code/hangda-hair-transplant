import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageHero } from '@/components/layout/PageHero';
import type { Service, Faq, GalleryItem, Testimonial } from '@/types';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('services')
    .select('title,meta_title,meta_description,short_description,image_url')
    .eq('locale', locale)
    .eq('slug', slug)
    .maybeSingle();
  if (!data) return {};
  return {
    title: data.meta_title || data.title,
    description: data.meta_description || data.short_description || undefined,
    openGraph: data.image_url ? { images: [data.image_url] } : undefined,
  };
}

const CANDIDATE_CRITERIA = {
  yes: [
    'Stable hair-loss pattern (Norwood 2–6 or female-pattern)',
    'Sufficient donor density at the back and sides',
    'Realistic expectations about coverage and timeline',
    'Good general health (medical clearance during pre-op blood tests)',
  ],
  no: [
    'Active autoimmune hair-loss (untreated alopecia areata)',
    'Uncontrolled diabetes or bleeding disorder',
    'Severe donor depletion from previous strip surgery',
    'Body dysmorphia or unrealistic expectations',
  ],
};

const INCLUDED = [
  'Free surgeon consultation and hairline design',
  'Pre-operative blood tests',
  'The full procedure with sapphire / Choi instruments',
  'PRP support session same day',
  'All post-op medications and kit',
  'First clinical wash + written recovery briefing',
  'Multilingual care: Nederlands · English · Türkçe · Deutsch',
  'Follow-ups at 3, 6, 12, and 18 months',
  '18-month written growth guarantee',
];

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const [{ data: serviceData }, t, tNav, tCommon, tCTA] = await Promise.all([
    supabase
      .from('services')
      .select('*')
      .eq('locale', locale)
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle(),
    getTranslations('Services'),
    getTranslations('Navigation'),
    getTranslations('Common'),
    getTranslations('CTA'),
  ]);
  if (!serviceData) notFound();
  const service = serviceData as Service;

  const [
    { data: relatedData },
    { data: faqData },
    { data: galleryData },
    { data: testimonialData },
  ] = await Promise.all([
    supabase
      .from('services')
      .select('*')
      .eq('locale', locale)
      .eq('is_active', true)
      .neq('slug', slug)
      .order('order_index', { ascending: true })
      .limit(3),
    supabase
      .from('faq')
      .select('*')
      .eq('locale', locale)
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(8),
    supabase
      .from('gallery')
      .select('*')
      .or(`locale.eq.${locale},locale.eq.en`)
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(3),
    supabase
      .from('testimonials')
      .select('*')
      .or(`locale.eq.${locale},locale.eq.en`)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .limit(2),
  ]);

  const related = (relatedData ?? []) as Service[];
  const faqs = (faqData ?? []) as Faq[];
  const gallery = (galleryData ?? []) as GalleryItem[];
  const testimonials = (testimonialData ?? []) as Testimonial[];

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-[var(--color-primary)]/10 to-[var(--color-primary)]/25">
        <div className="container-page grid items-center gap-12 pt-28 pb-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-600">
              <ol className="flex flex-wrap items-center gap-1">
                <li><Link href="/" className="hover:underline">{tNav('home')}</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/services" className="hover:underline">{tNav('services')}</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-[var(--color-primary-darker)]">{service.title}</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              {t('title')}
            </p>
            <h1 className="heading-display mt-3 text-4xl sm:text-5xl">{service.title}</h1>
            {service.short_description && (
              <p className="mt-5 max-w-xl text-lg text-slate-700">{service.short_description}</p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={`/${locale}/#contact`} className="btn-primary">
                {tCommon('freeConsultation')}
              </a>
              <Link href="/gallery" className="btn-outline">
                {tNav('gallery')} →
              </Link>
            </div>
            <dl className="mt-12 grid max-w-xl grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4 border-t border-[var(--color-primary)]/20 pt-8">
              <SpecCell label={t('priceFrom')} value={service.price_from != null ? `€${service.price_from.toLocaleString()}` : '—'} />
              <SpecCell label={t('duration')} value={service.duration ?? '—'} />
              <SpecCell label="Anesthesia" value="Local" />
              <SpecCell label="Stay" value="3 days" />
            </dl>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-slate-100 shadow-xl ring-1 ring-[var(--color-primary)]/20">
              {service.image_url ? (
                <Image
                  src={service.image_url}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="grid h-full place-items-center text-6xl text-slate-300">
                  {service.title.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <article className="lg:col-span-2">
            {service.content ? (
              <div className="prose-content" dangerouslySetInnerHTML={{ __html: service.content }} />
            ) : (
              <p className="text-slate-600">{service.description}</p>
            )}
          </article>

          <aside className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-[var(--color-primary)]/30 bg-gradient-to-br from-[var(--color-primary)]/15 to-white p-6">
                <h3 className="text-base font-semibold text-[var(--color-primary-darker)]">
                  {tCTA('title')}
                </h3>
                <p className="mt-2 text-sm text-slate-700">{tCTA('subtitle')}</p>
                <a href={`/${locale}/#contact`} className="btn-primary mt-5 w-full">
                  {tCTA('button')}
                </a>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                  What is included
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Are you a candidate?
            </p>
            <h2 className="heading-display mt-3 text-3xl sm:text-4xl">
              Who this procedure is for
            </h2>
            <p className="mt-4 text-base text-slate-600">
              We turn down patients when the procedure is not right for them. Honesty over volume is part of our standard of care.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <CriteriaCard
              title="Likely a good fit"
              items={CANDIDATE_CRITERIA.yes}
              variant="yes"
            />
            <CriteriaCard
              title="We may decline or refer"
              items={CANDIDATE_CRITERIA.no}
              variant="no"
            />
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="section bg-white">
          <div className="container-page">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                  Real results
                </p>
                <h2 className="heading-display mt-3 text-3xl sm:text-4xl">
                  Recent outcomes
                </h2>
              </div>
              <Link href="/gallery" className="hidden text-sm font-medium text-[var(--color-primary-dark)] hover:underline sm:inline">
                {tNav('gallery')} →
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {gallery.map((g) => (
                <div key={g.id} className="overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                  <div className="relative aspect-[4/5]">
                    {g.before_image_url && (
                      <Image
                        src={g.before_image_url}
                        alt={g.patient_code || 'Result'}
                        fill
                        sizes="(min-width: 1024px) 400px, 100vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="space-y-1 p-4">
                    <p className="text-sm font-semibold text-[var(--color-primary-darker)]">
                      {g.technique}{g.grafts ? ` · ${g.grafts.toLocaleString()} grafts` : ''}
                    </p>
                    {g.months_after && (
                      <p className="text-xs text-slate-500">{g.months_after} months post-op</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-page">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Patient voices
            </p>
            <h2 className="heading-display mt-3 text-center text-3xl sm:text-4xl">
              What our patients say
            </h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {testimonials.map((tm) => (
                <blockquote
                  key={tm.id}
                  className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
                >
                  <p className="text-base leading-relaxed text-slate-700">“{tm.comment}”</p>
                  <footer className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                    <div>
                      <p className="font-semibold text-[var(--color-primary-darker)]">{tm.name}</p>
                      {tm.country && <p className="text-xs text-slate-500">{tm.country}</p>}
                    </div>
                    {(tm.technique || tm.grafts) && (
                      <p className="text-xs text-slate-500">
                        {[tm.technique, tm.grafts ? `${tm.grafts.toLocaleString()} grafts` : null]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="section bg-white">
          <div className="container-page mx-auto max-w-3xl">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              FAQ
            </p>
            <h2 className="heading-display mt-3 text-center text-3xl sm:text-4xl">
              Common questions
            </h2>
            <div className="mt-10 space-y-3">
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

      {related.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-page">
            <h2 className="heading-display text-2xl sm:text-3xl">{t('title')}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/services/${r.slug}`}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-[var(--color-primary)] hover:shadow-md"
                >
                  <p className="text-base font-semibold text-[var(--color-primary-darker)]">{r.title}</p>
                  {r.short_description && (
                    <p className="mt-2 text-sm text-slate-600">{r.short_description}</p>
                  )}
                  {r.price_from != null && (
                    <p className="mt-3 text-xs text-slate-500">
                      {t('priceFrom')}{' '}
                      <strong className="text-[var(--color-primary-darker)]">
                        €{r.price_from.toLocaleString()}
                      </strong>
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[var(--color-primary-darker)] text-white">
        <div className="container-page py-16 text-center">
          <h2 className="heading-display text-3xl text-white sm:text-4xl">
            {tCTA('title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/80">{tCTA('subtitle')}</p>
          <a href={`/${locale}/#contact`} className="btn-primary mt-8 !bg-white !text-[var(--color-primary-darker)] hover:!bg-slate-100">
            {tCTA('button')}
          </a>
        </div>
      </section>
    </main>
  );
}

function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-slate-500">{label}</dt>
      <dd className="mt-1 text-base font-semibold text-[var(--color-primary-darker)]">{value}</dd>
    </div>
  );
}

function CriteriaCard({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: 'yes' | 'no';
}) {
  const isYes = variant === 'yes';
  return (
    <div className={`rounded-2xl border p-7 shadow-sm ${isYes ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary)]/8' : 'border-slate-200 bg-white'}`}>
      <h3 className="flex items-center gap-2 text-lg font-semibold text-[var(--color-primary-darker)]">
        <span className={`grid h-7 w-7 place-items-center rounded-full text-white ${isYes ? 'bg-[var(--color-primary)]' : 'bg-slate-400'}`}>
          {isYes ? '✓' : '!'}
        </span>
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm text-slate-700">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-3">
            <span className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${isYes ? 'bg-[var(--color-primary)]' : 'bg-slate-400'}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
