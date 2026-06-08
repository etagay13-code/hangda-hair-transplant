-- Remove the "Before & After" / "Voor & Na" / "Öncesi & Sonrası" entries
-- from the primary nav across all locales. The /gallery page itself stays
-- live (still linked from cards/CTAs); we just hide the top-nav link.

UPDATE nav_items
SET is_active = false
WHERE group_key = 'primary'
  AND href = '/gallery';
