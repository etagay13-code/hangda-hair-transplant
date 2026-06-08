-- Ensure all integration / tracking settings rows exist so the admin
-- Integrations page has something to load and update. Idempotent thanks
-- to the (key, locale) unique constraint on site_settings.

INSERT INTO site_settings (key, value, locale, category) VALUES
  ('ga_measurement_id',          '', 'all', 'tracking'),
  ('gtm_id',                     '', 'all', 'tracking'),
  ('meta_pixel_id',              '', 'all', 'tracking'),
  ('search_console_verification','', 'all', 'tracking'),
  ('bing_site_verification',     '', 'all', 'tracking'),
  ('yandex_verification',        '', 'all', 'tracking'),
  ('hotjar_id',                  '', 'all', 'tracking'),
  ('clarity_id',                 '', 'all', 'tracking'),
  ('custom_head_html',           '', 'all', 'tracking'),
  ('custom_body_html',           '', 'all', 'tracking')
ON CONFLICT (key, locale) DO NOTHING;
