import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
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

  const featured = services.slice(0, 3);
  const more = services.slice(3);

  return (
    <section id="services" className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 -z-0 h-96 w-96 rounded-full bg-[var(--color-primary)]/15 blur-3xl"
      />
      <div className="container-page relative">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
            {t('title')}
          </p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base text-slate-600">{t('subtitle')}</p>
        </RevealOnScroll>

        <div className="mt-20 space-y-24">
          {featured.map((s, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={s.id}
                className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16"
              >
                <RevealOnScroll
                  className={`lg:col-span-6 ${reverse ? 'lg:order-2' : ''}`}
                >
                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className={`absolute -inset-6 -z-10 rounded-[3rem] ${
                        reverse
                          ? 'bg-[var(--color-primary-darker)]/12'
                          : 'bg-[var(--color-primary)]/20'
                      } blur-2xl`}
                    />
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-2xl ring-1 ring-[var(--color-primary)]/15">
                      <div className="relative aspect-[4/3]">
                        {s.image_url ? (
                          <Image
                            src={s.image_url}
                            alt={s.title}
                            fill
                            sizes="(min-width: 1024px) 560px, 100vw"
                            className="object-cover transition duration-700 hover:scale-105"
                          />
                        ) : (
                          <div className="grid h-full place-items-center text-7xl text-slate-300">
                            {s.title.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                    {s.price_from != null && (
                      <div className="absolute -bottom-6 left-6 rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ring-slate-200">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                          {t('priceFrom')}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-[var(--color-primary-darker)]">
                          €{s.price_from.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </RevealOnScroll>

                <RevealOnScroll
                  delay={1}
                  className={`lg:col-span-6 ${reverse ? 'lg:order-1 lg:pr-8' : 'lg:pl-8'}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">
                    Service · 0{i + 1}
                  </p>
                  <h3 className="heading-display mt-4 text-3xl sm:text-4xl">{s.title}</h3>
                  {s.short_description && (
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700">
                      {s.short_description}
                    </p>
                  )}
                  <ul className="mt-7 space-y-2 text-sm text-slate-600">
                    {s.duration && (
                      <li className="flex items-center gap-2">
                        <Dot /> Duration: <strong className="text-[var(--color-primary-darker)]">{s.duration}</strong>
                      </li>
                    )}
                    <li className="flex items-center gap-2">
                      <Dot /> Anesthesia: <strong className="text-[var(--color-primary-darker)]">Local</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <Dot /> All-inclusive package with hotel, transfers, and lifetime follow-up
                    </li>
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link href={`/services/${s.slug}`} className="btn-primary">
                      {t('viewService')} →
                    </Link>
                    <a href="#contact" className="link-grow text-sm font-semibold text-[var(--color-primary-darker)]">
                      Get a quote
                    </a>
                  </div>
                </RevealOnScroll>
              </article>
            );
          })}
        </div>

        {more.length > 0 && (
          <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((s, i) => (
              <RevealOnScroll key={s.id} delay={(i % 3 + 1) as 1 | 2 | 3} className="h-full">
                <Link
                  href={`/services/${s.slug}`}
                  className="group relative block h-full overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-slate-200 transition hover:-translate-y-1 hover:ring-[var(--color-primary)] hover:shadow-xl"
                >
                  {s.image_url && (
                    <div className="absolute inset-x-0 top-0 h-28 overflow-hidden opacity-30 transition group-hover:opacity-60">
                      <Image
                        src={s.image_url}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 320px, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
                    </div>
                  )}
                  <div className="relative">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)]/12 text-lg font-bold text-[var(--color-primary-darker)]">
                      {s.title.charAt(0)}
                    </span>
                    <h3 className="mt-12 text-lg font-semibold text-[var(--color-primary-darker)]">
                      {s.title}
                    </h3>
                    {s.short_description && (
                      <p className="mt-2 text-sm text-slate-600">{s.short_description}</p>
                    )}
                    <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                      {s.price_from != null ? (
                        <span>
                          {t('priceFrom')}{' '}
                          <strong className="text-[var(--color-primary-darker)]">
                            €{s.price_from.toLocaleString()}
                          </strong>
                        </span>
                      ) : <span />}
                      <span className="font-semibold text-[var(--color-primary-dark)] transition group-hover:translate-x-1">
                        →
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
  );
}

function Dot() {
  return <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />;
}
