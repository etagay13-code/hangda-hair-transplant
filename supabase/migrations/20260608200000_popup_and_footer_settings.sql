-- Settings to make the homepage trust badges + campaign popup fully
-- editable from /admin/footer and /admin/popup.

-- ============================================================
-- TRUST BADGES — show/hide toggles
-- (text values already exist via earlier seeds; just add visibility.)
-- ============================================================
INSERT INTO site_settings (key, value, locale, category) VALUES
  ('trust_certifications_visible', 'true', 'all', 'footer'),
  ('trust_guarantee_visible',      'true', 'all', 'footer'),
  ('trust_patients_visible',       'true', 'all', 'footer'),
  ('trust_countries_visible',      'true', 'all', 'footer'),
  ('trust_press_visible',          'true', 'all', 'footer'),
  ('trust_section_visible',        'true', 'all', 'footer')
ON CONFLICT (key, locale) DO NOTHING;

-- Footer tagline keys per locale (Footer.tsx falls back to translation if empty)
INSERT INTO site_settings (key, value, locale, category) VALUES
  ('footer_tagline', '', 'en', 'footer'),
  ('footer_tagline', '', 'nl', 'footer'),
  ('footer_tagline', '', 'tr', 'footer')
ON CONFLICT (key, locale) DO NOTHING;

-- ============================================================
-- POPUP — master toggles + per-locale copy
-- ============================================================
INSERT INTO site_settings (key, value, locale, category) VALUES
  ('popup_enabled',         'true', 'all', 'popup'),
  ('popup_delay_seconds',   '6',    'all', 'popup'),
  ('popup_dismiss_hours',   '24',   'all', 'popup')
ON CONFLICT (key, locale) DO NOTHING;

-- Per-locale copy. Empty values let the existing messages/{locale}.json
-- Popup namespace serve as fallback, so editors can override only what
-- they want while leaving the rest translation-driven.
DO $$
DECLARE
  lang text;
  keys text[] := ARRAY[
    'popup_line_one','popup_line_two','popup_line_three',
    'popup_check_1','popup_check_2',
    'popup_cta','popup_disclaimer','popup_right_title',
    'popup_card_1','popup_card_2','popup_card_3','popup_card_4',
    'popup_whatsapp_message'
  ];
  k text;
BEGIN
  FOREACH lang IN ARRAY ARRAY['en','nl','tr']
  LOOP
    FOREACH k IN ARRAY keys
    LOOP
      INSERT INTO site_settings (key, value, locale, category)
      VALUES (k, '', lang, 'popup')
      ON CONFLICT (key, locale) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
