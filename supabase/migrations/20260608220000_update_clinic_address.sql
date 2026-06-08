-- Update the clinic contact info to the new Eindhoven address and 7-day hours.
-- Footer / contact page / home contact section / popup CTA all read from these
-- site_settings keys, so this single migration updates every surface.

-- Address (single value for all locales)
INSERT INTO site_settings (key, value, locale, category)
VALUES ('contact_address', 'Bisschop Bekkerslaan 4A, 5628RA Eindhoven, Netherlands', 'all', 'contact')
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

-- Email + phone + whatsapp
INSERT INTO site_settings (key, value, locale, category) VALUES
  ('contact_email',    'info@myhaar.com',    'all', 'contact'),
  ('contact_phone',    '+90 507 506 3254',   'all', 'contact'),
  ('contact_whatsapp', '+90 507 506 3254',   'all', 'contact')
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

-- Hours per locale
INSERT INTO site_settings (key, value, locale, category) VALUES
  ('contact_hours', 'Mon-Sun: 10:00-20:00', 'en', 'contact'),
  ('contact_hours', 'Ma-Zo: 10:00-20:00',   'nl', 'contact'),
  ('contact_hours', 'Pzt-Paz: 10:00-20:00', 'tr', 'contact'),
  ('contact_hours', 'Mon-Sun: 10:00-20:00', 'all','contact')
ON CONFLICT (key, locale) DO UPDATE SET value = EXCLUDED.value;

-- New: a free-text 'map_query' used by the GoogleMap embed. Defaults to the
-- address; admin can override with a place name or pin coordinates.
INSERT INTO site_settings (key, value, locale, category)
VALUES ('contact_map_query', 'Bisschop Bekkerslaan 4A, 5628RA Eindhoven', 'all', 'contact')
ON CONFLICT (key, locale) DO NOTHING;
