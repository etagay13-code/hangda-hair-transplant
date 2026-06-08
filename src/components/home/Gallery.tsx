import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { blockField, getPageBlock } from '@/lib/page-blocks';
import type { GalleryItem } from '@/types';

export async function Gallery({ locale }: { locale: string }) {
  const supabase = await createClient();
  const [{ data }, t, tCommon, block] = await Promise.all([
    supabase
      .from('gallery')
      .select('*')
      .or(`locale.eq.${locale},locale.eq.en`)
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(6),
    getTranslations('Gallery'),
    getTranslations('Common'),
    getPageBlock('home', 'gallery', locale),
  ]);

  const items = (data ?? []) as GalleryItem[];
  const eyebrow = blockField(block?.eyebrow, t('title'));
  const title = blockField(block?.title, t('title'));
  const subtitle = blockField(block?.subtitle, t('subtitle'));

  if (items.length === 0) return null;

  return (
    <section id="gallery" className="section bg-slate-50">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            {eyebrow}
          </p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base text-slate-600">{subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <GalleryCard key={item.id} item={item} beforeLabel={t('before')} afterLabel={t('after')} graftsLabel={t('grafts')} monthsLabel={t('monthsAfter')} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/gallery" className="btn-outline">
            {tCommon('viewAll')} →
          </Link>
        </div>
      </div>
    </section>
  );
}

function GalleryCard({
  item,
  beforeLabel,
  afterLabel,
  graftsLabel,
  monthsLabel,
}: {
  item: GalleryItem;
  beforeLabel: string;
  afterLabel: string;
  graftsLabel: string;
  monthsLabel: string;
}) {
  // Cases ship as single composite images (before+after baked into one
  // file). Pick whichever URL field is set.
  const imageUrl = item.before_image_url || item.after_image_url;
  return (
    <figure className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
      {imageUrl ? (
        <div className="relative aspect-[4/5] bg-slate-100">
          <Image
            src={imageUrl}
            alt={item.patient_code || `${beforeLabel} / ${afterLabel}`}
            fill
            sizes="(min-width: 1024px) 400px, 50vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="grid aspect-[4/5] place-items-center bg-slate-100 text-xs text-slate-400">
          —
        </div>
      )}
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
              {graftsLabel}
            </span>
          )}
          {item.months_after != null && (
            <span>
              <strong className="text-[var(--color-primary-darker)]">{item.months_after}</strong> {monthsLabel}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-slate-600 line-clamp-3">{item.description}</p>
        )}
      </figcaption>
    </figure>
  );
}

