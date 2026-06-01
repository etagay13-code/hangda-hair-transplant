import { getSetting, getSiteSettings } from '@/lib/settings';

export async function TrustBadges({ locale }: { locale: string }) {
  const settings = await getSiteSettings(locale);
  const certifications = getSetting(settings, 'trust_certifications');
  const guarantee = getSetting(settings, 'trust_guarantee_years');
  const patients = getSetting(settings, 'trust_patients_count');
  const countries = getSetting(settings, 'trust_countries_count');
  const press = getSetting(settings, 'trust_press');

  const items = [
    { label: 'Accreditation', value: certifications },
    { label: 'Guarantee', value: guarantee },
    { label: 'Patients', value: patients },
    { label: 'Countries', value: countries },
  ].filter((i) => !!i.value);

  if (items.length === 0 && !press) return null;

  return (
    <section className="bg-[var(--color-primary-darker)] text-white">
      <div className="container-page py-14">
        {items.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it) => (
              <div key={it.label} className="border-l-2 border-[var(--color-primary)] pl-4">
                <p className="text-xs uppercase tracking-widest text-[var(--color-primary)]">
                  {it.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/90">{it.value}</p>
              </div>
            ))}
          </div>
        )}
        {press && (
          <p className="mt-10 border-t border-white/15 pt-6 text-center text-xs uppercase tracking-widest text-white/70">
            {press}
          </p>
        )}
      </div>
    </section>
  );
}
