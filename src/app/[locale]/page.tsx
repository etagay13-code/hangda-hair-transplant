import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { Departments } from '@/components/home/Departments';
import { Services } from '@/components/home/Services';
import { Process } from '@/components/home/Process';
import { Gallery } from '@/components/home/Gallery';
import { Included } from '@/components/home/Included';
import { RecoveryTimeline } from '@/components/home/RecoveryTimeline';
import { Testimonials } from '@/components/home/Testimonials';
import { QuoteQuiz } from '@/components/home/QuoteQuiz';
import { Faq } from '@/components/home/Faq';
import { ContactSection } from '@/components/home/ContactSection';
import { TrustBadges } from '@/components/home/TrustBadges';
import { getSetting, getSiteSettings } from '@/lib/settings';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getSiteSettings(locale);
  const whatsapp = getSetting(settings, 'contact_whatsapp');

  return (
    <main>
      <Hero locale={locale} />
      <Departments locale={locale} />
      <Services locale={locale} />
      <Process locale={locale} />
      <Gallery locale={locale} />
      <Included locale={locale} />
      <RecoveryTimeline locale={locale} />
      <Testimonials locale={locale} />
      <QuoteQuiz whatsapp={whatsapp || undefined} />
      <Faq locale={locale} />
      <ContactSection locale={locale} />
      <TrustBadges locale={locale} />
    </main>
  );
}
