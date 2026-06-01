const INCLUDED = [
  {
    icon: '🛬',
    title: 'VIP airport transfers',
    desc: 'Private driver from Istanbul Airport to your hotel, then to the clinic and back.',
  },
  {
    icon: '🏨',
    title: '4★ hotel accommodation',
    desc: 'Two nights in a 4-star hotel within walking distance of the clinic. Breakfast included.',
  },
  {
    icon: '🩺',
    title: 'Pre-op blood tests',
    desc: 'Full preoperative workup completed on arrival — included in your package.',
  },
  {
    icon: '🌿',
    title: 'PRP support session',
    desc: 'A PRP injection at the end of your procedure accelerates healing and follicle activation.',
  },
  {
    icon: '💊',
    title: 'All medications & kit',
    desc: 'Pain relief, antibiotics, post-op shampoo, lotion, headband, neck pillow — all provided.',
  },
  {
    icon: '🌍',
    title: 'Multilingual coordinator',
    desc: 'Personal coordinator speaks English, Dutch, German, Turkish and Arabic — with you 24/7.',
  },
  {
    icon: '🛡️',
    title: '18-month written guarantee',
    desc: 'If transplanted follicles do not yield, we re-implant at no additional surgical cost.',
  },
  {
    icon: '📅',
    title: 'Lifetime follow-up',
    desc: 'Scheduled check-ins at 3, 6, 12, 18 months — and we remain reachable for life.',
  },
];

export function Included() {
  return (
    <section className="section bg-slate-50">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            All-inclusive package
          </p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl">
            One transparent price. Everything included.
          </h2>
          <p className="mt-4 text-base text-slate-600">
            No hidden surcharges. No upsells on the day. The number you see in your written quote is the number you pay.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INCLUDED.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[var(--color-primary)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--color-primary)]/12 text-xl">
                {it.icon}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-[var(--color-primary-darker)]">
                {it.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
