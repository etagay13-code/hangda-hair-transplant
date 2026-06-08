import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { blockField, getPageBlock } from '@/lib/page-blocks';

interface Stage {
  when: string;
  title: string;
  desc: string;
}

export async function RecoveryTimeline({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Recovery' });
  const block = await getPageBlock('home', 'recovery', locale);
  const eyebrow = blockField(block?.eyebrow, t('eyebrow'));
  const title = blockField(block?.title, t('title'));
  const subtitle = blockField(block?.subtitle, t('subtitle'));
  const stages = t.raw('stages') as Stage[];
  const image = blockField(
    block?.image_url,
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80'
  );
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-20">
          <RevealOnScroll className="lg:col-span-5 lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
              {eyebrow}
            </p>
            <h2 className="heading-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              {subtitle}
            </p>

            <div className="relative mt-10">
              <div
                aria-hidden="true"
                className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-[var(--color-primary)]/15 blur-2xl"
              />
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-[var(--color-primary)]/15">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={image}
                    alt="MyHaar follow-up care"
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="absolute -bottom-6 -right-4 rotate-[3deg] rounded-2xl bg-[var(--color-primary-darker)] px-5 py-4 text-white shadow-xl">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                  {t('guaranteeLabel')}
                </p>
                <p className="mt-1 text-xl font-bold">{t('guaranteeValue')}</p>
              </div>
            </div>
          </RevealOnScroll>

          <ol className="space-y-5 lg:col-span-7">
            {stages.map((stage, i) => (
              <RevealOnScroll
                key={stage.when}
                delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}
                as="li"
              >
                <div className="group relative flex items-start gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-md">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[var(--color-primary)]/12 text-xs font-bold uppercase tracking-wider text-[var(--color-primary-darker)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
                      {stage.when}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-[var(--color-primary-darker)]">
                      {stage.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {stage.desc}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="hidden self-center text-[var(--color-primary)] opacity-0 transition group-hover:opacity-100 sm:inline"
                  >
                    →
                  </span>
                </div>
              </RevealOnScroll>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
