import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import type { Testimonial } from '@/types';

export async function Testimonials({ locale }: { locale: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .or(`locale.eq.${locale},locale.eq.en`)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(8);

  const items = (data ?? []) as Testimonial[];
  const t = await getTranslations('Testimonials');

  if (items.length === 0) return null;

  // Duplicate for seamless marquee loop
  const looped = [...items, ...items];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-white py-24 sm:py-32"
    >
      <div className="container-page">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
            {t('title')}
          </p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base text-slate-600">{t('subtitle')}</p>
        </RevealOnScroll>
      </div>

      <RevealOnScroll className="marquee group mt-16 overflow-hidden">
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent"
          />
          <div className="marquee-track flex w-max gap-6 px-6">
            {looped.map((it, i) => (
              <blockquote
                key={`${it.id}-${i}`}
                className="flex w-[340px] shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:w-[400px]"
              >
                <Stars count={it.rating} />
                {it.comment && (
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
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
