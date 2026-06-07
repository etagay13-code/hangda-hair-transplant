import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { blockField, getPageBlock } from '@/lib/page-blocks';
import type { Faq as FaqRow } from '@/types';

export async function Faq({ locale }: { locale: string }) {
  const supabase = await createClient();
  const [{ data }, t, block] = await Promise.all([
    supabase
      .from('faq')
      .select('*')
      .eq('locale', locale)
      .eq('is_active', true)
      .order('order_index', { ascending: true }),
    getTranslations('FAQ'),
    getPageBlock('home', 'faq', locale),
  ]);

  const items = (data ?? []) as FaqRow[];
  const eyebrow = blockField(block?.eyebrow, t('title'));
  const title = blockField(block?.title, t('title'));
  const subtitle = blockField(block?.subtitle, t('subtitle'));

  if (items.length === 0) return null;

  return (
    <section id="faq" className="section bg-slate-50">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            {eyebrow}
          </p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base text-slate-600">{subtitle}</p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {items.map((q) => (
            <details
              key={q.id}
              className="group rounded-xl border border-slate-200 bg-white p-5 open:border-[var(--color-primary)] open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[var(--color-primary-darker)]">
                <span>{q.question}</span>
                <span
                  aria-hidden="true"
                  className="ml-4 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-primary)]/12 text-[var(--color-primary-darker)] transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-slate-700">
                {q.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
