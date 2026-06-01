import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageHero } from '@/components/layout/PageHero';
import type { Service, Faq } from '@/types';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('services')
    .select('title,meta_title,meta_description,short_description')
    .eq('locale', locale)
    .eq('slug', slug)
    .maybeSingle();
  if (!data) return {};
  return {
    title: data.meta_title || data.title,
    description: data.meta_description || data.short_description || undefined,
  };
}

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

  const [{ data: relatedData }, { data: faqData }] = await Promise.all([
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
      .limit(6),
  ]);
  const related = (relatedData ?? []) as Service[];
  const faqs = (faqData ?? []) as Faq[];

  return (
    <main>
      <PageHero
        eyebrow={t('title')}
        title={service.title}
        subtitle={service.short_description ?? undefined}
        crumbs={[
          { label: tNav('home'), href: '/' },
          { label: tNav('services'), href: '/services' },
          { label: service.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-5 text-sm">
          {service.price_from != null && (
            <div className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
              <span className="text-xs uppercase tracking-wider text-slate-500">
                {t('priceFrom')}
              </span>
              <span className="ml-2 text-base font-semibold text-[var(--color-primary-darker)]">
                €{service.price_from.toLocaleString()}
              </span>
            </div>
          )}
          {service.duration && (
            <div className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
              <span className="text-xs uppercase tracking-wider text-slate-500">
                {t('duration')}
              </span>
              <span className="ml-2 text-base font-semibold text-[var(--color-primary-darker)]">
                {service.duration}
              </span>
            </div>
          )}
          <a href={`/${locale}/#contact`} className="btn-primary !py-2 text-sm">
            {tCommon('freeConsultation')}
          </a>
        </div>
      </PageHero>

      <section className="section bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <article className="lg:col-span-2">
            {service.content ? (
              <div
                className="prose-content"
                dangerouslySetInnerHTML={{ __html: service.content }}
              />
            ) : (
              <p className="text-slate-600">{service.description}</p>
            )}
          </article>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-[var(--color-primary-darker)]">
                {tCTA('title')}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{tCTA('subtitle')}</p>
              <a href={`/${locale}/#contact`} className="btn-primary mt-5 w-full">
                {tCTA('button')}
              </a>
            </div>

            {faqs.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-[var(--color-primary-darker)]">
                  FAQ
                </h3>
                <div className="mt-4 space-y-2">
                  {faqs.map((q) => (
                    <details key={q.id} className="group rounded-md border border-slate-100 p-3">
                      <summary className="cursor-pointer list-none text-sm font-medium text-[var(--color-primary-darker)]">
                        {q.question}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{q.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

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
                  <p className="text-base font-semibold text-[var(--color-primary-darker)]">
                    {r.title}
                  </p>
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
    </main>
  );
}
