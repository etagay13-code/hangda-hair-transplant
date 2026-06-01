import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { getPageSeo } from '@/lib/settings';
import { PageHero } from '@/components/layout/PageHero';
import type { BlogPost } from '@/types';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getPageSeo('blog', locale);
  return {
    title: seo?.title || 'Blog',
    description: seo?.description ?? undefined,
    keywords: seo?.keywords ?? undefined,
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('locale', locale)
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false });

  const posts = (data ?? []) as BlogPost[];
  const t = await getTranslations('Blog');
  const tNav = await getTranslations('Navigation');

  return (
    <main>
      <PageHero
        eyebrow={t('title')}
        title={t('title')}
        subtitle={t('subtitle')}
        crumbs={[{ label: tNav('home'), href: '/' }, { label: tNav('blog') }]}
      />

      <section className="section">
        <div className="container-page">
          {posts.length === 0 ? (
            <p className="text-center text-slate-500">No posts yet.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <article
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-md"
                >
                  <Link href={`/blog/${p.slug}`} className="block aspect-[16/10] overflow-hidden bg-slate-100">
                    {p.cover_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-3xl text-slate-300">
                        <span className="font-bold">{p.title.charAt(0)}</span>
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    {p.category && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                        {p.category}
                      </span>
                    )}
                    <h2 className="mt-2 text-lg font-semibold text-[var(--color-primary-darker)]">
                      <Link href={`/blog/${p.slug}`} className="hover:underline">
                        {p.title}
                      </Link>
                    </h2>
                    {p.excerpt && (
                      <p className="mt-2 flex-1 text-sm text-slate-600">{p.excerpt}</p>
                    )}
                    <p className="mt-4 text-xs text-slate-500">
                      {t('by')} {p.author}
                      {p.published_at &&
                        ` · ${new Date(p.published_at).toLocaleDateString(locale)}`}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
