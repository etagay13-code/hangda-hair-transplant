-- 014: Seed Turkish and Dutch nav_items so the navbar isn't stuck in English
-- on /tr and /nl. The 'all' row keeps the English label as the fallback.

INSERT INTO nav_items (label, href, target, locale, group_key, order_index, is_active) VALUES
  -- Dutch (NL)
  ('Over ons',          '/about',    '_self', 'nl', 'primary', 10, true),
  ('Behandelingen',     '/services', '_self', 'nl', 'primary', 20, true),
  ('Voor & Na',         '/gallery',  '_self', 'nl', 'primary', 30, true),
  ('Blog',              '/blog',     '_self', 'nl', 'primary', 40, true),
  ('Veelgestelde vragen','#faq',     '_self', 'nl', 'primary', 50, true),
  ('Contact',           '/contact',  '_self', 'nl', 'primary', 60, true),
  -- Turkish (TR)
  ('Hakkımızda',        '/about',    '_self', 'tr', 'primary', 10, true),
  ('Hizmetler',         '/services', '_self', 'tr', 'primary', 20, true),
  ('Öncesi & Sonrası',  '/gallery',  '_self', 'tr', 'primary', 30, true),
  ('Blog',              '/blog',     '_self', 'tr', 'primary', 40, true),
  ('SSS',               '#faq',      '_self', 'tr', 'primary', 50, true),
  ('İletişim',          '/contact',  '_self', 'tr', 'primary', 60, true)
ON CONFLICT DO NOTHING;
