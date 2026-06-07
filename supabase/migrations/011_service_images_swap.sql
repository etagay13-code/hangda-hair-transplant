-- 011: Use the freshly downloaded service photos so every treatment card
-- has a distinct, relevant image. Photos were pulled from
-- https://www.hairofistanbul.com/ and saved locally under
-- /public/services/hoi/ — the clinic itself is still in Den Haag, NL;
-- the assets are only used for visual reference until the editor uploads
-- MyHaar's own photography via /admin/services.

UPDATE services SET image_url = '/services/hoi/dhi.webp'
  WHERE slug IN ('dhi-hair-transplant', 'dhi-haartransplantatie', 'dhi-sac-ekimi');

UPDATE services SET image_url = '/services/hoi/fue.jpg'
  WHERE slug IN ('sapphire-fue', 'saffier-fue', 'safir-fue');

UPDATE services SET image_url = '/services/hoi/beard.jpg'
  WHERE slug IN ('beard-transplant', 'baardtransplantatie', 'sakal-ekimi');

UPDATE services SET image_url = '/services/hoi/eyebrow.jpg'
  WHERE slug IN ('eyebrow-transplant', 'wenkbrauwtransplantatie', 'kas-ekimi');

UPDATE services SET image_url = '/services/hoi/women.jpg'
  WHERE slug IN ('women-hair-transplant', 'haartransplantatie-vrouwen', 'kadinlarda-sac-ekimi');

UPDATE services SET image_url = '/services/hoi/prp.webp'
  WHERE slug IN ('prp-treatment', 'prp-behandeling', 'prp-tedavisi');
