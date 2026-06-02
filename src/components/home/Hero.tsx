import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { CountUp } from '@/components/ui/CountUp';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

export async function Hero() {
  const t = await getTranslations('Hero');

  const stats: Array<{ label: string; value: number; suffix?: string; prefix?: string }> = [
    { label: t('stats.patients'), value: 15, suffix: 'K+' },
    { label: t('stats.experience'), value: 20, suffix: '+' },
    { label: t('stats.success'), value: 98, suffix: '%' },
    { label: t('stats.countries'), value: 60, suffix: '+' },
  ];

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-white"
    >
      {/* Animated blobs */}
      <div
        aria-hidden="true"
        className="blob pointer-events-none absolute -left-32 -top-32 -z-10 h-[480px] w-[480px] rounded-full bg-[var(--color-primary)]/30"
      />
      <div
        aria-hidden="true"
        className="blob pointer-events-none absolute -right-40 top-40 -z-10 h-[520px] w-[520px] rounded-full bg-[var(--color-primary)]/20"
        style={{ animationDelay: '-9s' }}
      />
      <div
        aria-hidden="true"
        className="blob pointer-events-none absolute bottom-0 left-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-[var(--color-primary-darker)]/10"
        style={{ animationDelay: '-4s' }}
      />

      <div className="container-page flex min-h-[92vh] flex-col justify-center pt-20 pb-24 sm:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <RevealOnScroll className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary-darker)] backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-primary)]" />
              {t('badge')}
            </span>
            <h1 className="heading-display mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.75rem]">
              {t('title')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700">
              {t('subtitle')}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#contact" className="btn-primary">
                {t('ctaPrimary')}
              </a>
              <a href="#gallery" className="btn-outline">
                {t('ctaSecondary')}
              </a>
            </div>

            <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[var(--color-primary)]/20 pt-10 sm:grid-cols-4">
              {stats.map((s, i) => (
                <RevealOnScroll key={s.label} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                    {s.label}
                  </dt>
                  <dd className="mt-1 text-3xl font-bold text-[var(--color-primary-darker)] sm:text-4xl">
                    <CountUp value={s.value} suffix={s.suffix ?? ''} prefix={s.prefix ?? ''} />
                  </dd>
                </RevealOnScroll>
              ))}
            </dl>
          </RevealOnScroll>

          <RevealOnScroll delay={2} className="hidden lg:col-span-5 lg:block">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pulse-glow absolute -inset-8 -z-10 rounded-[3rem] bg-[var(--color-primary)]/30 blur-3xl"
              />
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-[var(--color-primary)]/20">
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/gallery/result-3400-sapphire-fue.jpg"
                    alt="Real MyHaar patient result"
                    fill
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/95 px-5 py-4 backdrop-blur shadow-lg">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                    Recent result · MyHaar FUE
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--color-primary-darker)]">
                    3,400 grafts · 12 months
                  </p>
                </div>
              </div>

              {/* floating badge */}
              <div className="absolute -left-6 top-12 rotate-[-6deg] rounded-2xl bg-[var(--color-primary-darker)] px-4 py-3 text-white shadow-xl">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                  Success rate
                </p>
                <p className="mt-0.5 text-2xl font-bold">98%</p>
              </div>
              <div className="absolute -right-4 bottom-32 rotate-[5deg] rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-slate-200">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                  Written guarantee
                </p>
                <p className="mt-0.5 text-2xl font-bold text-[var(--color-primary-darker)]">
                  18 mo.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* scroll indicator */}
        <div className="mt-16 flex justify-center sm:mt-20">
          <a
            href="#services"
            aria-label="Scroll to services"
            className="group flex flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 transition hover:text-[var(--color-primary-darker)]"
          >
            <span>Explore</span>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-slate-300 transition group-hover:border-[var(--color-primary)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
