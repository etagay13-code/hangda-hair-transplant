import Image from 'next/image';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

const INCLUDED = [
  { icon: '👨‍⚕️', title: 'Free surgeon consultation', desc: 'In-person or video assessment with the lead surgeon, including hairline design.' },
  { icon: '🩺', title: 'Pre-op blood tests', desc: 'Full preoperative workup at our Den Haag clinic.' },
  { icon: '✂️', title: 'The full procedure', desc: 'Sapphire FUE or DHI with the senior surgical team — local anaesthesia, all instruments.' },
  { icon: '🌿', title: 'PRP support session', desc: 'A PRP injection at the end of your procedure to accelerate follicle activation.' },
  { icon: '💊', title: 'All medications & kit', desc: 'Pain relief, antibiotics, post-op shampoo, lotion, headband, neck pillow.' },
  { icon: '🧼', title: 'First clinical wash', desc: 'Hands-on first wash next day with your nurse, plus your written recovery briefing.' },
  { icon: '🌍', title: 'Multilingual care', desc: 'Nederlands · English · Türkçe · Deutsch · العربية — coordinator with you throughout.' },
  { icon: '🛡️', title: '18-month written guarantee', desc: 'If transplanted follicles do not yield, we re-implant at no surgical cost.' },
  { icon: '📅', title: 'Lifetime follow-up', desc: 'Scheduled at 3, 6, 12 and 18 months — and reachable for life after.' },
];

export function Included() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
      <div className="container-page grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <RevealOnScroll>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                What is included
              </p>
              <h2 className="heading-display mt-3 text-3xl sm:text-4xl lg:text-5xl">
                One transparent price. No surprises.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                The number on your written quote is the number you pay — and it covers everything from your first consultation to your last follow-up appointment, eighteen months later.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={1} className="relative mt-10">
              <div
                aria-hidden="true"
                className="pulse-glow absolute -inset-6 -z-10 rounded-[3rem] bg-[var(--color-primary)]/25 blur-2xl"
              />
              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-[var(--color-primary)]/20">
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/gallery/clinic-procedure.jpg"
                    alt="MyHaar clinic in Den Haag"
                    fill
                    sizes="(min-width: 1024px) 440px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-darker)]/40 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 px-5 py-4 backdrop-blur">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-primary)]">
                    From
                  </p>
                  <p className="mt-1 text-3xl font-bold text-[var(--color-primary-darker)]">
                    €1,750
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Transparent quote, valid 30 days
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        <ul className="space-y-5 lg:col-span-7">
          {INCLUDED.map((it, i) => (
            <RevealOnScroll key={it.title} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5} as="li">
              <div className="group flex items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:shadow-md">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)]/12 text-2xl transition group-hover:scale-110">
                  {it.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[var(--color-primary-darker)]">
                    {it.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{it.desc}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="hidden self-center text-[var(--color-primary)] transition group-hover:translate-x-1 sm:inline"
                >
                  ✓
                </span>
              </div>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
}
