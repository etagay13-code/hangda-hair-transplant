'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trackConsultationRequest, trackFormSubmit } from '@/lib/analytics';

interface ServiceOption {
  slug: string;
  title: string;
}

const formSchema = z.object({
  name: z.string().min(2, 'Required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(4, 'Required').max(40),
  country: z.string().max(80).optional().or(z.literal('')),
  service_interest: z.string().max(120).optional().or(z.literal('')),
  hair_loss_type: z.string().max(80).optional().or(z.literal('')),
  message: z.string().max(4000).optional().or(z.literal('')),
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
        <p className="text-2xl font-semibold text-[var(--color-primary-darker)]">
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register('website')}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t('name')} error={errors.name?.message}>
          <input
            type="text"
            placeholder={t('namePlaceholder')}
            className="input-field"
            {...register('name')}
          />
        </Field>
        <Field label={t('phone')} error={errors.phone?.message}>
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
          <input
            type="text"
            placeholder={t('hairLossTypePlaceholder')}
            className="input-field"
            {...register('hair_loss_type')}
          />
        </Field>
      </div>
      <Field label={t('message')} error={errors.message?.message}>
        <textarea
          rows={4}
          placeholder={t('messagePlaceholder')}
          className="input-field"
          {...register('message')}
        />
      </Field>
      {status === 'error' && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {t('errorMessage')}
        </p>
      )}
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto disabled:opacity-60">
        {isSubmitting ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-field">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
