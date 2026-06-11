import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { getPageSeo, getSetting, getSiteSettings } from '@/lib/settings';
import { PageHero } from '@/components/layout/PageHero';
import { TrustBadges } from '@/components/home/TrustBadges';
import type { TeamMember, GalleryItem } from '@/types';

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

const TIMELINE = [
  { year: '2006', event: 'Foundation. The first MyHaar clinic opens in Den Haag.' },
  { year: '2011', event: 'Adoption of the FUE technique. Strip surgery is fully discontinued.' },
  { year: '2014', event: '5,000th patient served across the Netherlands and Europe.' },
  { year: '2018', event: 'Sapphire FUE and DHI integrated as standard offerings.' },
  { year: '2020', event: 'IGJ registration confirmed. ISHRS membership granted.' },
  { year: '2023', event: 'MyHaar FUE combined protocol launched (Sapphire body + DHI front).' },
  { year: '2025', event: '15,000th patient. Patients served from over 60 countries via the Den Haag clinic.' },
];

const CERTIFICATIONS = [
  { name: 'IGJ', desc: 'Registered with the Inspectie Gezondheidszorg en Jeugd (Dutch Health & Youth Inspectorate).' },
  { name: 'BIG', desc: 'Surgeons hold an active BIG-registration (Wet op de Beroepen in de Individuele Gezondheidszorg).' },
  { name: 'ISHRS', desc: 'International Society of Hair Restoration Surgery — surgeon member.' },
  { name: 'ISO 9001:2015', desc: 'Quality management system certification.' },
];

const EQUIPMENT = [
  { name: 'Sapphire crystal blades', body: 'Pre-cut sapphire tips in five sizes for channel opening at the exact diameter of your follicular units.' },
  { name: 'Choi implanter pens', body: 'Korean precision pens in three diameters for DHI implantation at the angle and depth of natural growth.' },
  { name: 'Magnification microscopes', body: 'Each graft is examined under high-magnification microscopes before implantation.' },
  { name: 'Temperature-controlled holding', body: 'Graft-holding solution kept at optimal temperature to maximise follicle survival.' },
];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const [{ data: teamData }, { data: galleryData }, settings, t, tNav, tTeam] = await Promise.all([
    supabase
      .from('team_members')
      .select('*')
      .or(`locale.eq.${locale},locale.eq.en`)
      .eq('is_active', true)
      .order('order_index', { ascending: true }),
    supabase
      .from('gallery')
      .select('*')
      .or(`locale.eq.${locale},locale.eq.en`)
      .eq('is_active', true)
      .order('order_index', { ascending: true })
      .limit(4),
    getSiteSettings(locale),
    getTranslations('About'),
    getTranslations('Navigation'),
    getTranslations('Team'),
  ]);

  const team = (teamData ?? []) as TeamMember[];
  const gallery = (galleryData ?? []) as GalleryItem[];
  const patients = getSetting(settings, 'trust_patients_count', '15,000+');
  const countries = getSetting(settings, 'trust_countries_count', '60+');

  const values = [1, 2, 3, 4].map((i) => ({ title: t(`value${i}Title`), desc: t(`value${i}Desc`) }));

  return (
    <main>
      <PageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        crumbs={[{ label: tNav('home'), href: '/' }, { label: tNav('about') }]}
      />

      <section className="section bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h2 className="heading-display text-2xl sm:text-3xl">{t('storyTitle')}</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-700">{t('story')}</p>
            </div>
            <div>
              <h2 className="heading-display text-2xl sm:text-3xl">{t('missionTitle')}</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-700">{t('mission')}</p>
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-md">
              <div className="relative aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=900&q=80"
                  alt="MyHaar Clinic in Den Haag"
                  fill
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              <Stat label="Patients" value={patients} />
              <Stat label="Countries" value={countries} />
              <Stat label="Years" value="20+" />
              <Stat label="Success rate" value="98%" />
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

      <section className="section bg-white">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Milestones
            </p>
            <h2 className="heading-display mt-3 text-2xl sm:text-3xl">Two decades of hair restoration</h2>
          </div>
          <ol className="relative mt-12 space-y-8 border-l border-[var(--color-primary)]/30 pl-6 sm:mx-auto sm:max-w-3xl">
            {TIMELINE.map((m) => (
              <li key={m.year} className="relative">
                <span className="absolute -left-[33px] grid h-6 w-6 place-items-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
                  •
                </span>
                <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
                  {m.year}
                </p>
                <p className="mt-1 text-base text-slate-700">{m.event}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Standards
            </p>
            <h2 className="heading-display mt-3 text-2xl sm:text-3xl">
              Accreditations & memberships
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CERTIFICATIONS.map((c) => (
              <div key={c.name} className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
                <p className="text-lg font-bold text-[var(--color-primary-darker)]">{c.name}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Technology
            </p>
            <h2 className="heading-display mt-3 text-2xl sm:text-3xl">
              Equipment we use, every case
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Quality comes from the team, but technology amplifies it. These are the instruments behind every MyHaar procedure.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {EQUIPMENT.map((e) => (
              <div key={e.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-[var(--color-primary-darker)]">{e.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{e.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section className="section bg-slate-50">
          <div className="container-page">
            <div className="max-w-2xl">
              <h2 className="heading-display text-2xl sm:text-3xl">{tTeam('title')}</h2>
              <p className="mt-4 text-base text-slate-600">{tTeam('subtitle')}</p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <article key={m.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="aspect-[4/5] bg-slate-100">
                    {m.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image_url} alt={m.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-slate-300">
                        <span className="text-5xl font-bold">{m.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 p-5">
                    <p className="text-base font-semibold text-[var(--color-primary-darker)]">
                      {m.name}
                    </p>
                    {m.title && <p className="text-sm text-slate-500">{m.title}</p>}
                    {m.bio && <p className="mt-3 text-sm leading-relaxed text-slate-600">{m.bio}</p>}
                    {m.specialization && (
                      <p className="mt-2 text-xs uppercase tracking-wider text-[var(--color-primary)]">
                        {m.specialization}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="section bg-white">
          <div className="container-page">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                  Real outcomes
                </p>
                <h2 className="heading-display mt-3 text-2xl sm:text-3xl">A few recent results</h2>
              </div>
              <Link href="/gallery" className="hidden text-sm font-medium text-[var(--color-primary-dark)] hover:underline sm:inline">
                {tNav('gallery')} →
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {gallery.map((g) => (
                <div key={g.id} className="overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                  <div className="relative aspect-[4/5]">
                    {g.before_image_url && (
                      <Image
                        src={g.before_image_url}
                        alt={g.patient_code || 'Result'}
                        fill
                        sizes="(min-width: 1024px) 280px, 50vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-3 text-xs">
                    <p className="font-semibold text-[var(--color-primary-darker)]">
                      {g.technique}{g.grafts ? ` · ${g.grafts.toLocaleString()} grafts` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <TrustBadges locale={locale} />

    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 text-2xl font-bold text-[var(--color-primary-darker)]">{value}</dd>
    </div>
  );
}
