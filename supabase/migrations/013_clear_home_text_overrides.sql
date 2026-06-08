-- One-time cleanup: clear any text field overrides on the home page_blocks
-- that were created accidentally when the edit form pre-filled English copy.
-- After this migration, the public site falls back to the translation files,
-- and the new smart-save logic in actions.ts prevents the same drift in the
-- future. Image/CTA-href/extra/order fields are left intact.

UPDATE page_blocks
SET eyebrow = NULL,
    title = NULL,
    subtitle = NULL,
    body = NULL,
    cta_label = NULL,
    updated_at = NOW()
WHERE page_key = 'home';

-- Also reset the about-page text overrides for the same reason.
UPDATE page_blocks
SET eyebrow = NULL,
    title = NULL,
    subtitle = NULL,
    body = NULL,
    cta_label = NULL,
    updated_at = NOW()
WHERE page_key = 'about';
