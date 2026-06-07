-- 009: Footer-specific logo setting.
-- Add a separate footer_logo_url key so the editor can upload a white-on-dark
-- variant of the brand mark. If left empty, the footer falls back to the
-- regular logo_url with a brightness(0)/invert(1) CSS filter so it stays
-- readable on the dark-green background.

INSERT INTO site_settings (key, value, locale, category) VALUES
  ('footer_logo_url', '', 'all', 'general')
ON CONFLICT (key, locale) DO NOTHING;
