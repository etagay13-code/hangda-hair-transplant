-- Hang Da Hair Transplant - Seed Data
-- Defaults for site_settings, form_redirects, services, FAQ, page_seo

-- ===============================
-- Site Settings (general, contact, social, tracking)
-- ===============================
INSERT INTO site_settings (key, value, locale, category) VALUES
  ('site_name', 'Hang Da Hair Transplant', 'all', 'general'),
  ('site_title', 'Hang Da Hair Transplant - Premium Hair Restoration', 'all', 'general'),
  ('site_description', 'World-class hair transplant clinic with proven results. Trusted by thousands of patients worldwide.', 'all', 'general'),
  ('default_og_image', '', 'all', 'general'),
  ('logo_url', '', 'all', 'general'),
  ('favicon_url', '', 'all', 'general'),

  ('contact_phone', '+90 555 000 0000', 'all', 'contact'),
  ('contact_whatsapp', '+90 555 000 0000', 'all', 'contact'),
  ('contact_email', 'info@hangda-hair.com', 'all', 'contact'),
  ('contact_address', 'Istanbul, Turkey', 'all', 'contact'),
  ('contact_hours', 'Mon - Sat: 09:00 - 19:00', 'all', 'contact'),

  ('social_instagram', 'https://instagram.com/hangda', 'all', 'social'),
  ('social_facebook', 'https://facebook.com/hangda', 'all', 'social'),
  ('social_youtube', 'https://youtube.com/@hangda', 'all', 'social'),
  ('social_tiktok', 'https://tiktok.com/@hangda', 'all', 'social'),
  ('social_x', 'https://x.com/hangda', 'all', 'social'),

  ('ga_measurement_id', '', 'all', 'tracking'),
  ('gtm_id', '', 'all', 'tracking'),
  ('meta_pixel_id', '', 'all', 'tracking'),
  ('google_site_verification', '', 'all', 'tracking'),
  ('tiktok_pixel_id', '', 'all', 'tracking')
ON CONFLICT (key, locale) DO NOTHING;

-- ===============================
-- Form Redirects
-- ===============================
INSERT INTO form_redirects (form_name, success_url, email_to, is_active) VALUES
  ('contact', '/thank-you', 'info@hangda-hair.com', true),
  ('consultation', '/thank-you', 'info@hangda-hair.com', true),
  ('quote', '/thank-you', 'info@hangda-hair.com', true),
  ('callback', '/thank-you', 'info@hangda-hair.com', true),
  ('newsletter', '/thank-you', 'info@hangda-hair.com', true)
ON CONFLICT (form_name) DO NOTHING;

-- ===============================
-- Services (EN)
-- ===============================
INSERT INTO services (slug, title, short_description, description, icon, price_from, duration, locale, order_index, is_active, meta_title, meta_description) VALUES
  ('dhi-hair-transplant', 'DHI Hair Transplant', 'Direct Hair Implantation with Choi pens for precision.', 'DHI (Direct Hair Implantation) places follicles directly into the recipient area using Choi implanter pens, offering unmatched control over angle, depth, and density.', 'sparkles', 2500, '6-8 hours', 'en', 1, true, 'DHI Hair Transplant | Hang Da', 'Precision DHI hair transplant using Choi pens for natural, dense results.'),
  ('sapphire-fue', 'Sapphire FUE', 'Modern FUE technique using sapphire blades for finer incisions.', 'Sapphire FUE uses precision sapphire-tipped blades to create smaller, smoother channels, improving healing and increasing density per square cm.', 'gem', 2000, '6-8 hours', 'en', 2, true, 'Sapphire FUE Hair Transplant | Hang Da', 'Sapphire FUE for faster healing, denser results, and natural hairlines.'),
  ('beard-transplant', 'Beard Transplant', 'Restore and design a full, even beard.', 'Beard transplantation uses FUE or DHI to fill patchy areas or design a denser, sculpted beard line tailored to facial structure.', 'scissors', 1800, '4-6 hours', 'en', 3, true, 'Beard Transplant | Hang Da', 'Full, natural beard transplant tailored to your facial structure.'),
  ('eyebrow-transplant', 'Eyebrow Transplant', 'Permanent, natural-looking eyebrow restoration.', 'Eyebrow transplant uses single-hair grafts placed at precise angles to recreate a full, expressive brow that grows permanently.', 'eye', 1500, '3-4 hours', 'en', 4, true, 'Eyebrow Transplant | Hang Da', 'Restore your eyebrows naturally and permanently with precision grafting.'),
  ('women-hair-transplant', 'Women''s Hair Transplant', 'Restoration tailored for female hair loss patterns.', 'Specialized hair transplant techniques adapted to female hair loss, density requirements, and aesthetic goals.', 'heart', 2200, '6-8 hours', 'en', 5, true, 'Women''s Hair Transplant | Hang Da', 'Hair transplant techniques tailored to women''s hair loss patterns.'),
  ('prp-treatment', 'PRP Hair Treatment', 'Platelet-rich plasma therapy to strengthen and grow hair.', 'PRP treatment uses your own concentrated growth factors to stimulate dormant follicles, slow loss, and accelerate post-op results.', 'droplet', 250, '45-60 minutes', 'en', 6, true, 'PRP Hair Treatment | Hang Da', 'Strengthen and regrow hair with PRP therapy, alone or alongside a transplant.')
