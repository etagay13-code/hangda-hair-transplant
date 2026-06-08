import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { getPageSeo } from '@/lib/settings';
import { PageHero } from '@/components/layout/PageHero';
import type { GalleryItem } from '@/types';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ technique?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getPageSeo('gallery', locale);
  return {
    title: seo?.title || 'Gallery',
    description: seo?.description ?? undefined,
    keywords: seo?.keywords ?? undefined,
  };
}

export default async function GalleryPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { technique } = await searchParams;
  setRequestLocale(locale);

  const supabase = await createClient();
  let query = supabase
    .from('gallery')
    .select('*')
    .or(`locale.eq.${locale},locale.eq.en`)
    .eq('is_active', true)
    .order('order_index', { ascending: true });
  if (technique) query = query.eq('technique', technique);
  const { data } = await query;
  const items = (data ?? []) as GalleryItem[];

  const techniques = Array.from(
    new Set(items.map((i) => i.technique).filter((t): t is string => !!t))
  );

  const t = await getTranslations('Gallery');
  const tNav = await getTranslations('Navigation');
  const tCommon = await getTranslations('Common');

  return (
    <main>
      <PageHero
        eyebrow={t('title')}
        title={t('title')}
        subtitle={t('subtitle')}
        crumbs={[{ label: tNav('home'), href: '/' }, { label: tNav('gallery') }]}
      />

      <section className="section">
        <div className="container-page">
          {techniques.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              <Link
                href="/gallery"
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase transition ${
                  !technique
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-[var(--color-primary)]'
                }`}
              >
                All
              </Link>
              {techniques.map((tech) => (
                <Link
                  key={tech}
                  href={`/gallery?technique=${encodeURIComponent(tech)}`}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase transition ${
                    technique === tech
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-[var(--color-primary)]'
                  }`}
                >
                  {tech}
                </Link>
              ))}
            </div>
          )}

          {items.length === 0 ? (
            <p className="text-center text-slate-500">No results yet.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  beforeLabel={t('before')}
                  afterLabel={t('after')}
                  graftsLabel={t('grafts')}
                  monthsLabel={t('monthsAfter')}
                />
              ))}
            </div>
          )}

          <div className="mt-16 rounded-3xl border border-slate-200 bg-gradient-to-br from-[var(--color-primary)]/15 to-white p-10 text-center">
            <h2 className="heading-display text-2xl sm:text-3xl">Your result could be next.</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-slate-600">
              Send us your photos for a free, no-obligation surgical assessment. You will receive a personalised plan within 24 hours.
            </p>
            <a href={`/${locale}/#contact`} className="btn-primary mt-6">
              {tCommon('freeConsultation')}
            </a>
          </div>
        </div>
      </section>
    </main>
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
  // Cases are uploaded as a single composite image (before+after baked
  // together). Always render single image — prefer before_image_url, fall
  // back to after_image_url.
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
        <div className="flex items-center justify-between">
          {item.technique && (
            <span className="rounded-full bg-[var(--color-primary)]/12 px-3 py-1 text-xs font-semibold text-[var(--color-primary-darker)]">
              {item.technique}
            </span>
          )}
          {item.patient_code && (
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              {item.patient_code}
            </span>
          )}
        </div>
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
          <p className="text-sm leading-relaxed text-slate-600">{item.description}</p>
        )}
      </figcaption>
    </figure>
  );
}

