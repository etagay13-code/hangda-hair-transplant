-- MYHAAR rebrand + real gallery seed + service hero images + blog seed
-- Run AFTER 003_content_expansion.sql

-- ===============================
-- Brand identity (site_settings)
-- ===============================
UPDATE site_settings SET value = 'MYHAAR Hair Transplant Clinic' WHERE key = 'site_name';
UPDATE site_settings SET value = 'MYHAAR — World-class hair restoration in Istanbul' WHERE key = 'site_title';
UPDATE site_settings SET value = 'MYHAAR Clinic Europe. Premium hair transplant, beard and eyebrow restoration in Istanbul. JCI-accredited, surgeon-led, all-inclusive packages from €1,750.' WHERE key = 'site_description';
UPDATE site_settings SET value = '/brand/myhaar-logo.png' WHERE key = 'logo_url';
UPDATE site_settings SET value = 'info@myhaar.com' WHERE key = 'contact_email';
UPDATE site_settings SET value = 'https://instagram.com/myhaarkliniekeurope' WHERE key = 'social_instagram';
UPDATE site_settings SET value = 'https://facebook.com/myhaar' WHERE key = 'social_facebook';
UPDATE site_settings SET value = 'https://youtube.com/@myhaar' WHERE key = 'social_youtube';
UPDATE site_settings SET value = 'https://tiktok.com/@myhaar' WHERE key = 'social_tiktok';
UPDATE site_settings SET value = 'https://x.com/myhaar' WHERE key = 'social_x';

-- New brand keys
INSERT INTO site_settings (key, value, locale, category) VALUES
  ('brand_tagline_en', 'A new lifeline for your hair', 'all', 'general'),
  ('brand_tagline_nl', 'Een nieuw begin voor uw haar', 'all', 'general'),
  ('brand_tagline_tr', 'Saçınız için yeni bir başlangıç', 'all', 'general'),
  ('form_redirects_email', 'info@myhaar.com', 'all', 'contact')
ON CONFLICT (key, locale) DO NOTHING;

-- Form redirects email update
UPDATE form_redirects SET email_to = 'info@myhaar.com';

-- ===============================
-- Service hero images
-- ===============================
UPDATE services SET image_url = '/services/about-hair-transplant.jpg'
  WHERE slug IN ('dhi-hair-transplant', 'dhi-haartransplantatie', 'dhi-sac-ekimi');

UPDATE services SET image_url = '/gallery/result-3400-sapphire-fue.jpg'
  WHERE slug IN ('sapphire-fue', 'saffier-fue', 'safir-fue');

UPDATE services SET image_url = '/services/beard-transplant.jpg'
  WHERE slug IN ('beard-transplant', 'baardtransplantatie', 'sakal-ekimi');

UPDATE services SET image_url = '/services/eyebrow-transplant.jpg'
  WHERE slug IN ('eyebrow-transplant', 'wenkbrauwtransplantatie', 'kas-ekimi');

UPDATE services SET image_url = '/services/about-hair-transplant.jpg'
  WHERE slug IN ('women-hair-transplant', 'haartransplantatie-vrouwen', 'kadinlarda-sac-ekimi');

UPDATE services SET image_url = '/services/prp.jpg'
  WHERE slug IN ('prp-treatment', 'prp-behandeling', 'prp-tedavisi');

