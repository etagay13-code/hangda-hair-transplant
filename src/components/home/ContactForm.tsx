'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MessageCircle, Phone, type LucideIcon } from 'lucide-react';
import { trackConsultationRequest, trackFormSubmit } from '@/lib/analytics';

interface ServiceOption {
  slug: string;
  title: string;
}

const NORWOOD_OPTIONS = [
  { value: '', label: '— Select stage —' },
  { value: 'norwood-1', label: 'Norwood 1 — Minimal recession' },
  { value: 'norwood-2', label: 'Norwood 2 — Slight temple recession' },
  { value: 'norwood-3', label: 'Norwood 3 — Receded temples' },
  { value: 'norwood-4', label: 'Norwood 4 — Visible thinning crown' },
  { value: 'norwood-5', label: 'Norwood 5 — Advanced loss' },
  { value: 'norwood-6', label: 'Norwood 6 — Bridge gone' },
  { value: 'norwood-7', label: 'Norwood 7 — Horseshoe pattern' },
  { value: 'female-pattern', label: 'Female-pattern diffuse loss' },
  { value: 'not-sure', label: 'Not sure — please advise' },
];

const CONTACT_PREF: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle },
  { value: 'phone', label: 'Phone', Icon: Phone },
  { value: 'email', label: 'Email', Icon: Mail },
];

const formSchema = z.object({
  name: z.string().min(2, 'Required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(4, 'Required').max(40),
  country: z.string().max(80).optional().or(z.literal('')),
  service_interest: z.string().max(120).optional().or(z.literal('')),
  hair_loss_type: z.string().max(80).optional().or(z.literal('')),
  preferred_contact: z.string().max(20).optional().or(z.literal('')),
  message: z.string().max(4000).optional().or(z.literal('')),
  consent: z.boolean().refine((v) => v === true, 'Please accept to continue'),
  website: z.string().max(0).optional(), // honeypot
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm({ services }: { services: ServiceOption[] }) {
  const t = useTranslations('ContactForm');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { preferred_contact: 'whatsapp', consent: false },
  });

  async function onSubmit(values: FormValues) {
    setStatus('idle');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          locale,
          form_name: 'consultation',
          source_page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
        trackFormSubmit('consultation', { service: values.service_interest });
        trackConsultationRequest({ service: values.service_interest });
        reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/8 p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--color-primary)] text-white shadow-lg">
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            <path d="M5 13l4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-5 text-2xl font-semibold text-[var(--color-primary-darker)]">
          {t('successTitle')}
        </p>
        <p className="mt-3 text-sm text-slate-700">{t('successMessage')}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn-outline mt-6"
        >
          OK
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register('website')}
      />

      {/* Section 1 — About you */}
      <fieldset className="space-y-5">
        <legend className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-primary)] text-[10px] text-white">
            1
          </span>
          About you
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t('name')} required error={errors.name?.message}>
            <input
              type="text"
              placeholder={t('namePlaceholder')}
              className="input-field"
              {...register('name')}
            />
          </Field>
          <Field label={t('phone')} required error={errors.phone?.message}>
            <input
              type="tel"
              placeholder={t('phonePlaceholder')}
              className="input-field"
              {...register('phone')}
            />
          </Field>
          <Field label={t('email')} error={errors.email?.message}>
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="input-field"
              {...register('email')}
            />
          </Field>
          <Field label={t('country')} error={errors.country?.message}>
            <input
              type="text"
              placeholder={t('countryPlaceholder')}
              className="input-field"
              {...register('country')}
            />
          </Field>
        </div>

        {/* Preferred contact */}
        <div>
          <span className="label-field">How should we reach you?</span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {CONTACT_PREF.map((opt) => (
              <label
                key={opt.value}
                className="group relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center text-sm transition has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary)]/10 has-[:checked]:ring-2 has-[:checked]:ring-[var(--color-primary)]/30 hover:border-[var(--color-primary)]/50"
              >
                <input
                  type="radio"
                  value={opt.value}
                  className="sr-only"
                  {...register('preferred_contact')}
                />
                <opt.Icon size={16} strokeWidth={1.8} className="text-[var(--color-primary-darker)]" />
                <span className="font-medium text-[var(--color-primary-darker)]">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Section 2 — Treatment interest */}
      <fieldset className="space-y-5 border-t border-slate-100 pt-7">
        <legend className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-primary)] text-[10px] text-white">
            2
          </span>
          Treatment interest
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t('service')} error={errors.service_interest?.message}>
            <select className="input-field" {...register('service_interest')}>
              <option value="">{t('servicePlaceholder')}</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t('hairLossType')} error={errors.hair_loss_type?.message}>
            <select className="input-field" {...register('hair_loss_type')}>
              {NORWOOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      {/* Section 3 — Goals */}
      <fieldset className="space-y-5 border-t border-slate-100 pt-7">
        <legend className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-primary)] text-[10px] text-white">
            3
          </span>
          Tell us about your goals
        </legend>
        <Field label={t('message')} error={errors.message?.message}>
          <textarea
            rows={4}
            placeholder={t('messagePlaceholder')}
            className="input-field"
            {...register('message')}
          />
        </Field>

        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[var(--color-primary)]"
            {...register('consent')}
          />
          <span>
            I agree that MyHaar can contact me about my consultation request.
            My data is never shared with third parties.
          </span>
        </label>
        {errors.consent && (
          <p className="text-xs text-red-600">{errors.consent.message}</p>
        )}
      </fieldset>

      {status === 'error' && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {t('errorMessage')}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full text-base disabled:opacity-60"
      >
        {isSubmitting ? t('submitting') : t('submit')}
        {!isSubmitting && (
          <span className="ml-2" aria-hidden>
            →
          </span>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-field">
        {label}
        {required && <span className="text-[var(--color-primary)]"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
