import { getSetting, getSiteSettings } from '@/lib/settings';

const ITINERARY = [
  { day: 'Day 1', title: 'Arrival & consultation', body: 'Driver collects you at Istanbul Airport. Check-in at your hotel. Pre-op assessment and hairline design with your surgeon in the afternoon.' },
  { day: 'Day 2', title: 'Procedure day', body: 'Light breakfast, transfer to the clinic. Six to eight hours including breaks. Coordinator with you throughout. Return to hotel with aftercare kit.' },
  { day: 'Day 3', title: 'First wash & departure', body: 'Return to the clinic for your first wash and recovery briefing. Driver returns you to the airport for your evening flight.' },
];

export async function Travel({ locale }: { locale: string }) {
  const settings = await getSiteSettings(locale);
  const address = getSetting(settings, 'contact_address', 'Istanbul, Turkey');

  return (
    <section className="section bg-slate-50">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Travel to Istanbul
          </p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl">
            Three days. One transformation.
          </h2>
          <p className="mt-4 text-base text-slate-600">
            The majority of our international patients fly in on Day 1 and back on Day 3. We handle every logistical detail so you can focus entirely on your recovery.
          </p>
          <dl className="mt-8 space-y-4 text-sm">
            <Row label="Clinic location" value={address} />
            <Row label="Nearest airport" value="Istanbul Airport (IST), 35 minutes by car" />
            <Row label="Languages spoken" value="EN · NL · DE · TR · AR" />
            <Row label="Hotel category" value="4★ partner hotels, walking distance" />
            <Row label="Visa" value="Most EU passport holders enter visa-free" />
          </dl>
        </div>

        <div className="lg:col-span-7">
          <ol className="space-y-5">
            {ITINERARY.map((stop, i) => (
              <li key={stop.day} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-base font-bold text-white">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
                    {stop.day}
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--color-primary-darker)]">
                    {stop.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{stop.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between border-b border-slate-200 pb-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-[var(--color-primary-darker)]">{value}</dd>
    </div>
  );
}
