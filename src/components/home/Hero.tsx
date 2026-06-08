import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { CountUp } from '@/components/ui/CountUp';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { blockField, getPageBlock } from '@/lib/page-blocks';

interface HeroStat {
  label: string;
  value: string; // e.g. "15K+", "98%", "20+"
  visible?: boolean;
}
interface HeroBadge {
  label: string;
  value: string;
  visible?: boolean;
}
interface HeroResultCard {
  eyebrow: string;
  title: string;
  visible?: boolean;
}
interface HeroExtra {
  stats?: HeroStat[];
  badgeTopLeft?: HeroBadge;
  badgeBottomRight?: HeroBadge;
  resultCard?: HeroResultCard;
}

function parseNumericValue(raw: string): { value: number; suffix: string; prefix: string } {
  const m = raw.match(/^([^\d.]*)([\d.,]+)(.*)$/);
  if (!m) return { value: 0, suffix: raw, prefix: '' };
  const num = Number(m[2].replace(',', '.'));
  return {
    prefix: m[1] ?? '',
    value: Number.isFinite(num) ? num : 0,
    suffix: m[3] ?? '',
  };
}

export async function Hero({ locale }: { locale: string }) {
  const [t, block] = await Promise.all([
    getTranslations('Hero'),
    getPageBlock('home', 'hero', locale),
  ]);

  const eyebrow = blockField(block?.eyebrow, t('badge'));
  const title = blockField(block?.title, t('title'));
  const subtitle = blockField(block?.subtitle, t('subtitle'));
  const ctaLabel = blockField(block?.cta_label, t('ctaPrimary'));
  const ctaHref = blockField(block?.cta_href, '#contact');
  const imageUrl = blockField(
    block?.image_url,
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1000&q=80'
  );

  const extra = (block?.extra as HeroExtra | null) ?? {};

  const stats: HeroStat[] =
    extra.stats && extra.stats.length > 0
      ? extra.stats
      : [
          { label: t('stats.patients'), value: '15K+', visible: true },
          { label: t('stats.experience'), value: '20+', visible: true },
          { label: t('stats.success'), value: '98%', visible: true },
          { label: t('stats.countries'), value: '60+', visible: true },
        ];

  const badgeTopLeft: HeroBadge =
    extra.badgeTopLeft ?? { label: 'Success rate', value: '98%', visible: true };
  const badgeBottomRight: HeroBadge =
    extra.badgeBottomRight ?? { label: 'Written guarantee', value: '18 mo.', visible: true };
  const resultCard: HeroResultCard =
    extra.resultCard ?? {
      eyebrow: 'Recent result · MyHaar FUE',
      title: '3,400 grafts · 12 months',
      visible: true,
    };

  const visibleStats = stats.filter((s) => s.visible !== false);

  return (
    <section id="top" className="relative isolate overflow-hidden bg-white">
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
              {eyebrow}
            </span>
            <h1 className="heading-display mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.75rem]">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700">
              {subtitle}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href={ctaHref} className="btn-primary">
                {ctaLabel}
              </a>
              <a href="#gallery" className="btn-outline">
                {t('ctaSecondary')}
              </a>
            </div>

            {visibleStats.length > 0 && (
              <dl
                className={`mt-16 grid gap-x-8 gap-y-8 border-t border-[var(--color-primary)]/20 pt-10 ${
                  visibleStats.length >= 4
                    ? 'grid-cols-2 sm:grid-cols-4'
                    : visibleStats.length === 3
                    ? 'grid-cols-3'
                    : 'grid-cols-2'
                }`}
              >
                {visibleStats.map((s, i) => {
                  const parsed = parseNumericValue(s.value);
                  return (
                    <RevealOnScroll key={s.label + i} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                        {s.label}
                      </dt>
                      <dd className="mt-1 text-3xl font-bold text-[var(--color-primary-darker)] sm:text-4xl">
                        {parsed.value > 0 ? (
                          <CountUp value={parsed.value} prefix={parsed.prefix} suffix={parsed.suffix} />
                        ) : (
                          s.value
                        )}
                      </dd>
                    </RevealOnScroll>
                  );
                })}
              </dl>
            )}
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
                    src={imageUrl}
                    alt="Real MyHaar patient result"
                    fill
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
                {resultCard.visible !== false && (
                  <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/95 px-5 py-4 backdrop-blur shadow-lg">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                      {resultCard.eyebrow}
                    </p>
                    <p className="mt-1 text-base font-semibold text-[var(--color-primary-darker)]">
                      {resultCard.title}
                    </p>
                  </div>
                )}
              </div>

              {badgeTopLeft.visible !== false && (
                <div className="absolute -left-6 top-12 rotate-[-6deg] rounded-2xl bg-[var(--color-primary-darker)] px-4 py-3 text-white shadow-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                    {badgeTopLeft.label}
                  </p>
                  <p className="mt-0.5 text-2xl font-bold">{badgeTopLeft.value}</p>
                </div>
              )}
              {badgeBottomRight.visible !== false && (
                <div className="absolute -right-4 bottom-32 rotate-[5deg] rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-slate-200">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                    {badgeBottomRight.label}
                  </p>
                  <p className="mt-0.5 text-2xl font-bold text-[var(--color-primary-darker)]">
                    {badgeBottomRight.value}
                  </p>
                </div>
              )}
            </div>
          </RevealOnScroll>
        </div>

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
