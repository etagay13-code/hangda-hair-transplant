import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { blockField, getPageBlock } from '@/lib/page-blocks';

export async function Process({ locale }: { locale: string }) {
  const [t, block] = await Promise.all([
    getTranslations('Process'),
    getPageBlock('home', 'process', locale),
  ]);
  const eyebrow = blockField(block?.eyebrow, t('title'));
  const title = blockField(block?.title, t('title'));
  const subtitle = blockField(block?.subtitle, t('subtitle'));
  const sideImage = blockField(block?.image_url, '/gallery/clinic-mirror.jpg');
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
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-20">
          <RevealOnScroll className="lg:col-span-5 lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mt-4 text-base text-white/70">{subtitle}</p>

            <div className="relative mt-10">
              <div
                aria-hidden="true"
                className="pulse-glow absolute -inset-4 -z-10 rounded-[2.5rem] bg-[var(--color-primary)]/40 blur-2xl"
              />
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/15">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={sideImage}
                    alt="Patient consultation at MyHaar"
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-darker)] via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 px-5 py-4 backdrop-blur">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                    A clear path
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-primary-darker)]">
                    Four steps from consultation to confidence
                  </p>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <ol className="relative space-y-5 lg:col-span-7">
            <span
              aria-hidden="true"
              className="absolute left-6 top-2 bottom-2 hidden w-px bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-primary)]/40 to-transparent sm:block"
            />
            {steps.map((s, i) => (
              <RevealOnScroll
                key={s.n}
                delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
                as="li"
              >
                <div className="relative flex items-start gap-6 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/8 sm:p-7">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-base font-bold text-[var(--color-primary-darker)] shadow-lg ring-4 ring-[var(--color-primary-darker)]">
                    {s.n}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                      Step {s.n}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{s.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
