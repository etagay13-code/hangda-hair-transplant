import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { blockField, getPageBlock } from '@/lib/page-blocks';

interface IncludedItem {
  icon: string;
  title: string;
  desc: string;
}

export async function Included({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'Included' });
  const block = await getPageBlock('home', 'included', locale);
  const eyebrow = blockField(block?.eyebrow, t('eyebrow'));
  const title = blockField(block?.title, t('title'));
  const subtitle = blockField(block?.subtitle, t('subtitle'));
  const floatEyebrow = t('floatEyebrow');
  const floatTitle = t('floatTitle');
  const items = t.raw('items') as IncludedItem[];
  const image = blockField(
    block?.image_url,
    'https://images.unsplash.com/photo-1580281657527-47f249e8f4df?auto=format&fit=crop&w=900&q=80'
  );
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-24 lg:py-32">
      <div className="container-page grid gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <RevealOnScroll>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                {eyebrow}
              </p>
              <h2 className="heading-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                {subtitle}
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={1} className="relative mt-10">
              <div
                aria-hidden="true"
                className="pulse-glow absolute -inset-6 -z-10 rounded-[3rem] bg-[var(--color-primary)]/25 blur-2xl"
              />
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-[var(--color-primary)]/20">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={image}
                    alt="MyHaar clinic in Den Haag"
                    fill
                    sizes="(min-width: 1024px) 440px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-darker)]/40 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 px-5 py-4 backdrop-blur">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                    {floatEyebrow}
                  </p>
                  <p className="mt-1 text-lg font-bold text-[var(--color-primary-darker)]">
                    {floatTitle}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        <ul className="space-y-5 lg:col-span-7">
          {items.map((it, i) => (
            <RevealOnScroll key={it.title} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5} as="li">
              <div className="group flex items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-md">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)]/12 text-2xl transition group-hover:scale-110">
                  {it.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[var(--color-primary-darker)]">
                    {it.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{it.desc}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="hidden self-center text-[var(--color-primary)] transition group-hover:translate-x-1 sm:inline"
                >
                  ✓
                </span>
              </div>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
}
