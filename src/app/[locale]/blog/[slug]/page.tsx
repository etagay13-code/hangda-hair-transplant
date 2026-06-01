import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageHero } from '@/components/layout/PageHero';
import type { BlogPost } from '@/types';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('title,excerpt,meta_title,meta_description,cover_image_url')
    .eq('locale', locale)
    .eq('slug', slug)
    .maybeSingle();
  if (!data) return {};
  return {
    title: data.meta_title || data.title,
    description: data.meta_description || data.excerpt || undefined,
    openGraph: data.cover_image_url ? { images: [data.cover_image_url] } : undefined,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('locale', locale)
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  if (!data) notFound();
  const post = data as BlogPost;

  const { data: relatedData } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('locale', locale)
    .eq('is_published', true)
    .neq('slug', slug)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(3);
  const related = (relatedData ?? []) as BlogPost[];

  const t = await getTranslations('Blog');
  const tNav = await getTranslations('Navigation');
  const tCTA = await getTranslations('CTA');

  return (
    <main>
      <PageHero
        eyebrow={post.category || tNav('blog')}
        title={post.title}
        subtitle={post.excerpt ?? undefined}
        crumbs={[
          { label: tNav('home'), href: '/' },
          { label: tNav('blog'), href: '/blog' },
          { label: post.title },
        ]}
      >
        <p className="text-xs text-slate-600">
          {t('by')} {post.author}
          {post.published_at &&
            ` · ${new Date(post.published_at).toLocaleDateString(locale)}`}
        </p>
      </PageHero>

      {post.cover_image_url && (
        <div className="container-page -mt-10">
          <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image_url} alt={post.title} className="h-auto w-full object-cover" />
          </div>
        </div>
      )}

      <article className="section bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {post.content ? (
              <div
                className="prose-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p className="text-slate-600">No content.</p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <aside>
            <div className="sticky top-24 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/15 to-[var(--color-primary)]/5 p-6 ring-1 ring-[var(--color-primary)]/20">
              <h3 className="text-base font-semibold text-[var(--color-primary-darker)]">
                {tCTA('title')}
              </h3>
              <p className="mt-2 text-sm text-slate-700">{tCTA('subtitle')}</p>
              <a href={`/${locale}/#contact`} className="btn-primary mt-5 w-full">
                {tCTA('button')}
              </a>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-page">
            <h2 className="heading-display text-2xl sm:text-3xl">{t('title')}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-[var(--color-primary)] hover:shadow-md"
                >
                  {p.category && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                      {p.category}
                    </span>
                  )}
                  <p className="mt-2 text-base font-semibold text-[var(--color-primary-darker)]">
                    {p.title}
                  </p>
                  {p.excerpt && <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
