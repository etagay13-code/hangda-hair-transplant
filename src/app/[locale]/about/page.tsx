import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getPageSeo, getSetting, getSiteSettings } from '@/lib/settings';
import { PageHero } from '@/components/layout/PageHero';
import { TrustBadges } from '@/components/home/TrustBadges';
import type { TeamMember } from '@/types';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getPageSeo('about', locale);
  return {
    title: seo?.title || 'About',
    description: seo?.description ?? undefined,
    keywords: seo?.keywords ?? undefined,
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const [{ data: teamData }, settings, t, tNav, tTeam] = await Promise.all([
    supabase
      .from('team_members')
      .select('*')
      .or(`locale.eq.${locale},locale.eq.en`)
      .eq('is_active', true)
      .order('order_index', { ascending: true }),
    getSiteSettings(locale),
    getTranslations('About'),
    getTranslations('Navigation'),
    getTranslations('Team'),
  ]);

  const team = (teamData ?? []) as TeamMember[];
  const patients = getSetting(settings, 'trust_patients_count', '15,000+');
  const countries = getSetting(settings, 'trust_countries_count', '60+');

  const values = [1, 2, 3, 4].map((i) => ({
    title: t(`value${i}Title`),
    desc: t(`value${i}Desc`),
  }));

  return (
    <main>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        crumbs={[{ label: tNav('home'), href: '/' }, { label: tNav('about') }]}
      />

      <section className="section bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="heading-display text-2xl sm:text-3xl">{t('storyTitle')}</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-700">{t('story')}</p>
            </div>
            <div>
              <h2 className="heading-display text-2xl sm:text-3xl">{t('missionTitle')}</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-700">{t('mission')}</p>
            </div>
          </div>
          <aside className="rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/15 to-[var(--color-primary)]/5 p-8 ring-1 ring-[var(--color-primary)]/20">
            <p className="text-xs uppercase tracking-widest text-[var(--color-primary)]">
              By the numbers
            </p>
            <dl className="mt-6 space-y-6">
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500">Patients</dt>
                <dd className="text-3xl font-bold text-[var(--color-primary-darker)]">{patients}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500">Countries</dt>
                <dd className="text-3xl font-bold text-[var(--color-primary-darker)]">{countries}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500">Years</dt>
                <dd className="text-3xl font-bold text-[var(--color-primary-darker)]">20+</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500">Success rate</dt>
                <dd className="text-3xl font-bold text-[var(--color-primary-darker)]">98%</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-page">
          <h2 className="heading-display text-2xl sm:text-3xl">{t('valuesTitle')}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <h3 className="text-base font-semibold text-[var(--color-primary-darker)]">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="section bg-white">
          <div className="container-page">
            <div className="max-w-2xl">
              <h2 className="heading-display text-2xl sm:text-3xl">{tTeam('title')}</h2>
              <p className="mt-4 text-base text-slate-600">{tTeam('subtitle')}</p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m) => (
                <article
                  key={m.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="aspect-[4/5] bg-slate-100">
                    {m.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image_url} alt={m.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-slate-400">
                        <span className="text-4xl font-bold">{m.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 p-5">
                    <p className="text-base font-semibold text-[var(--color-primary-darker)]">
                      {m.name}
                    </p>
                    {m.title && <p className="text-sm text-slate-500">{m.title}</p>}
                    {m.specialization && (
                      <p className="text-xs text-slate-500">{m.specialization}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <TrustBadges locale={locale} />
    </main>
  );
}
