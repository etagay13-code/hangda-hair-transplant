-- 008: Menu editor + custom head/body scripts + homepage block ordering
-- - nav_items table powers the navbar (admin can add / edit / reorder / hide)
-- - site_settings gains custom_head_html, custom_body_html, search_console_verification
-- - page_blocks gets a seeded order_index for the homepage so the section sequence
--   reflects what's already rendered today; admins can re-order from /admin/page-blocks.

-- ===============================
-- Navigation items
-- ===============================
CREATE TABLE IF NOT EXISTS nav_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,                -- text shown to the user
  href text NOT NULL,                 -- absolute path or #anchor
  target text DEFAULT '_self',        -- '_self' | '_blank'
  locale text DEFAULT 'all',          -- 'all' | 'en' | 'nl' | 'tr'
  group_key text DEFAULT 'primary',   -- 'primary' (navbar) | 'footer' (footer nav)
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nav_items_lookup ON nav_items(group_key, locale, is_active);
CREATE INDEX IF NOT EXISTS idx_nav_items_order ON nav_items(order_index);

ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read nav_items" ON nav_items;
CREATE POLICY "Public read nav_items" ON nav_items
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin all nav_items" ON nav_items;
CREATE POLICY "Admin all nav_items" ON nav_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Seed defaults that match the current hardcoded navbar
INSERT INTO nav_items (label, href, target, locale, group_key, order_index, is_active) VALUES
  ('About Us',     '/about',    '_self', 'all', 'primary', 10, true),
  ('Services',     '/services', '_self', 'all', 'primary', 20, true),
  ('Before & After', '/gallery', '_self', 'all', 'primary', 30, true),
  ('Blog',         '/blog',     '_self', 'all', 'primary', 40, true),
  ('FAQ',          '#faq',      '_self', 'all', 'primary', 50, true),
  ('Contact',      '/contact',  '_self', 'all', 'primary', 60, true)
ON CONFLICT DO NOTHING;

-- ===============================
-- Custom scripts (head / body) and Search Console
-- ===============================
INSERT INTO site_settings (key, value, locale, category) VALUES
  ('custom_head_html', '', 'all', 'tracking'),
  ('custom_body_html', '', 'all', 'tracking'),
  ('search_console_verification', '', 'all', 'tracking'),
  ('bing_site_verification',      '', 'all', 'tracking'),
  ('yandex_verification',         '', 'all', 'tracking'),
  ('hotjar_id',                   '', 'all', 'tracking'),
  ('clarity_id',                  '', 'all', 'tracking')
ON CONFLICT (key, locale) DO NOTHING;

-- ===============================
-- Homepage block ordering
-- Refresh page_blocks order_index so the admin reorder controls map to the
-- current visual sequence (Hero → WhyUs → Techniques → Services → Process →
-- Gallery → Included → Recovery → Testimonials → FAQ → Contact).
-- ===============================
UPDATE page_blocks SET order_index = 10  WHERE page_key = 'home' AND section_key = 'hero';
UPDATE page_blocks SET order_index = 20  WHERE page_key = 'home' AND section_key = 'why_us';
UPDATE page_blocks SET order_index = 30  WHERE page_key = 'home' AND section_key = 'techniques';
UPDATE page_blocks SET order_index = 40  WHERE page_key = 'home' AND section_key = 'services';
UPDATE page_blocks SET order_index = 50  WHERE page_key = 'home' AND section_key = 'process';
UPDATE page_blocks SET order_index = 60  WHERE page_key = 'home' AND section_key = 'gallery';
UPDATE page_blocks SET order_index = 70  WHERE page_key = 'home' AND section_key = 'included';
UPDATE page_blocks SET order_index = 80  WHERE page_key = 'home' AND section_key = 'recovery';
UPDATE page_blocks SET order_index = 90  WHERE page_key = 'home' AND section_key = 'testimonials';
UPDATE page_blocks SET order_index = 100 WHERE page_key = 'home' AND section_key = 'faq';
UPDATE page_blocks SET order_index = 110 WHERE page_key = 'home' AND section_key = 'contact';
