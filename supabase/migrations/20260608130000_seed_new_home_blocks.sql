-- Seed page_blocks rows for homepage sections that were added after the
-- initial 007 seed (departments, quote_quiz). 'all' locale row only; text
-- fields stay NULL so translation fallback kicks in, but admins can now
-- edit them inline from /admin/pages/home without a "row missing" notice.

INSERT INTO page_blocks
  (page_key, section_key, locale, order_index, is_active)
VALUES
  ('home', 'departments', 'all', 25, true),
  ('home', 'quote_quiz',  'all', 95, true)
ON CONFLICT (page_key, section_key, locale) DO NOTHING;
