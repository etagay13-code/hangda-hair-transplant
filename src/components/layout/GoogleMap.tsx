interface Props {
  query: string;
  title?: string;
  className?: string;
  zoom?: number;
}

/**
 * Lightweight Google Maps embed using the public iframe endpoint
 * (no API key required). The `query` is anything Google Maps would search
 * — an address, place name, or "lat,lng" pin.
 */
export function GoogleMap({
  query,
  title = 'MyHaar Clinic location',
  className = '',
  zoom = 16,
}: Props) {
  const trimmed = query.trim();
  if (!trimmed) return null;
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
  const dirHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(trimmed)}`;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm ${className}`}
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full"
          allowFullScreen
        />
      </div>
      <a
        href={dirHref}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-[var(--color-primary-darker)] shadow-md ring-1 ring-slate-200 backdrop-blur transition hover:bg-white"
      >
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9 20l-5.4-5.4a8 8 0 0 1 11.3-11.3l5.4 5.4-11.3 11.3z" />
          <path d="M14 7l3 3" />
        </svg>
        <span>Get directions</span>
      </a>
    </div>
  );
}
