import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { getPageSeo } from '@/lib/settings';
import { PageHero } from '@/components/layout/PageHero';
import type { Service } from '@/types';

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

export default async function ServicesIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Services');
  const tNav = await getTranslations('Navigation');

  const supabase = await createClient();
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('locale', locale)
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  const services = (data ?? []) as Service[];

  return (
    <main>
      <PageHero
        eyebrow={t('title')}
        title={t('title')}
        subtitle={t('subtitle')}
        crumbs={[{ label: tNav('home'), href: '/' }, { label: tNav('services') }]}
      />

      <section className="section">
        <div className="container-page">
          {services.length === 0 ? (
            <p className="text-center text-slate-500">No services available.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <article
                  key={s.id}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-lg"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/12 text-xl font-bold text-[var(--color-primary-darker)]">
                    {s.title.charAt(0)}
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--color-primary-darker)]">
                    {s.title}
                  </h2>
                  {s.short_description && (
                    <p className="mt-2 flex-1 text-sm text-slate-600">{s.short_description}</p>
                  )}
                  <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-xs">
                    {s.price_from != null && (
                      <div>
                        <dt className="text-slate-500">{t('priceFrom')}</dt>
                        <dd className="mt-1 text-base font-semibold text-[var(--color-primary-darker)]">
                          €{s.price_from.toLocaleString()}
                        </dd>
                      </div>
                    )}
                    {s.duration && (
                      <div>
                        <dt className="text-slate-500">{t('duration')}</dt>
                        <dd className="mt-1 text-base font-semibold text-[var(--color-primary-darker)]">
                          {s.duration}
                        </dd>
                      </div>
                    )}
                  </dl>
                  <Link
                    href={`/services/${s.slug}`}
                    className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--color-primary-dark)] transition group-hover:text-[var(--color-primary-darker)]"
                  >
                    {t('viewService')} <span aria-hidden="true" className="ml-1">→</span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
