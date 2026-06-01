import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

export async function Process() {
  const t = await getTranslations('Process');
  const steps = [1, 2, 3, 4].map((i) => ({
    title: t(`step${i}Title`),
    desc: t(`step${i}Desc`),
    n: i,
  }));

  return (
    <section className="relative overflow-hidden bg-[var(--color-primary-darker)] py-24 text-white sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/4 -z-0 h-96 w-96 rounded-full bg-[var(--color-primary)]/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 -z-0 h-96 w-96 rounded-full bg-[var(--color-primary)]/20 blur-3xl"
      />
      <div className="container-page relative">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
            {t('title')}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base text-white/70">{t('subtitle')}</p>
        </RevealOnScroll>

        <ol className="relative mx-auto mt-20 max-w-4xl">
          <span
            aria-hidden="true"
            className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)]/40 to-transparent sm:left-1/2"
          />
          {steps.map((s, i) => {
            const right = i % 2 === 1;
            return (
              <li key={s.n} className="relative mb-12 last:mb-0 sm:mb-16">
                <RevealOnScroll
                  className={`flex items-start gap-6 sm:items-center sm:gap-0 ${
                    right ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  <span
                    className="absolute left-0 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-base font-bold text-[var(--color-primary-darker)] shadow-lg ring-4 ring-[var(--color-primary-darker)] sm:left-1/2 sm:-translate-x-1/2"
                  >
                    {s.n}
                  </span>
                  <div
                    className={`ml-16 max-w-md sm:ml-0 ${
                      right ? 'sm:mr-[calc(50%+3rem)]' : 'sm:ml-[calc(50%+3rem)]'
                    }`}
                  >
                    <div
                      className={`rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/8 ${
                        right ? 'sm:text-right' : ''
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                        Step {s.n}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">{s.desc}</p>
                    </div>
                  </div>
                </RevealOnScroll>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
