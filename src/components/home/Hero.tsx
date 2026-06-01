import { getTranslations } from 'next-intl/server';

export async function Hero() {
  const t = await getTranslations('Hero');

  const stats = [
    { value: '15K+', label: t('stats.patients') },
    { value: '20+', label: t('stats.experience') },
    { value: '98%', label: t('stats.success') },
    { value: '60+', label: t('stats.countries') },
  ];

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-gradient-to-br from-white via-[var(--color-primary)]/10 to-[var(--color-primary)]/25"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_top_right,rgba(120,159,125,0.35),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(26,46,28,0.18),transparent_55%)]"
      />
      <div className="container-page flex min-h-[88vh] flex-col justify-center pt-16 pb-24 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-white/70 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--color-primary-darker)] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
              {t('badge')}
            </span>
            <h1 className="heading-display mt-6 text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-700">
              {t('subtitle')}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="/#contact" className="btn-primary">
                {t('ctaPrimary')}
              </a>
              <a href="/#gallery" className="btn-outline">
                {t('ctaSecondary')}
              </a>
            </div>
            <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-[var(--color-primary)]/20 pt-10 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wider text-slate-500">
                    {s.label}
                  </dt>
                  <dd className="mt-1 text-2xl font-bold text-[var(--color-primary-darker)] sm:text-3xl">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative ml-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-[var(--color-primary)]/15">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-primary)_0%,var(--color-primary-darker)_100%)] opacity-90" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-wider text-white/80">
                    {t('stats.success')}
                  </p>
                  <p className="mt-1 text-3xl font-bold">98%</p>
                </div>
                <p className="mt-6 text-sm text-white/85">
                  Board-certified surgeons · Sapphire FUE · DHI · Lifetime aftercare
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
