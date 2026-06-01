const STAGES = [
  { when: 'Day 0–3', title: 'Surgery & rest', desc: 'Procedure day plus two recovery days at your hotel. Mild swelling peaks then subsides.' },
  { when: 'Day 4–10', title: 'Wash protocol', desc: 'Specific foam wash protocol starts day 4. Scabs naturally exfoliate over the following week.' },
  { when: 'Week 2–8', title: 'Shock loss', desc: 'Temporary shedding of transplanted hairs — completely normal, follicles remain alive beneath the skin.' },
  { when: 'Month 3–6', title: 'Regrowth begins', desc: 'New growth pushes through and starts to thicken and darken over the following months.' },
  { when: 'Month 6–12', title: 'Dramatic change', desc: 'Most of the visible transformation. Density and coverage continue to improve every month.' },
  { when: 'Month 12–18', title: 'Final result', desc: 'Final density and texture are assessed. 18-month written growth guarantee covers this period.' },
];

export function RecoveryTimeline() {
  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)]">
            Recovery
          </p>
          <h2 className="heading-display mt-3 text-3xl sm:text-4xl">
            Your 18-month journey, mapped out
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Hair restoration is a process. Here is exactly what happens, when — so you can plan around it with confidence.
          </p>
        </div>

        <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((stage, i) => (
            <li key={stage.when} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-[var(--color-primary)] px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow">
                Stage {i + 1}
              </span>
              <p className="mt-3 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
                {stage.when}
              </p>
              <h3 className="mt-2 text-base font-semibold text-[var(--color-primary-darker)]">
                {stage.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{stage.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
