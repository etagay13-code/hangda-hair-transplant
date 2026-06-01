import { getTranslations } from 'next-intl/server';

export async function Process() {
  const t = await getTranslations('Process');
  const steps = [1, 2, 3, 4].map((i) => ({
    title: t(`step${i}Title`),
    desc: t(`step${i}Desc`),
    n: i,
  }));

  return (
    <section className="section bg-slate-50">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            {t('title')}
          </p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-base text-slate-600">{t('subtitle')}</p>
        </div>
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="absolute -top-4 left-6 grid h-9 w-9 place-items-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white shadow">
                {s.n}
              </span>
              <h3 className="mt-3 text-base font-semibold text-[var(--color-primary-darker)]">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