-- ===============================
-- Gallery seed (real results)
-- ===============================
INSERT INTO gallery (patient_code, category, technique, grafts, months_after, before_image_url, after_image_url, description, locale, is_active, order_index) VALUES
  ('MH-0024', 'hair', 'Sapphire FUE', 3400, 12, '/gallery/result-3400-sapphire-fue.jpg', '/gallery/result-3400-sapphire-fue.jpg', '3,400 grafts Sapphire FUE. Recreated the frontal hairline and crown density for a male patient with Norwood IV pattern.', 'en', true, 1),
  ('MH-0025', 'hair', 'MYHAAR FUE', 3800, 14, '/gallery/result-3800-myhaar-fue.jpg', '/gallery/result-3800-myhaar-fue.jpg', '3,800 grafts MYHAAR FUE on a 58-year-old patient. Restored a natural hairline with age-appropriate density.', 'en', true, 2),
  ('MH-0026', 'hair', 'Sapphire FUE', 3500, 12, '/gallery/result-3500-sapphire-fue.jpg', '/gallery/result-3500-sapphire-fue.jpg', '3,500 grafts Sapphire FUE. Coverage of the temples and crown for a salt-and-pepper patient.', 'en', true, 3),
  ('MH-0027', 'hair', 'Sapphire FUE', 3000, 10, '/gallery/result-3000-sapphire-fue.jpg', '/gallery/result-3000-sapphire-fue.jpg', '3,000 grafts Sapphire FUE. Frontal restoration with a soft, natural irregular hairline.', 'en', true, 4),
  ('MH-0028', 'hair', 'DHI', NULL, 9, '/gallery/result-dhi-frontline.jpg', '/gallery/result-dhi-frontline.jpg', 'DHI front-line restoration. Direct implantation with Choi pens produced natural angles and density.', 'en', true, 5),
  ('MH-0029', 'hair', 'DHI', NULL, 8, '/gallery/result-natural-density.jpg', '/gallery/result-natural-density.jpg', 'DHI session focused on temple and front zone density — natural look in under one year.', 'en', true, 6),
  ('MH-0030', 'hair', 'Sapphire FUE', NULL, 6, '/gallery/result-thumbs-up.jpg', '/gallery/result-thumbs-up.jpg', 'Happy patient at 6-month follow-up. Sapphire FUE on the crown region.', 'en', true, 7)
ON CONFLICT DO NOTHING;

-- NL gallery (duplicated meta)
INSERT INTO gallery (patient_code, category, technique, grafts, months_after, before_image_url, after_image_url, description, locale, is_active, order_index) VALUES
  ('MH-0024', 'hair', 'Sapphire FUE', 3400, 12, '/gallery/result-3400-sapphire-fue.jpg', '/gallery/result-3400-sapphire-fue.jpg', '3.400 grafts Sapphire FUE. Voorste haarlijn en kroondichtheid hersteld bij een Norwood IV patiënt.', 'nl', true, 1),
  ('MH-0025', 'hair', 'MYHAAR FUE', 3800, 14, '/gallery/result-3800-myhaar-fue.jpg', '/gallery/result-3800-myhaar-fue.jpg', '3.800 grafts MYHAAR FUE bij een 58-jarige patiënt. Natuurlijke haarlijn passend bij zijn leeftijd.', 'nl', true, 2),
  ('MH-0026', 'hair', 'Sapphire FUE', 3500, 12, '/gallery/result-3500-sapphire-fue.jpg', '/gallery/result-3500-sapphire-fue.jpg', '3.500 grafts Sapphire FUE. Dekking van slapen en kruin bij salt-and-pepper patiënt.', 'nl', true, 3),
  ('MH-0027', 'hair', 'Sapphire FUE', 3000, 10, '/gallery/result-3000-sapphire-fue.jpg', '/gallery/result-3000-sapphire-fue.jpg', '3.000 grafts Sapphire FUE. Voorhoofdsherstel met zachte, natuurlijke onregelmatige haarlijn.', 'nl', true, 4),
  ('MH-0028', 'hair', 'DHI', NULL, 9, '/gallery/result-dhi-frontline.jpg', '/gallery/result-dhi-frontline.jpg', 'DHI voorste haarlijn herstel. Directe implantatie met Choi-pennen voor natuurlijke hoeken en dichtheid.', 'nl', true, 5),
  ('MH-0029', 'hair', 'DHI', NULL, 8, '/gallery/result-natural-density.jpg', '/gallery/result-natural-density.jpg', 'DHI sessie gericht op slapen en voorhoofdsdichtheid — natuurlijk resultaat in minder dan een jaar.', 'nl', true, 6),
  ('MH-0030', 'hair', 'Sapphire FUE', NULL, 6, '/gallery/result-thumbs-up.jpg', '/gallery/result-thumbs-up.jpg', 'Tevreden patiënt bij 6 maanden follow-up. Sapphire FUE op kruinregio.', 'nl', true, 7)
