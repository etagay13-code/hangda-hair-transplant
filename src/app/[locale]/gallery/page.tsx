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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                          <strong className="text-[var(--color-primary-darker)]">
                            {item.grafts.toLocaleString()}
                          </strong>{' '}
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
          )}
        </div>
      </section>
    </main>
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
          sizes="(min-width: 1024px) 280px, 50vw"
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
