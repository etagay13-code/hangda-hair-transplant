import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { WhyUs } from '@/components/home/WhyUs';
import { Services } from '@/components/home/Services';
import { Process } from '@/components/home/Process';
import { Gallery } from '@/components/home/Gallery';
import { Testimonials } from '@/components/home/Testimonials';
import { Faq } from '@/components/home/Faq';
import { ContactSection } from '@/components/home/ContactSection';
import { TrustBadges } from '@/components/home/TrustBadges';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <WhyUs />
      <Services locale={locale} />
      <Process />
      <Gallery locale={locale} />
      <Testimonials locale={locale} />
      <Faq locale={locale} />
      <ContactSection locale={locale} />
      <TrustBadges locale={locale} />
    </main>
  );
}