ON CONFLICT DO NOTHING;

-- TR gallery
INSERT INTO gallery (patient_code, category, technique, grafts, months_after, before_image_url, after_image_url, description, locale, is_active, order_index) VALUES
  ('MH-0024', 'hair', 'Safir FUE', 3400, 12, '/gallery/result-3400-sapphire-fue.jpg', '/gallery/result-3400-sapphire-fue.jpg', '3.400 greft Safir FUE. Norwood IV paterndeki bir erkek hastada ön saç çizgisi ve tepe yoğunluğu yeniden oluşturuldu.', 'tr', true, 1),
  ('MH-0025', 'hair', 'MYHAAR FUE', 3800, 14, '/gallery/result-3800-myhaar-fue.jpg', '/gallery/result-3800-myhaar-fue.jpg', '3.800 greft MYHAAR FUE — 58 yaşındaki hastada yaşına uygun doğal saç çizgisi.', 'tr', true, 2),
  ('MH-0026', 'hair', 'Safir FUE', 3500, 12, '/gallery/result-3500-sapphire-fue.jpg', '/gallery/result-3500-sapphire-fue.jpg', '3.500 greft Safir FUE. Şakaklarda ve tepe bölgesinde kapsama.', 'tr', true, 3),
  ('MH-0027', 'hair', 'Safir FUE', 3000, 10, '/gallery/result-3000-sapphire-fue.jpg', '/gallery/result-3000-sapphire-fue.jpg', '3.000 greft Safir FUE. Yumuşak, doğal düzensiz saç çizgisiyle ön restorasyon.', 'tr', true, 4),
  ('MH-0028', 'hair', 'DHI', NULL, 9, '/gallery/result-dhi-frontline.jpg', '/gallery/result-dhi-frontline.jpg', 'DHI ön saç çizgisi restorasyonu. Choi kalemleri ile doğal açı ve yoğunluk.', 'tr', true, 5),
  ('MH-0029', 'hair', 'DHI', NULL, 8, '/gallery/result-natural-density.jpg', '/gallery/result-natural-density.jpg', 'DHI seansı şakak ve ön bölge yoğunluğuna odaklı — bir yıldan kısa sürede doğal görünüm.', 'tr', true, 6),
  ('MH-0030', 'hair', 'Safir FUE', NULL, 6, '/gallery/result-thumbs-up.jpg', '/gallery/result-thumbs-up.jpg', '6. ay kontrolünde memnun hasta. Tepe bölgesine Safir FUE.', 'tr', true, 7)
ON CONFLICT DO NOTHING;

