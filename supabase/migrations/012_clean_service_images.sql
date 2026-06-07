-- 012: Replace the watermarked Hair of Istanbul photos (migration 011) with
-- clean, logo-free Unsplash stock photos saved locally under
-- /public/services/stock/. The clinic is still in Den Haag — these are just
-- relevant placeholder visuals until MyHaar's own clinical photography goes
-- in via /admin/services.
--
-- Run AFTER 011_service_images_swap.sql.

UPDATE services SET image_url = '/services/stock/dhi.jpg'
  WHERE slug IN ('dhi-hair-transplant', 'dhi-haartransplantatie', 'dhi-sac-ekimi');

UPDATE services SET image_url = '/services/stock/fue.jpg'
  WHERE slug IN ('sapphire-fue', 'saffier-fue', 'safir-fue');

UPDATE services SET image_url = '/services/stock/beard.jpg'
  WHERE slug IN ('beard-transplant', 'baardtransplantatie', 'sakal-ekimi');

UPDATE services SET image_url = '/services/stock/eyebrow.jpg'
  WHERE slug IN ('eyebrow-transplant', 'wenkbrauwtransplantatie', 'kas-ekimi');

UPDATE services SET image_url = '/services/stock/women.jpg'
  WHERE slug IN ('women-hair-transplant', 'haartransplantatie-vrouwen', 'kadinlarda-sac-ekimi');

UPDATE services SET image_url = '/services/stock/prp.jpg'
  WHERE slug IN ('prp-treatment', 'prp-behandeling', 'prp-tedavisi');
