-- Fix: nav_items had no UNIQUE constraint, so re-running migrations 008 and
-- 014 (the seeds) duplicated every row. The auto-deploy workflow re-ran them
-- and the navbar started showing each item 2× or 3×.
--
-- Step 1: dedupe by (group_key, locale, href) keeping the earliest row.
-- Step 2: add a UNIQUE constraint so future re-runs are no-ops via
--         ON CONFLICT DO NOTHING (which both seed migrations already use).

DELETE FROM nav_items a
USING nav_items b
WHERE a.id <> b.id
  AND a.group_key = b.group_key
  AND a.locale = b.locale
  AND a.href = b.href
  AND a.created_at > b.created_at;

CREATE UNIQUE INDEX IF NOT EXISTS uq_nav_items_group_locale_href
  ON nav_items (group_key, locale, href);