-- ===============================
-- Testimonials seed (EN/NL/TR)
-- ===============================
INSERT INTO testimonials (name, country, rating, comment, technique, grafts, locale, is_active, is_featured) VALUES
  ('Mark V.', 'Netherlands', 5, 'I researched clinics for over a year before deciding on MYHAAR. The coordinator answered every question honestly, and the surgeon spent 30 minutes designing my hairline before we started. Twelve months later the result is exactly what they showed me on day one. Worth every euro.', 'Sapphire FUE', 3400, 'en', true, true),
  ('James O.', 'United Kingdom', 5, 'Forty-eight years old and tired of disappearing hair. The team at MYHAAR set realistic expectations — they were honest that I needed a conservative design at my age, and the result looks like me ten years younger, not a wig. Lifetime follow-up is real; my coordinator still checks in.', 'MYHAAR FUE', 3800, 'en', true, true),
  ('Daniel R.', 'Germany', 5, 'The all-inclusive package took the stress out of travel. Hotel, transfer, every meal, every medication — everything organised. The surgeon performed the channel opening himself; I watched on the monitor.', 'Sapphire FUE', 3000, 'en', true, false),
  ('Mark V.', 'Nederland', 5, 'Ik onderzocht klinieken meer dan een jaar voordat ik voor MYHAAR koos. De coördinator beantwoordde elke vraag eerlijk, en de chirurg besteedde 30 minuten aan het ontwerpen van mijn haarlijn voordat we begonnen. Twaalf maanden later is het resultaat precies wat ze me op dag één hadden laten zien.', 'Sapphire FUE', 3400, 'nl', true, true),
  ('James O.', 'Verenigd Koninkrijk', 5, 'Achtenveertig jaar oud en de moe van verdwijnend haar. Het team bij MYHAAR stelde realistische verwachtingen — ze waren eerlijk dat ik een conservatief ontwerp nodig had op mijn leeftijd, en het resultaat ziet er uit als ik tien jaar jonger, geen pruik.', 'MYHAAR FUE', 3800, 'nl', true, true),
  ('Daniel R.', 'Duitsland', 5, 'Het all-inclusive pakket nam de stress weg. Hotel, transfer, elke maaltijd, elke medicatie — alles georganiseerd. De chirurg opende de kanalen zelf; ik volgde het op de monitor.', 'Sapphire FUE', 3000, 'nl', true, false),
  ('Mark V.', 'Hollanda', 5, 'MYHAAR''ı seçmeden önce bir yıldan fazla klinik araştırdım. Koordinatör her soruyu dürüstçe yanıtladı ve cerrah başlamadan önce saç çizgimi tasarlamak için 30 dakika harcadı. On iki ay sonra sonuç tam olarak bana ilk gün gösterdikleri gibi.', 'Safir FUE', 3400, 'tr', true, true),
  ('James O.', 'Birleşik Krallık', 5, 'Kırk sekiz yaşında ve kaybolan saçlardan bıkmıştım. MYHAAR ekibi gerçekçi beklentiler belirledi — yaşımda muhafazakar bir tasarım gerektiğini açıkça söylediler. Sonuç bir peruk değil, 10 yaş genç haliydi.', 'MYHAAR FUE', 3800, 'tr', true, true),
  ('Daniel R.', 'Almanya', 5, 'Her şey dahil paket seyahat stresini ortadan kaldırdı. Otel, transfer, her öğün, her ilaç organize edilmişti. Cerrah kanal açma işlemini bizzat yaptı; monitörden izledim.', 'Safir FUE', 3000, 'tr', true, false)
ON CONFLICT DO NOTHING;

