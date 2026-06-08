-- Auto-deploy verification migration.
--
-- This is the first migration to use the YYYYMMDDHHmmss_ filename format
-- that Supabase CLI recognises. If you see this comment on page_blocks
-- in production, the GitHub Actions → Supabase pipeline is working.
--
-- Idempotent: COMMENT ON is always safe to re-run.

COMMENT ON TABLE page_blocks IS
  'Editable content blocks for CMS sections. Auto-deploy via GitHub Actions enabled 2026-06-08.';
