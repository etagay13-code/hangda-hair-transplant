import { getTranslations } from 'next-intl/server';

const ICONS = ['👨‍⚕️', '🔬', '✨', '🤝'];

export async function WhyUs() {
  const t = await getTranslations('WhyUs');
  const features = [1, 2, 3, 4].map((i) => ({
    title: t(`feature${i}Title`),
    desc: t(`feature${i}Desc`),
    icon: ICONS[i - 1],
  }));

  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            {t('title')}
          </p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-base text-slate-600">{t('subtitle')}</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-md"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--color-primary)]/12 text-3xl">
                {f.icon}
              </div>
              <h3 className="mt-5 text-base font-semibold text-[var(--color-primary-darker)]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