ON CONFLICT (slug, locale) DO NOTHING;

-- ===============================
-- Services (NL)
-- ===============================
INSERT INTO services (slug, title, short_description, description, icon, price_from, duration, locale, order_index, is_active) VALUES
  ('dhi-haartransplantatie', 'DHI Haartransplantatie', 'Direct Hair Implantation met Choi-pennen voor precisie.', 'DHI (Direct Hair Implantation) plaatst follikels direct in het ontvangstgebied met Choi-pennen, voor maximale controle over hoek, diepte en dichtheid.', 'sparkles', 2500, '6-8 uur', 'nl', 1, true),
  ('saffier-fue', 'Saffier FUE', 'Moderne FUE-techniek met saffierbladen voor fijnere incisies.', 'Saffier FUE gebruikt saffieren bladen om kleinere, gladdere kanalen te maken, met sneller herstel en hogere dichtheid per cm².', 'gem', 2000, '6-8 uur', 'nl', 2, true),
  ('baardtransplantatie', 'Baardtransplantatie', 'Herstel een volle, gelijkmatige baard.', 'Baardtransplantatie gebruikt FUE of DHI om kale plekken op te vullen of een dichte, vormgegeven baardlijn te ontwerpen.', 'scissors', 1800, '4-6 uur', 'nl', 3, true),
  ('wenkbrauwtransplantatie', 'Wenkbrauwtransplantatie', 'Permanente, natuurlijke wenkbrauwen.', 'Wenkbrauwtransplantatie gebruikt enkele follikels in precieze hoeken voor volle, expressieve wenkbrauwen die permanent groeien.', 'eye', 1500, '3-4 uur', 'nl', 4, true),
  ('haartransplantatie-vrouwen', 'Haartransplantatie voor Vrouwen', 'Restauratie afgestemd op haaruitvalpatronen bij vrouwen.', 'Gespecialiseerde technieken voor haartransplantatie aangepast aan vrouwelijke haaruitval en esthetische doelen.', 'heart', 2200, '6-8 uur', 'nl', 5, true),
  ('prp-behandeling', 'PRP Haarbehandeling', 'Plaatjesrijke plasma-therapie om haar te versterken.', 'PRP gebruikt uw eigen geconcentreerde groeifactoren om slapende follikels te stimuleren en haarverlies te vertragen.', 'droplet', 250, '45-60 min', 'nl', 6, true)
ON CONFLICT (slug, locale) DO NOTHING;

-- ===============================
-- Services (TR)
-- ===============================
INSERT INTO services (slug, title, short_description, description, icon, price_from, duration, locale, order_index, is_active) VALUES
  ('dhi-sac-ekimi', 'DHI Saç Ekimi', 'Choi kalemleriyle hassas Direkt Saç Ekimi.', 'DHI (Direkt Saç Ekimi), Choi implanter kalemleri ile foliküllerin doğrudan alıcı bölgeye yerleştirilmesini sağlar; açı, derinlik ve sıklık tam kontrol altındadır.', 'sparkles', 2500, '6-8 saat', 'tr', 1, true),
  ('safir-fue', 'Safir FUE', 'Daha ince kanallar için safir uçlu modern FUE tekniği.', 'Safir FUE, safir uçlu bıçaklarla daha küçük ve düzgün kanallar açar; iyileşmeyi hızlandırır ve cm² başına yoğunluğu artırır.', 'gem', 2000, '6-8 saat', 'tr', 2, true),
  ('sakal-ekimi', 'Sakal Ekimi', 'Dolu, dengeli bir sakal için ekim.', 'Sakal ekimi FUE veya DHI ile seyrek alanları doldurur ya da yüz hatlarınıza uygun dolgun bir sakal hattı tasarlar.', 'scissors', 1800, '4-6 saat', 'tr', 3, true),
  ('kas-ekimi', 'Kaş Ekimi', 'Doğal ve kalıcı kaş restorasyonu.', 'Kaş ekimi tek tel greftleri belirli açılarla yerleştirir ve kalıcı olarak uzayan dolgun, ifadeli kaşlar oluşturur.', 'eye', 1500, '3-4 saat', 'tr', 4, true),
  ('kadinlarda-sac-ekimi', 'Kadınlarda Saç Ekimi', 'Kadınlara özel saç dökülme paternleri için.', 'Kadın saç dökülmesine, sıklık ihtiyaçlarına ve estetik hedeflerine uyarlanmış özel saç ekimi teknikleri.', 'heart', 2200, '6-8 saat', 'tr', 5, true),
  ('prp-tedavisi', 'PRP Saç Tedavisi', 'Saçı güçlendirmek için trombositten zengin plazma.', 'PRP, kendi yoğunlaştırılmış büyüme faktörlerinizi kullanarak uykudaki folikülleri uyandırır ve operasyon sonrası sonuçları hızlandırır.', 'droplet', 250, '45-60 dk', 'tr', 6, true)
