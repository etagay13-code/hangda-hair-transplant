import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { blockField, getPageBlock } from '@/lib/page-blocks';

const FEATURES = [
  {
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80',
    badge: '01',
    accent: 'Surgeons, not technicians',
  },
  {
    image: '/gallery/clinic-procedure.jpg',
    badge: '02',
    accent: 'IGJ-grade technology',
  },
  {
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80',
    badge: '03',
    accent: 'Undetectably natural design',
  },
  {
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80',
    badge: '04',
    accent: 'Lifetime relationship',
  },
];

export async function WhyUs({ locale }: { locale: string }) {
  const [t, block] = await Promise.all([
    getTranslations('WhyUs'),
    getPageBlock('home', 'why_us', locale),
  ]);
  const eyebrow = blockField(block?.eyebrow, t('title'));
  const title = blockField(block?.title, t('title'));
  const subtitle = blockField(block?.subtitle, t('subtitle'));
  const features = FEATURES.map((f, i) => ({
    ...f,
    title: t(`feature${i + 1}Title`),
    desc: t(`feature${i + 1}Desc`),
  }));

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="container-page">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
            {eyebrow}
          </p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-base text-slate-600">{subtitle}</p>
        </RevealOnScroll>

        <div className="mt-20 space-y-28 sm:space-y-32">
          {features.map((f, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={f.badge}
                className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16"
              >
                <RevealOnScroll
                  className={`lg:col-span-5 ${reverse ? 'lg:order-2' : ''}`}
                >
                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className="absolute -inset-6 -z-10 rounded-[3rem] bg-[var(--color-primary)]/15 blur-2xl"
                    />
                    <div className="relative overflow-hidden rounded-[2rem] bg-slate-100 shadow-xl ring-1 ring-[var(--color-primary)]/15">
                      <div className="relative aspect-[4/5]">
                        <Image
                          src={f.image}
                          alt={f.title}
                          fill
                          sizes="(min-width: 1024px) 460px, 100vw"
                          className="object-cover transition duration-700 hover:scale-105"
                        />
                      </div>
                    </div>
                    <span className="absolute -top-4 -left-4 grid h-16 w-16 place-items-center rounded-2xl bg-[var(--color-primary-darker)] text-xl font-bold text-white shadow-lg ring-4 ring-white">
                      {f.badge}
                    </span>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll
                  delay={1}
                  className={`lg:col-span-7 ${reverse ? 'lg:order-1 lg:pr-10' : 'lg:pl-10'}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-primary)]">
                    {f.accent}
                  </p>
                  <h3 className="heading-display mt-4 text-2xl sm:text-3xl lg:text-4xl">
                    {f.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700">
                    {f.desc}
                  </p>
                  <div className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-[var(--color-primary-dark)]">
                    <span className="h-px w-10 bg-[var(--color-primary)]" />
                    Surgeon-led standard
                  </div>
                </RevealOnScroll>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
