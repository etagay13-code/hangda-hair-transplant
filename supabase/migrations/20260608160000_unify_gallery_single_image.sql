-- Cases are stored as a single composite image (before+after baked into one
-- file). Earlier the form wrote the same composite to BOTH before_image_url
-- and after_image_url, causing every card to render two side-by-side copies
-- of the same image. Going forward only before_image_url is set; this
-- migration cleans up existing rows so they render correctly without an
-- admin edit.

UPDATE gallery
SET after_image_url = NULL,
    before_image_url = COALESCE(before_image_url, after_image_url)
WHERE after_image_url IS NOT NULL;
