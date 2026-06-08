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
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { CampaignPopupServer } from '@/components/layout/CampaignPopupServer';
import { getNavItems } from '@/lib/nav';
import { createClient } from '@/lib/supabase/server';

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

  const siteName = getSetting(settings, 'site_name', 'MyHaar Hair Transplant');
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

  const supabase = await createClient();

  const [messages, settings, navRows, { data: serviceRows }] = await Promise.all([
    getMessages(),
    getSiteSettings(locale),
    getNavItems('primary', locale),
    supabase
      .from('services')
      .select('slug,title')
      .eq('locale', locale)
      .eq('is_active', true)
      .order('order_index', { ascending: true }),
  ]);

  const serviceSubmenu = (serviceRows ?? []).map((s) => ({
    href: `/services/${s.slug}`,
    label: s.title,
  }));

  const gaId = getSetting(settings, 'ga_measurement_id') || undefined;
  const gtmId = getSetting(settings, 'gtm_id') || undefined;
  const pixelId = getSetting(settings, 'meta_pixel_id') || undefined;
  const brand = getSetting(settings, 'site_name', 'MyHaar');
  const whatsapp = getSetting(settings, 'contact_whatsapp');
  const logoUrl = getSetting(settings, 'logo_url') || undefined;

  const customHead = getSetting(settings, 'custom_head_html');
  const customBody = getSetting(settings, 'custom_body_html');
  const searchConsole = getSetting(settings, 'search_console_verification');
  const bingVerify = getSetting(settings, 'bing_site_verification');
  const yandexVerify = getSetting(settings, 'yandex_verification');

  const navItems = navRows.map((row) => ({
    href: row.href,
    label: row.label,
    target: row.target,
  }));

  return (
    <>
      {searchConsole && <meta name="google-site-verification" content={searchConsole} />}
      {bingVerify && <meta name="msvalidate.01" content={bingVerify} />}
      {yandexVerify && <meta name="yandex-verification" content={yandexVerify} />}
      {customHead && (
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: customHead }}
        />
      )}
      <GoogleTagManager gtmId={gtmId} />
      <GoogleAnalytics measurementId={gaId} />
      <MetaPixel pixelId={pixelId} />
      <GoogleTagManagerNoScript gtmId={gtmId} />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Navbar
          brand={brand}
          logoUrl={logoUrl}
          whatsapp={whatsapp || undefined}
          items={navItems}
          serviceSubmenu={serviceSubmenu}
        />
        {children}
        <Footer locale={locale} />
        {whatsapp && <FloatingWhatsApp number={whatsapp} />}
        <CampaignPopupServer locale={locale} />
      </NextIntlClientProvider>
      {customBody && (
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: customBody }}
        />
      )}
    </>
  );
}
