/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://hangda-hair-transplant.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/admin/*', '/api/*', '/admin'],
  alternateRefs: [
    {
      href: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hangda-hair-transplant.vercel.app'}/en`,
      hreflang: 'en',
    },
    {
      href: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hangda-hair-transplant.vercel.app'}/nl`,
      hreflang: 'nl',
    },
    {
      href: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hangda-hair-transplant.vercel.app'}/tr`,
      hreflang: 'tr',
    },
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/api'] },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hangda-hair-transplant.vercel.app'}/api/sitemap`,
    ],
  },
  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: path === '/' ? 1.0 : config.priority,
    lastmod: new Date().toISOString(),
    alternateRefs: config.alternateRefs ?? [],
  }),
};
