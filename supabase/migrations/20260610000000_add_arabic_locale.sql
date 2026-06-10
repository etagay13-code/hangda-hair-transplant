-- Add Arabic (ar) seed rows for everything the frontend reads per-locale.
-- All idempotent via UNIQUE constraints / ON CONFLICT DO NOTHING.

-- 1) nav_items: Arabic navbar labels
INSERT INTO nav_items (label, href, target, locale, group_key, order_index, is_active) VALUES
  ('الرئيسية',        '/',         '_self', 'ar', 'primary', 5,  true),
  ('من نحن',          '/about',    '_self', 'ar', 'primary', 10, true),
  ('الخدمات',          '/services', '_self', 'ar', 'primary', 20, true),
  ('قبل وبعد',         '/gallery',  '_self', 'ar', 'primary', 30, false), -- hidden by default to match other locales
  ('المدونة',          '/blog',     '_self', 'ar', 'primary', 40, true),
  ('الأسئلة الشائعة',  '#faq',      '_self', 'ar', 'primary', 50, true),
  ('اتصل بنا',         '/contact',  '_self', 'ar', 'primary', 60, true)
ON CONFLICT (group_key, locale, href) DO NOTHING;

-- 2) Arabic working-hours setting
INSERT INTO site_settings (key, value, locale, category) VALUES
  ('contact_hours', 'الإثنين – الأحد: 10:00 – 20:00', 'ar', 'contact')
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

-- 3) Footer tagline (per locale row so admin can edit later)
INSERT INTO site_settings (key, value, locale, category) VALUES
  ('footer_tagline', '', 'ar', 'footer')
ON CONFLICT (key, locale) DO NOTHING;

-- 4) Popup per-locale rows (empty → translation fallback). Admin page
--    already lists 'ar' since we extended LOCALES.
DO $$
DECLARE
  k text;
  keys text[] := ARRAY[
    'popup_line_one','popup_line_two','popup_line_three',
    'popup_check_1','popup_check_2',
    'popup_cta','popup_disclaimer','popup_right_title',
    'popup_card_1','popup_card_2','popup_card_3','popup_card_4',
    'popup_whatsapp_message'
  ];
BEGIN
  FOREACH k IN ARRAY keys
  LOOP
    INSERT INTO site_settings (key, value, locale, category)
    VALUES (k, '', 'ar', 'popup')
    ON CONFLICT (key, locale) DO NOTHING;
  END LOOP;
END $$;
