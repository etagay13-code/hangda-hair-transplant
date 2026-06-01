import Script from 'next/script';

interface Props {
  measurementId?: string | null;
}

export function GoogleAnalytics({ measurementId }: Props) {
  const id = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id || id.includes('XXX')) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${id}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
