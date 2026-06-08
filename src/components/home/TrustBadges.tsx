import { getSetting, getSiteSettings } from '@/lib/settings';

function bool(value: string | null | undefined, fallback = true): boolean {
  if (value == null) return fallback;
  const v = value.trim().toLowerCase();
  if (v === 'false' || v === '0' || v === 'no' || v === 'off') return false;
  if (v === 'true' || v === '1' || v === 'yes' || v === 'on') return true;
  return fallback;
}

export async function TrustBadges({ locale }: { locale: string }) {
  const settings = await getSiteSettings(locale);
  const sectionVisible = bool(getSetting(settings, 'trust_section_visible'), true);
  if (!sectionVisible) return null;

  const items = [
    {
      label: 'Accreditation',
      value: getSetting(settings, 'trust_certifications'),
      visible: bool(getSetting(settings, 'trust_certifications_visible'), true),
    },
    {
      label: 'Guarantee',
      value: getSetting(settings, 'trust_guarantee_years'),
      visible: bool(getSetting(settings, 'trust_guarantee_visible'), true),
    },
    {
      label: 'Patients',
      value: getSetting(settings, 'trust_patients_count'),
      visible: bool(getSetting(settings, 'trust_patients_visible'), true),
    },
    {
      label: 'Countries',
      value: getSetting(settings, 'trust_countries_count'),
      visible: bool(getSetting(settings, 'trust_countries_visible'), true),
    },
  ].filter((i) => i.visible && !!i.value);

  const press = getSetting(settings, 'trust_press');
  const pressVisible = bool(getSetting(settings, 'trust_press_visible'), true);
  const showPress = pressVisible && !!press;

  if (items.length === 0 && !showPress) return null;

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
        {showPress && (
          <p className="mt-10 border-t border-white/15 pt-6 text-center text-xs uppercase tracking-widest text-white/70">
            {press}
          </p>
        )}
      </div>
    </section>
  );
}
