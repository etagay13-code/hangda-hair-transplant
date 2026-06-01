import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import type { Service } from '@/types';

export async function Services({ locale }: { locale: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('locale', locale)
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  const services = (data ?? []) as Service[];
  const t = await getTranslations('Services');

  if (services.length === 0) return null;

  return (
    <section id="services" className="section bg-white">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            {t('title')}
          </p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-base text-slate-600">{t('subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.id}
              className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-lg"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/12 text-[var(--color-primary-darker)]">
                <span className="text-xl font-bold">{s.title.charAt(0)}</span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-primary-darker)]">
                {s.title}
              </h3>
              {s.short_description && (
                <p className="mt-2 text-sm text-slate-600">{s.short_description}</p>
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
              <a
                href="/#contact"
                className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--color-primary-dark)] transition group-hover:text-[var(--color-primary-darker)]"
              >
                {t('viewService')}
                <span aria-hidden="true" className="ml-1">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