ON CONFLICT (slug, locale) DO NOTHING;

-- ===============================
-- FAQ (EN)
-- ===============================
INSERT INTO faq (question, answer, category, locale, order_index, is_active) VALUES
  ('How long does a hair transplant take?', 'Most procedures take between 6 and 8 hours depending on the number of grafts and the chosen technique.', 'general', 'en', 1, true),
  ('Is the procedure painful?', 'The procedure is performed under local anesthesia. Most patients describe it as comfortable, with only mild discomfort during the anesthetic injections.', 'general', 'en', 2, true),
  ('When will I see results?', 'Initial growth typically starts around month 3 to 4. Full results appear at 12 to 18 months after the procedure.', 'results', 'en', 3, true),
  ('Are the results permanent?', 'Yes. Transplanted follicles are taken from genetically resistant zones and continue to grow permanently in their new location.', 'results', 'en', 4, true),
  ('How soon can I return to work?', 'Most patients return to work within 3 to 5 days. Strenuous activity should be avoided for two weeks.', 'recovery', 'en', 5, true)
ON CONFLICT DO NOTHING;

-- ===============================
-- FAQ (NL)
-- ===============================
INSERT INTO faq (question, answer, category, locale, order_index, is_active) VALUES
  ('Hoe lang duurt een haartransplantatie?', 'De meeste procedures duren 6 tot 8 uur, afhankelijk van het aantal grafts en de techniek.', 'general', 'nl', 1, true),
  ('Is de procedure pijnlijk?', 'De ingreep wordt uitgevoerd onder lokale verdoving. De meeste patiënten ervaren alleen lichte ongemak bij de verdovingsinjecties.', 'general', 'nl', 2, true),
  ('Wanneer zie ik resultaten?', 'De eerste groei begint meestal rond maand 3 tot 4. De volledige resultaten zijn zichtbaar na 12 tot 18 maanden.', 'results', 'nl', 3, true),
  ('Zijn de resultaten permanent?', 'Ja. Getransplanteerde follikels komen uit genetisch resistente zones en groeien permanent verder op hun nieuwe locatie.', 'results', 'nl', 4, true),
  ('Wanneer kan ik weer aan het werk?', 'De meeste patiënten gaan binnen 3 tot 5 dagen weer aan het werk. Zware inspanning wordt twee weken afgeraden.', 'recovery', 'nl', 5, true)
ON CONFLICT DO NOTHING;

-- ===============================
-- FAQ (TR)
-- ===============================
INSERT INTO faq (question, answer, category, locale, order_index, is_active) VALUES
  ('Saç ekimi ne kadar sürer?', 'Greft sayısı ve seçilen tekniğe bağlı olarak çoğu işlem 6 ila 8 saat sürer.', 'general', 'tr', 1, true),
  ('İşlem ağrılı mı?', 'İşlem lokal anestezi altında yapılır. Çoğu hasta yalnızca anestezi enjeksiyonlarında hafif rahatsızlık tarif eder.', 'general', 'tr', 2, true),
  ('Sonuçları ne zaman görürüm?', 'İlk uzama genelde 3-4. ayda başlar. Tam sonuçlar 12-18 ay arasında ortaya çıkar.', 'results', 'tr', 3, true),
  ('Sonuçlar kalıcı mı?', 'Evet. Nakledilen foliküller genetik olarak dirençli bölgelerden alınır ve yeni yerinde kalıcı olarak uzar.', 'results', 'tr', 4, true),
  ('İşe ne zaman dönebilirim?', 'Çoğu hasta 3-5 gün içinde işine döner. Ağır aktiviteler iki hafta boyunca önerilmez.', 'recovery', 'tr', 5, true)
