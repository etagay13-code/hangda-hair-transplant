-- Add Home as the first nav item for all locales (master + per-language).
-- order_index = 5 so it lands before About Us (10) without renumbering.
-- Idempotent via the UNIQUE constraint we added on (group_key, locale, href).

INSERT INTO nav_items (label, href, target, locale, group_key, order_index, is_active) VALUES
  ('Home',       '/', '_self', 'all', 'primary', 5, true),
  ('Home',       '/', '_self', 'en',  'primary', 5, true),
  ('Home',       '/', '_self', 'nl',  'primary', 5, true),
  ('Anasayfa',   '/', '_self', 'tr',  'primary', 5, true)
ON CONFLICT (group_key, locale, href) DO NOTHING;
