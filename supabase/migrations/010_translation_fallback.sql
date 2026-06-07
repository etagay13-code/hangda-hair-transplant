-- 010: Restore translation fallback for page_blocks
--
-- The default 'all' rows shipped in migration 007 hard-coded English copy
-- into eyebrow / title / subtitle / body, which silently overrode the
-- per-locale translations in messages/{en,nl,tr}.json. As a result NL and
-- TR visitors saw English titles on the homepage.
--
-- After this migration, the 'all' rows keep their non-translatable bits
-- (image_url, cta_href) but null out the text fields so the component's
-- `blockField(block?.field, t('translation'))` fallback fires and pulls
-- the proper translation.
--
-- Editors can still override per-locale by creating a locale='en'|'nl'|'tr'
-- row from /admin/page-blocks → that wins over the 'all' row.

UPDATE page_blocks
SET
  eyebrow  = NULL,
  title    = NULL,
  subtitle = NULL,
  body     = NULL,
  cta_label = NULL
WHERE locale = 'all';

-- Hero is the only block where the image is part of the content.
-- Keep its image_url so the floating result card photo survives.
-- Other blocks that needed images already have them stored separately.
