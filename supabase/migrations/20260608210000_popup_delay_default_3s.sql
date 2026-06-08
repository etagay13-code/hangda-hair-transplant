-- Lower the popup delay default from 6s → 3s.
-- Only updates the row if the current value is the previous default (6)
-- — preserves admin-customised values.
UPDATE site_settings
SET value = '3'
WHERE key = 'popup_delay_seconds'
  AND locale = 'all'
  AND value = '6';