ON CONFLICT DO NOTHING;

-- ===============================
-- Page SEO defaults
-- ===============================
INSERT INTO page_seo (page_key, locale, title, description, keywords) VALUES
  ('home', 'en', 'Hang Da Hair Transplant - Premium Hair Restoration', 'World-class hair transplant clinic. DHI, Sapphire FUE, beard and eyebrow restoration. Free consultation.', 'hair transplant, DHI, sapphire FUE, hair restoration, Turkey'),
  ('home', 'nl', 'Hang Da Haartransplantatie - Premium Haarherstel', 'Hoogwaardige haartransplantatiekliniek. DHI, saffier FUE, baard- en wenkbrauwherstel. Gratis consult.', 'haartransplantatie, DHI, saffier FUE, haarherstel, Turkije'),
  ('home', 'tr', 'Hang Da Saç Ekimi - Premium Saç Restorasyonu', 'Dünya standardında saç ekim kliniği. DHI, Safir FUE, sakal ve kaş ekimi. Ücretsiz konsültasyon.', 'saç ekimi, DHI, safir FUE, saç restorasyonu, Türkiye'),

  ('about', 'en', 'About Hang Da Hair Transplant', 'Meet the team and discover the philosophy behind Hang Da Hair Transplant.', 'about hang da, hair clinic, team'),
  ('about', 'nl', 'Over Hang Da Haartransplantatie', 'Ontmoet het team en ontdek de filosofie achter Hang Da.', 'over hang da, haarkliniek, team'),
  ('about', 'tr', 'Hang Da Hakkında', 'Ekibimizle tanışın ve Hang Da Saç Ekimi felsefesini keşfedin.', 'hang da hakkında, saç kliniği, ekip'),

  ('services', 'en', 'Our Hair Transplant Services', 'Explore DHI, Sapphire FUE, beard, eyebrow, women''s hair transplant and PRP.', 'hair transplant services, DHI, FUE, beard, eyebrow, PRP'),
  ('services', 'nl', 'Onze Haartransplantatiediensten', 'Ontdek DHI, saffier FUE, baard, wenkbrauw, vrouwen-haartransplantatie en PRP.', 'haartransplantatie diensten, DHI, FUE, baard, wenkbrauw, PRP'),
  ('services', 'tr', 'Saç Ekim Hizmetlerimiz', 'DHI, Safir FUE, sakal, kaş, kadın saç ekimi ve PRP hizmetlerimizi keşfedin.', 'saç ekimi hizmetleri, DHI, FUE, sakal, kaş, PRP'),

  ('gallery', 'en', 'Before & After Gallery', 'Real patient results from our DHI, FUE and other procedures.', 'hair transplant results, before after'),
  ('gallery', 'nl', 'Voor & Na Galerij', 'Echte patiëntresultaten van onze DHI, FUE en andere procedures.', 'haartransplantatie resultaten, voor na'),
  ('gallery', 'tr', 'Öncesi & Sonrası Galeri', 'DHI, FUE ve diğer prosedürlerimizden gerçek hasta sonuçları.', 'saç ekimi sonuçları, öncesi sonrası'),

  ('blog', 'en', 'Hair Restoration Blog', 'Insights, tips and patient stories about hair restoration.', 'hair transplant blog, hair care'),
  ('blog', 'nl', 'Haarherstel Blog', 'Inzichten, tips en patiëntverhalen over haarherstel.', 'haartransplantatie blog, haarverzorging'),
  ('blog', 'tr', 'Saç Restorasyon Blogu', 'Saç restorasyonu hakkında bilgiler, ipuçları ve hasta hikayeleri.', 'saç ekimi bloğu, saç bakımı'),

  ('faq', 'en', 'Hair Transplant FAQ', 'Answers to common questions about hair transplantation.', 'hair transplant faq, questions'),
  ('faq', 'nl', 'Haartransplantatie FAQ', 'Antwoorden op veelgestelde vragen.', 'haartransplantatie faq, vragen'),
  ('faq', 'tr', 'Saç Ekimi SSS', 'Saç ekimi hakkında sıkça sorulan sorular.', 'saç ekimi sss, sorular'),

  ('contact', 'en', 'Contact Us', 'Get in touch for a free consultation.', 'contact hang da, free consultation'),
  ('contact', 'nl', 'Neem Contact Op', 'Neem contact op voor een gratis consult.', 'contact hang da, gratis consult'),
  ('contact', 'tr', 'İletişim', 'Ücretsiz konsültasyon için bize ulaşın.', 'iletişim hang da, ücretsiz konsültasyon')
ON CONFLICT (page_key, locale) DO NOTHING;
