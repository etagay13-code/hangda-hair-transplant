import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import type { GalleryItem } from '@/types';

export async function Gallery({ locale }: { locale: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('gallery')
    .select('*')
    .or(`locale.eq.${locale},locale.eq.en`)
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .limit(9);

  const items = (data ?? []) as GalleryItem[];
  const t = await getTranslations('Gallery');

  if (items.length === 0) return null;

  return (
    <section id="gallery" className="section bg-slate-50">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            {t('title')}
          </p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-base text-slate-600">{t('subtitle')}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <figure
              key={item.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100"
            >
              <div className="grid grid-cols-2">
                <BeforeAfterImage url={item.before_image_url} label={t('before')} />
                <BeforeAfterImage url={item.after_image_url} label={t('after')} />
              </div>
              <figcaption className="space-y-2 p-5">
                {item.technique && (
                  <span className="inline-block rounded-full bg-[var(--color-primary)]/12 px-3 py-1 text-xs font-semibold text-[var(--color-primary-darker)]">
                    {item.technique}
                  </span>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600">
                  {item.grafts != null && (
                    <span>
                      <strong className="text-[var(--color-primary-darker)]">{item.grafts.toLocaleString()}</strong>{' '}
                      {t('grafts')}
                    </span>
                  )}
                  {item.months_after != null && (
                    <span>
                      <strong className="text-[var(--color-primary-darker)]">{item.months_after}</strong>{' '}
                      {t('monthsAfter')}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-slate-600">{item.description}</p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfterImage({ url, label }: { url: string | null; label: string }) {
  return (
    <div className="relative aspect-square bg-slate-100">
      {url ? (
        <Image
          src={url}
          alt={label}
          fill
          sizes="(min-width: 1024px) 200px, 50vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
          {label}
        </div>
      )}
      <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
        {label}
      </span>
    </div>
  );
}
