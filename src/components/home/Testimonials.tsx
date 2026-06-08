import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { blockField, getPageBlock } from '@/lib/page-blocks';
import type { Testimonial } from '@/types';

export async function Testimonials({ locale }: { locale: string }) {
  const supabase = await createClient();
  const [{ data }, t, block] = await Promise.all([
    supabase
      .from('testimonials')
      .select('*')
      .or(`locale.eq.${locale},locale.eq.en`)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8),
    getTranslations('Testimonials'),
    getPageBlock('home', 'testimonials', locale),
  ]);

  const items = (data ?? []) as Testimonial[];
  const eyebrow = blockField(block?.eyebrow, t('title'));
  const title = blockField(block?.title, t('title'));
  const subtitle = blockField(block?.subtitle, t('subtitle'));

  if (items.length === 0) return null;

  // Duplicate for seamless marquee loop on desktop
  const looped = [...items, ...items];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-slate-50 py-16 sm:py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-[var(--color-primary-darker)]/10 blur-3xl"
      />
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
      </div>

      {/* Mobile: native horizontal scroll with snap (user-controlled swipe) */}
      <RevealOnScroll className="mt-10 overflow-x-auto pb-4 lg:hidden">
        <div className="flex w-max gap-4 px-5 snap-x snap-mandatory">
          {items.map((it) => (
            <blockquote
              key={it.id}
              className="flex w-[85vw] max-w-[340px] shrink-0 snap-center flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Avatar name={it.name} />
                <Stars count={it.rating} />
              </div>
              {it.comment && (
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                  &ldquo;{it.comment}&rdquo;
                </p>
              )}
              <footer className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-primary-darker)]">
                    {it.name}
                  </p>
                  {it.country && (
                    <p className="text-xs text-slate-500">{it.country}</p>
                  )}
                </div>
                {(it.technique || it.grafts) && (
                  <p className="text-right text-xs text-slate-500">
                    {it.technique && <span className="block">{it.technique}</span>}
                    {it.grafts && (
                      <span className="block font-semibold text-[var(--color-primary-darker)]">
                        {it.grafts.toLocaleString()} grafts
                      </span>
                    )}
                  </p>
                )}
              </footer>
            </blockquote>
          ))}
        </div>
      </RevealOnScroll>

      {/* Desktop: auto-scrolling marquee */}
      <RevealOnScroll className="marquee group mt-16 hidden overflow-hidden lg:block">
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-slate-50 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-slate-50 to-transparent"
          />
          <div className="marquee-track flex w-max gap-6 px-6">
            {looped.map((it, i) => (
              <blockquote
                key={`${it.id}-${i}`}
                className="flex w-[420px] shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <Avatar name={it.name} />
                  <Stars count={it.rating} />
                </div>
                {it.comment && (
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-slate-700">
                    “{it.comment}”
                  </p>
                )}
                <footer className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-primary-darker)]">
                      {it.name}
                    </p>
                    {it.country && (
                      <p className="text-xs text-slate-500">{it.country}</p>
                    )}
                  </div>
                  {(it.technique || it.grafts) && (
                    <p className="text-right text-xs text-slate-500">
                      {it.technique && <span className="block">{it.technique}</span>}
                      {it.grafts && (
                        <span className="block font-semibold text-[var(--color-primary-darker)]">
                          {it.grafts.toLocaleString()} grafts
                        </span>
                      )}
                    </p>
                  )}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
  // Stable colour from name hash
  const palette = [
    'bg-emerald-100 text-emerald-800',
    'bg-amber-100 text-amber-800',
    'bg-sky-100 text-sky-800',
    'bg-violet-100 text-violet-800',
    'bg-rose-100 text-rose-800',
  ];
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  return (
    <span
      className={`grid h-12 w-12 place-items-center rounded-full text-base font-bold ${palette[idx]}`}
      aria-hidden="true"
    >
      {initials || '★'}
    </span>
  );
}

function Stars({ count }: { count: number }) {
  const n = Math.max(0, Math.min(5, count));
  return (
    <div
      className="flex gap-0.5 text-[var(--color-primary)]"
      aria-label={`${n} of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < n ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 2l2.95 6.4 6.95.62-5.25 4.74L18.18 21 12 17.27 5.82 21l1.53-7.24L2.1 9.02l6.95-.62z" />
        </svg>
      ))}
    </div>
  );
}
