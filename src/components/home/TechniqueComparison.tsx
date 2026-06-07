import { Link } from '@/i18n/navigation';
import { blockField, getPageBlock } from '@/lib/page-blocks';

const TECHNIQUES = [
  {
    name: 'Sapphire FUE',
    slugByLocale: { en: 'sapphire-fue', nl: 'saffier-fue', tr: 'safir-fue' } as Record<string, string>,
    summary: 'Modern FUE with sapphire-tipped blades for smaller incisions and higher density.',
    bestFor: 'Most patients · Large sessions · Beard & body donor work',
    duration: '6–8 h',
    anesthesia: 'Local',
    sessionGrafts: 'Up to 5,500',
    price: '€1,750',
    accent: false,
  },
  {
    name: 'DHI',
    slugByLocale: { en: 'dhi-hair-transplant', nl: 'dhi-haartransplantatie', tr: 'dhi-sac-ekimi' } as Record<string, string>,
    summary: 'Direct implantation with Choi pens. Highest precision; ideal for hairlines and no-shave women.',
    bestFor: 'Front hairline · No-shave women · Eyebrows',
    duration: '6–8 h',
    anesthesia: 'Local',
    sessionGrafts: 'Up to 3,500',
    price: '€1,750',
    accent: true,
  },
  {
    name: 'MyHaar FUE',
    slugByLocale: { en: 'sapphire-fue', nl: 'saffier-fue', tr: 'safir-fue' } as Record<string, string>,
    summary: 'Our flagship combined protocol: Sapphire FUE body + DHI front-row finish for maximum naturalness.',
    bestFor: 'Norwood IV–V · Age 40+ · Premium results',
    duration: '7–9 h',
    anesthesia: 'Local',
    sessionGrafts: 'Up to 5,500',
    price: '€2,400',
    accent: false,
  },
];

export async function TechniqueComparison({ locale }: { locale: string }) {
  const block = await getPageBlock('home', 'techniques', locale);
  const eyebrow = blockField(block?.eyebrow, 'Compare techniques');
  const title = blockField(block?.title, 'Three techniques. One standard of care.');
  const subtitle = blockField(
    block?.subtitle,
    'Choose the approach that fits your hair-loss pattern, donor capacity, and lifestyle. Every package includes the procedure, all medications, the PRP support session, and lifetime follow-up at our Den Haag clinic.'
  );
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            {eyebrow}
          </p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base text-slate-600">{subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TECHNIQUES.map((tech) => (
            <article
              key={tech.name}
              className={`flex flex-col rounded-3xl border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                tech.accent
                  ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30'
                  : 'border-slate-200 hover:border-[var(--color-primary)]'
              }`}
            >
              {tech.accent && (
                <span className="mb-4 inline-block w-fit rounded-full bg-[var(--color-primary)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-bold text-[var(--color-primary-darker)]">{tech.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{tech.summary}</p>

              <dl className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
                <Row label="Best for" value={tech.bestFor} />
                <Row label="Duration" value={tech.duration} />
                <Row label="Anesthesia" value={tech.anesthesia} />
                <Row label="Max grafts / session" value={tech.sessionGrafts} />
              </dl>

              <div className="mt-7 rounded-2xl bg-[var(--color-primary)]/8 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                  Quote
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--color-primary-darker)]">
                  Personalised after free consultation
                </p>
              </div>

              <Link
                href={`/services/${tech.slugByLocale[locale] ?? tech.slugByLocale.en}`}
                className={`mt-6 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  tech.accent
                    ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
                    : 'border border-[var(--color-primary)]/40 text-[var(--color-primary-darker)] hover:bg-[var(--color-primary)]/10'
                }`}
              >
                Learn more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-[var(--color-primary-darker)]">{value}</dd>
    </div>
  );
}
