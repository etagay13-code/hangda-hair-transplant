import enMessages from '../../messages/en.json';
import nlMessages from '../../messages/nl.json';
import trMessages from '../../messages/tr.json';

type Locale = 'en' | 'nl' | 'tr';

const MESSAGES: Record<Locale, unknown> = {
  en: enMessages,
  nl: nlMessages,
  tr: trMessages,
};

function lookup(obj: unknown, dotPath: string): string | null {
  const parts = dotPath.split('.');
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur && typeof cur === 'object' && part in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return null;
    }
  }
  return typeof cur === 'string' ? cur : null;
}

type Field = 'eyebrow' | 'title' | 'subtitle' | 'body' | 'cta_label' | 'cta_href';
type FieldMap = Partial<Record<Field, string>>;

// Translation namespace keys that homepage section components actually read.
const SECTION_TRANSLATIONS: Record<string, FieldMap> = {
  'home/hero': {
    eyebrow: 'Hero.badge',
    title: 'Hero.title',
    subtitle: 'Hero.subtitle',
    cta_label: 'Hero.ctaPrimary',
  },
  'home/why_us': {
    eyebrow: 'WhyUs.title',
    title: 'WhyUs.title',
    subtitle: 'WhyUs.subtitle',
  },
  'home/services': {
    eyebrow: 'Services.title',
    title: 'Services.title',
    subtitle: 'Services.subtitle',
  },
  'home/process': {
    eyebrow: 'Process.title',
    title: 'Process.title',
    subtitle: 'Process.subtitle',
  },
  'home/gallery': {
    eyebrow: 'Gallery.title',
    title: 'Gallery.title',
    subtitle: 'Gallery.subtitle',
  },
  'home/testimonials': {
    eyebrow: 'Testimonials.title',
    title: 'Testimonials.title',
    subtitle: 'Testimonials.subtitle',
  },
  'home/faq': {
    eyebrow: 'FAQ.title',
    title: 'FAQ.title',
    subtitle: 'FAQ.subtitle',
  },
  'home/contact': {
    eyebrow: 'Contact.title',
    title: 'Contact.title',
    subtitle: 'Contact.subtitle',
  },
  'about/hero': {
    eyebrow: 'About.eyebrow',
    title: 'About.title',
    subtitle: 'About.subtitle',
  },
  'about/story': {
    title: 'About.storyTitle',
    body: 'About.story',
  },
  'about/mission': {
    title: 'About.missionTitle',
    body: 'About.mission',
  },
};

// Sections that render hardcoded English text in the component (no
// translation key available). The values mirror what the component's
// blockField() fallback currently emits.
const STATIC_FALLBACKS: Record<string, FieldMap> = {
  'home/techniques': {
    eyebrow: 'Compare techniques',
    title: 'Three techniques. One standard of care.',
    subtitle: 'Choose the approach that fits your hair-loss pattern, donor capacity, and lifestyle. Every package includes the procedure, all medications, the PRP support session, and lifetime follow-up at our Den Haag clinic.',
  },
  'home/included': {
    eyebrow: 'What is included',
    title: 'One transparent price. No surprises.',
    subtitle: 'The number on your written quote is the number you pay — and it covers everything from your first consultation to your last follow-up appointment, eighteen months later.',
  },
  'home/recovery': {
    eyebrow: 'Recovery',
    title: 'Your 18-month journey, mapped out',
    subtitle: 'Hair restoration is a process. Here is exactly what happens, when — so you can plan around it with confidence.',
  },
};

/**
 * Returns the text the public site is currently rendering for a given
 * page/section/locale/field — preferring the i18n translation, falling
 * back to a hardcoded English copy where the component doesn't read from
 * translations. Used as the form defaultValue so editors see live copy
 * instead of an empty field.
 */
export function getRenderedField(
  pageKey: string,
  sectionKey: string,
  locale: string,
  field: Field
): string {
  const key = `${pageKey}/${sectionKey}`;
  const map = SECTION_TRANSLATIONS[key];
  if (map?.[field]) {
    const lang: Locale = locale === 'all' ? 'en' : (locale as Locale);
    const value = lookup(MESSAGES[lang] ?? MESSAGES.en, map[field]!);
    if (value) return value;
  }
  const fallback = STATIC_FALLBACKS[key];
  if (fallback?.[field]) return fallback[field]!;
  return '';
}
