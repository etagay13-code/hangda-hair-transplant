import { getTranslations, setRequestLocale } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Hero');

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-3xl text-center space-y-6">
        <span className="inline-block rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-700">
          {t('badge')}
        </span>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
          {t('title')}
        </h1>
        <p className="text-lg text-slate-600">{t('subtitle')}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <a
            href={`/${locale}/contact`}
            className="rounded-full bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 transition"
          >
            {t('ctaPrimary')}
          </a>
          <a
            href={`/${locale}/gallery`}
            className="rounded-full border border-slate-300 px-6 py-3 text-slate-900 font-medium hover:bg-slate-50 transition"
          >
            {t('ctaSecondary')}
          </a>
        </div>
      </div>
    </main>
  );
}
