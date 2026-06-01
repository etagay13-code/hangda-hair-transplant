import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { Services } from '@/components/home/Services';
import { Gallery } from '@/components/home/Gallery';
import { Testimonials } from '@/components/home/Testimonials';
import { Faq } from '@/components/home/Faq';
import { ContactSection } from '@/components/home/ContactSection';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <Services locale={locale} />
      <Gallery locale={locale} />
      <Testimonials locale={locale} />
      <Faq locale={locale} />
      <ContactSection locale={locale} />
    </main>
  );
}