-- ===============================
-- Blog seed (EN — translated stubs for NL/TR can be added later)
-- ===============================
INSERT INTO blog_posts (slug, title, excerpt, content, cover_image_url, author, category, tags, locale, is_published, published_at, meta_title, meta_description) VALUES
  (
    'sapphire-fue-vs-dhi-which-is-right-for-you',
    'Sapphire FUE vs DHI: which technique is right for you?',
    'A surgeon-led comparison of the two most popular hair transplant techniques, with a clear framework for choosing based on your hair-loss pattern, density goals, and lifestyle.',
    '<p class="lead">Choosing between Sapphire FUE and DHI is one of the first questions every patient asks. The honest answer is that both techniques can deliver outstanding results in the right hands — the difference lies in what they optimise for.</p>
<h2>The core difference</h2>
<p>In Sapphire FUE, your surgeon opens channels in the recipient area first using sapphire blades, then implants grafts into those channels. In DHI, the channel-opening and implantation happen in one motion using Choi implanter pens. Both techniques use the same harvested follicles; the difference is purely in the implantation step.</p>
<h2>When Sapphire FUE wins</h2>
<p>Sapphire FUE is the more versatile workhorse. It allows for very high density per square centimetre, is well suited to large sessions (3,500+ grafts), and is the standard for scar revisions, beard work, and patients with curly or coarse hair. The smaller, V-shaped sapphire incisions heal faster than steel-blade FUE channels.</p>
<h2>When DHI wins</h2>
<p>DHI is the precision tool of choice for very fine work — front hairline reconstruction, eyebrow restoration, and no-shave procedures for women. Because grafts spend less time outside the body, survival rates are excellent. The trade-off is that DHI sessions are slightly slower and typically cap at 3,000–3,500 grafts per day.</p>
<h2>A surgeon-led recommendation</h2>
<p>For most patients with Norwood III–V loss, MYHAAR''s preferred default is Sapphire FUE for the body of the work, with a DHI finish on the front-most row of the hairline. This combination plays to each technique''s strength. Your consultation will include a personalised recommendation based on your donor mapping, hair characteristics, and design goals.</p>
<h2>What does not actually change between techniques</h2>
<p>The surgeon''s experience, the implanter team''s skill, the design of your hairline, donor-area harvesting accuracy, and post-op care matter more than the technique label. A poorly designed DHI hairline will look worse than a beautifully designed Sapphire FUE hairline, every time.</p>',
    '/services/about-hair-transplant.jpg',
    'Dr. MYHAAR Surgical Team',
    'Techniques',
    ARRAY['DHI', 'Sapphire FUE', 'technique', 'comparison'],
    'en',
    true,
    now() - interval '14 days',
    'Sapphire FUE vs DHI Hair Transplant — Which Is Best?',
    'Surgeon-led comparison of Sapphire FUE vs DHI hair transplant techniques. Learn which is right for your hair loss pattern.'
  ),
  (
    'recovery-week-by-week-what-to-expect',
    'Recovery week by week: what to expect after a hair transplant',
    'A complete week-by-week recovery timeline from MYHAAR''s aftercare team — what is normal, what is not, and when to call us.',
    '<p class="lead">Hair transplant recovery is straightforward but not invisible. Here is exactly what to expect at each stage so you can plan your time off work, travel, and personal events with confidence.</p>
<h2>Days 0–3: immediately after surgery</h2>
<p>Mild swelling around the forehead and temples is normal and peaks at day three. We provide an anti-swelling protocol including a headband and a recommended sleeping position. Pinpoint scabbing forms at every transplanted graft site. Avoid touching, scratching, or applying any product not provided in your aftercare kit.</p>
<h2>Days 4–10: scab phase</h2>
<p>On day four you will start a specific washing protocol: a gentle foam shampoo applied without rubbing, rinsed with low-pressure lukewarm water. Scabs naturally exfoliate over the following week. By day ten the scalp is largely smooth and most patients return to social settings comfortably.</p>
<h2>Weeks 2–8: shock loss</h2>
<p>This is the phase that surprises patients. Between weeks two and eight, most of the transplanted hairs shed temporarily. This is not failure — the follicles remain alive beneath the skin and are entering a dormant phase before regrowth. The shedding is uniform and expected.</p>
<h2>Months 3–6: the regrowth begins</h2>
<p>New growth starts to push through around month three. Initially fine and unpigmented, the new hairs thicken and darken over the next several months. By month six you should see clear visible improvement in coverage.</p>
<h2>Months 6–12: dramatic transformation</h2>
<p>Most of the visible transformation happens between months six and twelve. Density continues to build, the hairline matures, and the transplanted hair starts to behave like your native hair.</p>
<h2>Months 12–18: final maturation</h2>
<p>The remaining 10–20% of density refinement happens between months twelve and eighteen. This is when we assess the final result. Our 18-month written growth guarantee covers this entire period.</p>',
    '/services/about-hair-transplant.jpg',
    'Dr. MYHAAR Surgical Team',
    'Aftercare',
    ARRAY['recovery', 'aftercare', 'timeline'],
    'en',
    true,
    now() - interval '7 days',
    'Hair Transplant Recovery: Week-by-Week Timeline | MYHAAR',
    'Complete recovery timeline from MYHAAR''s aftercare team. What to expect day-by-day and month-by-month after your hair transplant.'
  ),
  (
    'choosing-a-hair-transplant-clinic-in-turkey',
    'How to choose a hair transplant clinic in Turkey (without getting burned)',
    'Istanbul has hundreds of hair transplant clinics. Here is the framework MYHAAR''s surgeons use to evaluate quality — and the red flags that should send you running.',
    '<p class="lead">Hair transplantation in Turkey is a legitimate, world-leading industry. It is also home to factory-style clinics that operate on volume and damage real patients. This guide separates the two.</p>
<h2>Who actually performs your surgery</h2>
<p>In every responsible clinic, surgeons perform the critical steps: hairline design, donor mapping, and channel opening. Technicians may assist with extraction and implantation under surgeon supervision. Walk away from any clinic where you cannot meet the surgeon before booking or where the surgeon is not present on the day.</p>
<h2>The all-inclusive trap and how to read it</h2>
<p>Be specific about what is included. Ask: does the price cover hotel? Transfers? PRP support session? Post-op medication? Aftercare follow-ups? A real all-inclusive package is itemised on paper. A suspicious one is a flat number with no detail.</p>
<h2>Red flags</h2>
<ul>
<li>Guaranteed graft numbers given over WhatsApp without seeing photos</li>
<li>Pressure to book immediately for a "discount"</li>
<li>No written growth guarantee</li>
<li>Stock before/after photos that appear on multiple clinic sites</li>
<li>No JCI accreditation, no ISHRS membership, no health-ministry license number visible</li>
</ul>
<h2>Green flags</h2>
<ul>
<li>Surgeon-led free consultation before any booking</li>
<li>Real patient testimonials with full names and faces</li>
<li>Transparent fixed pricing per technique</li>
<li>Written 18-month growth guarantee</li>
<li>Follow-up schedule built into your package</li>
</ul>
<h2>The MYHAAR standard</h2>
<p>Our surgeons cap the number of cases per day so that each procedure receives senior attention from start to finish. Every patient meets the lead surgeon in person on the day of surgery. Every quote is itemised, valid for 30 days, and binding.</p>',
    '/services/about-hair-transplant.jpg',
    'Dr. MYHAAR Surgical Team',
    'Guides',
    ARRAY['clinic selection', 'Turkey', 'guide', 'safety'],
    'en',
    true,
    now() - interval '21 days',
    'How to Choose a Hair Transplant Clinic in Turkey — Honest Guide',
    'Surgeon-led guide to choosing a safe hair transplant clinic in Istanbul. Red flags, green flags, and what real all-inclusive pricing looks like.'
  )
ON CONFLICT (slug, locale) DO NOTHING;

-- ===============================
-- Team seed (minimal placeholders — replace with real photos via admin)
-- ===============================
INSERT INTO team_members (name, title, bio, specialization, locale, order_index, is_active) VALUES
  ('Dr. M. Yilmaz', 'Lead Hair Restoration Surgeon', 'Over 18 years of hair restoration practice. Pioneer of MYHAAR''s combined Sapphire FUE + DHI hairline protocol. ISHRS member.', 'Sapphire FUE · DHI · Female-pattern restoration', 'en', 1, true),
  ('Dr. A. Demir', 'Senior Surgeon', '12+ years performing FUE and DHI procedures. Specialises in advanced Norwood cases and revision surgery.', 'Advanced cases · Revisions · Beard & eyebrow', 'en', 2, true),
  ('Aylin K.', 'Lead Patient Coordinator', 'Speaks English, Dutch, Turkish, and German. Twelve years of coordinating international patients from first contact through lifetime follow-up.', 'International coordination · Aftercare', 'en', 3, true)
ON CONFLICT DO NOTHING;
