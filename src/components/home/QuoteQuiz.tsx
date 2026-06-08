'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { trackConsultationRequest, trackFormSubmit } from '@/lib/analytics';

const SERVICE_OPTIONS = [
  { value: 'sapphire-fue', label: 'Sapphire FUE', sub: 'Modern FUE with sapphire blades' },
  { value: 'dhi-hair-transplant', label: 'DHI Hair Transplant', sub: 'Choi implanters · precise hairline' },
  { value: 'women-hair-transplant', label: "Women's Hair Restoration", sub: 'Female-pattern · no-shave DHI' },
  { value: 'beard-transplant', label: 'Beard Transplant', sub: 'Density · shape · jawline' },
  { value: 'eyebrow-transplant', label: 'Eyebrow Transplant', sub: 'Single-hair grafts · permanent' },
  { value: 'prp-treatment', label: 'PRP Therapy', sub: 'Non-surgical · 45 min · no downtime' },
  { value: 'not-sure', label: 'Not sure yet', sub: "Let's explore options together" },
];

const TIMELINE_OPTIONS = [
  { value: 'next-month', label: 'Next month', sub: "I'm ready" },
  { value: '1-3-months', label: '1–3 months', sub: 'Soon' },
  { value: '3-6-months', label: '3–6 months', sub: 'Planning ahead' },
  { value: 'flexible', label: 'Flexible', sub: 'Just exploring' },
];

const COUNTRIES = [
  'Netherlands', 'Belgium', 'Germany', 'France', 'United Kingdom',
  'Sweden', 'Norway', 'Denmark', 'Finland', 'Spain', 'Italy',
  'Austria', 'Switzerland', 'Ireland', 'Luxembourg', 'Portugal',
  'United States', 'Canada', 'UAE', 'Saudi Arabia', 'Türkiye', 'Other',
];

export function QuoteQuiz({ whatsapp }: { whatsapp?: string }) {
  const locale = useLocale();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [service, setService] = useState('');
  const [timeline, setTimeline] = useState('');
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = 3;
  const progress = step <= total ? Math.round(((step - 1) / total) * 100) : 100;

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const message = [
        `Service: ${service}`,
        `Timeline: ${timeline}`,
        `Country: ${country}`,
      ].join('\n');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          country,
          service_interest: service,
          message,
          locale,
          form_name: 'quote',
          source_page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        trackFormSubmit('quote', { service });
        trackConsultationRequest({ service, timeline });
        setStep(4);
      } else {
        setError(json.error || 'Could not submit. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const wa = whatsapp ? whatsapp.replace(/[^0-9]/g, '') : '';

  return (
    <section
      id="quote"
      className="relative overflow-hidden bg-white py-20 sm:py-28"
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">
            Get Your Plan
          </span>
          <h2 className="heading-display mt-4 text-3xl sm:text-4xl lg:text-5xl leading-tight">
            <span>Three quick questions.</span>
            <br />
            <span className="text-[var(--color-primary)]">One personal plan.</span>
          </h2>
          <p className="mt-5 text-base text-slate-600">
            Takes 30 seconds. We respond with your transparent quote within 24 hours.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-10">
          {step !== 4 && (
            <div className="mb-6 flex items-center gap-4">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-[var(--color-primary)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                {String(step).padStart(2, '0')} / 0{total}
              </span>
            </div>
          )}

          {step === 1 && (
            <Step
              question="What treatment are you considering?"
              help="Pick the area that interests you most. You can refine specifics later."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                {SERVICE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setService(opt.value)}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                      service === opt.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 ring-2 ring-[var(--color-primary)]/30'
                        : 'border-slate-200 hover:border-[var(--color-primary)]/50'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[var(--color-primary-darker)]">
                        {opt.label}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">{opt.sub}</p>
                    </div>
                    {service === opt.value && (
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] text-white">
                        <svg width={12} height={12} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path d="M3 7l3 3 5-6" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <Nav
                backDisabled
                nextDisabled={!service}
                onNext={() => setStep(2)}
              />
            </Step>
          )}

          {step === 2 && (
            <Step
              question="When would you like to plan your procedure?"
              help="We design around your timeline — pick the window that fits you best."
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {TIMELINE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTimeline(opt.value)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      timeline === opt.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 ring-2 ring-[var(--color-primary)]/30'
                        : 'border-slate-200 hover:border-[var(--color-primary)]/50'
                    }`}
                  >
                    <p className="text-sm font-bold text-[var(--color-primary-darker)]">
                      {opt.label}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{opt.sub}</p>
                  </button>
                ))}
              </div>
              <label className="mt-6 block">
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Where will you be travelling from?
                </span>
                <select
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="input-field mt-2 w-full"
                >
                  <option value="">Select your country…</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <Nav
                onBack={() => setStep(1)}
                nextDisabled={!timeline || !country}
                onNext={() => setStep(3)}
              />
            </Step>
          )}

          {step === 3 && (
            <Step
              question="Where should we send your plan?"
              help="A coordinator replies within 24 hours with a personalised, transparent quote."
            >
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Your full name
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Lars de Vries"
                    className="input-field mt-2 w-full"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Email address
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="lars@email.com"
                      className="input-field mt-2 w-full"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Phone (with country code)
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+31 70 123 4567"
                      className="input-field mt-2 w-full"
                    />
                  </label>
                </div>
              </div>
              {error && (
                <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              <Nav
                onBack={() => setStep(2)}
                nextLabel={submitting ? 'Sending…' : 'Get my personal plan'}
                nextDisabled={!name || !email || !phone || submitting}
                onNext={submit}
              />
              <p className="mt-5 text-center text-[10px] uppercase tracking-widest text-slate-400">
                GDPR-compliant · Your information is never shared with third parties.
              </p>
            </Step>
          )}

          {step === 4 && (
            <div className="py-6 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary-darker)]">
                <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-[var(--color-primary-darker)]">
                Your plan is on its way
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
                A dedicated coordinator from our Den Haag clinic will contact you within
                24 hours. We&apos;re preparing your transparent treatment quote now.
              </p>
              {wa && (
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                >
                  Or chat now on WhatsApp
                  <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.6}>
                    <path d="M3 7h8M7 3l4 4-4 4" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Step({
  question,
  help,
  children,
}: {
  question: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-[var(--color-primary-darker)] sm:text-2xl">
        {question}
      </h3>
      <p className="mt-2 text-sm text-slate-600">{help}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Nav({
  onBack,
  backDisabled,
  onNext,
  nextDisabled,
  nextLabel = 'Next step',
}: {
  onBack?: () => void;
  backDisabled?: boolean;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <button
        type="button"
        disabled={backDisabled || !onBack}
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-[var(--color-primary-darker)] disabled:opacity-40"
      >
        <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.6}>
          <path d="M11 7H3M7 3L3 7l4 4" />
        </svg>
        Back
      </button>
      <button
        type="button"
        disabled={nextDisabled}
        onClick={onNext}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {nextLabel}
        <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M3 7h8M7 3l4 4-4 4" />
        </svg>
      </button>
    </div>
  );
}
