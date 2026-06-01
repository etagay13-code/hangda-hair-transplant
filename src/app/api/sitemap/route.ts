import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { LOCALES } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const STATIC_PATHS = [
  '',
  '/about',
  '/services',
  '/gallery',
  '/team',
  '/testimonials',
  '/blog',
  '/faq',
  '/contact',
];

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://hangda-hair-transplant.vercel.app';

interface Url {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
  alternates?: { hreflang: string; href: string }[];
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildUrl(url: Url) {
  const alternates =
    url.alternates
      ?.map(
        (a) =>
          `<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${xmlEscape(a.href)}" />`
      )
      .join('') ?? '';
  return `<url><loc>${xmlEscape(url.loc)}</loc>${
    url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''
  }${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}${
    url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''
  }${alternates}</url>`;
}

export async function GET() {
  const urls: Url[] = [];

  // Static pages per locale
  for (const path of STATIC_PATHS) {
    for (const locale of LOCALES) {
      const loc = `${SITE_URL}/${locale}${path}`;
      const alternates = LOCALES.map((l) => ({
        hreflang: l,
        href: `${SITE_URL}/${l}${path}`,
      }));
      urls.push({
        loc,
        changefreq: 'weekly',
        priority: path === '' ? 1.0 : 0.8,
        alternates,
      });
    }
  }

  // Dynamic content (best-effort; sitemap still returns if Supabase is down)
  try {
    const admin = createAdminClient();

    const [{ data: services }, { data: posts }] = await Promise.all([
      admin
        .from('services')
        .select('slug, locale, created_at')
        .eq('is_active', true),
      admin
        .from('blog_posts')
        .select('slug, locale, published_at, created_at')
        .eq('is_published', true),
    ]);

    services?.forEach((s) => {
      urls.push({
        loc: `${SITE_URL}/${s.locale}/services/${s.slug}`,
        lastmod: s.created_at,
        changefreq: 'monthly',
        priority: 0.7,
      });
    });

    posts?.forEach((p) => {
      urls.push({
        loc: `${SITE_URL}/${p.locale}/blog/${p.slug}`,
        lastmod: p.published_at ?? p.created_at,
        changefreq: 'monthly',
        priority: 0.6,
      });
    });
  } catch (err) {
    console.error('Sitemap dynamic fetch error:', err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(buildUrl).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
