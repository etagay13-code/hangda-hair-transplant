import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { routing } from '@/i18n/routing';
import { getSiteSettings, getPageSeo, getSetting } from '@/lib/settings';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from '@/components/analytics/GoogleTagManager';
import { MetaPixel } from '@/components/analytics/MetaPixel';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const [settings, seo] = await Promise.all([
    getSiteSettings(locale),
    getPageSeo('home', locale),
  ]);

  const siteName = getSetting(settings, 'site_name', 'Hang Da Hair Transplant');
  const title = seo?.title || getSetting(settings, 'site_title', siteName);
  const description =
    seo?.description ||
    getSetting(
      settings,
      'site_description',
      'Premium hair restoration trusted worldwide.'
    );

  const ogImage = seo?.og_image || getSetting(settings, 'default_og_image');

  return {
    title,
    description,
    keywords: seo?.keywords ?? undefined,
    openGraph: {
      title,
      description,
      locale,
      siteName,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: seo?.canonical_url ?? undefined,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}`])
      ),
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const [messages, settings] = await Promise.all([
    getMessages(),
    getSiteSettings(locale),
  ]);

  const gaId = getSetting(settings, 'ga_measurement_id') || undefined;
  const gtmId = getSetting(settings, 'gtm_id') || undefined;
  const pixelId = getSetting(settings, 'meta_pixel_id') || undefined;
  const brand = getSetting(settings, 'site_name', 'Hang Da');
  const whatsapp = getSetting(settings, 'contact_whatsapp');
  const logoUrl = getSetting(settings, 'logo_url') || undefined;

  return (
    <>
      <GoogleTagManager gtmId={gtmId} />
      <GoogleAnalytics measurementId={gaId} />
      <MetaPixel pixelId={pixelId} />
      <GoogleTagManagerNoScript gtmId={gtmId} />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Navbar brand={brand} logoUrl={logoUrl} whatsapp={whatsapp || undefined} />
        {children}
        <Footer locale={locale} />
      </NextIntlClientProvider>
    </>
  );
}
