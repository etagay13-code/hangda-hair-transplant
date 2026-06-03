-- Distinct hero image per service. Previously DHI and Women's HT shared the same
-- /services/about-hair-transplant.jpg and Sapphire FUE shared its image with the
-- homepage Hero.
-- Run after migrations 003, 004, 005.

-- DHI keeps the clinical hero photo
UPDATE services SET image_url = '/services/about-hair-transplant.jpg'
  WHERE slug IN ('dhi-hair-transplant', 'dhi-haartransplantatie', 'dhi-sac-ekimi');

-- Sapphire FUE now uses a surgical close-up from Unsplash (no longer duplicating Hero)
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1582719188393-bb71ca45dbb9?auto=format&fit=crop&w=900&q=80'
  WHERE slug IN ('sapphire-fue', 'saffier-fue', 'safir-fue');

-- Beard / Eyebrow keep their dedicated photos
UPDATE services SET image_url = '/services/beard-transplant.jpg'
  WHERE slug IN ('beard-transplant', 'baardtransplantatie', 'sakal-ekimi');

UPDATE services SET image_url = '/services/eyebrow-transplant.jpg'
  WHERE slug IN ('eyebrow-transplant', 'wenkbrauwtransplantatie', 'kas-ekimi');

-- Women's HT now uses an Unsplash women's-care photo (no longer duplicating DHI)
UPDATE services SET image_url = 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=900&q=80'
  WHERE slug IN ('women-hair-transplant', 'haartransplantatie-vrouwen', 'kadinlarda-sac-ekimi');

-- PRP keeps its dedicated photo
UPDATE services SET image_url = '/services/prp.jpg'
  WHERE slug IN ('prp-treatment', 'prp-behandeling', 'prp-tedavisi');
