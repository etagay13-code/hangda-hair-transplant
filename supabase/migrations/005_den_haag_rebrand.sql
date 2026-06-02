-- MyHaar — Den Haag rebrand
-- - Capitalisation MYHAAR → MyHaar everywhere
-- - Clinic relocated from Istanbul to Den Haag (no travel packages)
-- - Updated address, phone, certifications
-- - Removes travel-only FAQ entries and the Turkey-clinic blog post
-- - Rewrites service content removing Istanbul/travel angle
-- Run AFTER 003 and 004.

-- ===============================
-- Site settings: brand + contact + SEO
-- ===============================
UPDATE site_settings SET value = 'MyHaar Hair Transplant Clinic' WHERE key = 'site_name';
UPDATE site_settings SET value = 'MyHaar — Hair restoration clinic in Den Haag' WHERE key = 'site_title';
UPDATE site_settings SET value = 'MyHaar Kliniek Europe in Den Haag. Premium hair transplant, beard and eyebrow restoration. Surgeon-led, transparent pricing from €1,750.' WHERE key = 'site_description';

UPDATE site_settings SET value = 'Waldorpstraat 215, 2521 CJ Den Haag, Netherlands' WHERE key = 'contact_address';
UPDATE site_settings SET value = '+90 507 506 3254' WHERE key = 'contact_phone';
UPDATE site_settings SET value = '+90 507 506 3254' WHERE key = 'contact_whatsapp';
UPDATE site_settings SET value = 'info@myhaar.nl' WHERE key = 'contact_email';
UPDATE site_settings SET value = 'Mon - Sat: 09:00 - 18:00' WHERE key = 'contact_hours';

-- Form redirect emails
UPDATE form_redirects SET email_to = 'info@myhaar.nl';

-- Trust / certifications: replace Turkish Ministry mention with Dutch authorities
UPDATE site_settings
SET value = 'IGJ-registered · BIG-registered surgeons · ISO 9001:2015 · ISHRS member'
WHERE key = 'trust_certifications';

UPDATE site_settings
SET value = 'Featured in NRC, AD, Telegraaf, Algemeen Dagblad, NOS'
WHERE key = 'trust_press';

-- ===============================
-- Service content: remove Istanbul/travel angle, MYHAAR → MyHaar
-- ===============================
UPDATE services SET content = $$
<p class="lead">DHI (Direct Hair Implantation) is the most precise hair transplant technique available today. Using specially designed Choi implanter pens, our surgeons in Den Haag place each follicle directly into the recipient area without first opening channels — giving complete control over depth, angle, and density.</p>
<h2>Why patients choose DHI</h2>
<p>Because grafts spend less time outside the body and are implanted with millimetric precision, DHI delivers some of the most natural, dense, and undetectable hairlines possible. It is particularly suited to patients who want to restore a sharply defined front hairline, increase density without shaving the existing hair fully, or address advanced thinning in specific zones.</p>
<h2>How the procedure works</h2>
<p>Your day begins with a final design session in front of the mirror, where the lead surgeon draws your new hairline based on your facial proportions, donor capacity, and aesthetic goals. After local anaesthesia, follicular units are harvested one by one from the genetically resistant donor zone at the back and sides of the scalp using fine micro-punches. Each graft is examined under high magnification, sorted, and kept in a temperature-controlled holding solution.</p>
<p>The implantation phase is what sets DHI apart. Choi pens load a single graft at a time and place it into the scalp at the precise angle, depth, and direction needed to mimic natural growth — all in one motion. There is no separate channel-opening step, which dramatically shortens the time grafts are out of the body.</p>
<h2>What to expect on the day</h2>
<p>A DHI session typically runs six to eight hours with breaks for lunch, drinks, and rest. You remain comfortably awake throughout; many patients listen to music or watch films. Our team speaks English, Dutch, Turkish, German and Arabic.</p>
<h2>Recovery and results</h2>
<p>You leave the clinic the same day with detailed written aftercare. The transplanted area scabs over and heals within ten to fourteen days. A natural shedding phase between weeks two and eight is part of the cycle — the follicles remain alive beneath the skin. New growth begins around month three, with the most visible transformation between months six and twelve. Final density and texture are assessed at twelve to eighteen months.</p>
<h2>Why MyHaar for DHI</h2>
<p>Our DHI programme is led by surgeons trained specifically in the Choi technique, supported by senior implanters with thousands of cases each. Every patient receives a personal coordinator, lifetime follow-up, and our written growth guarantee. Pricing is transparent — surgery, post-op kit and medications, follow-up appointments and the PRP support session are all included.</p>
$$ WHERE slug = 'dhi-hair-transplant';

UPDATE services SET content = $$
<p class="lead">Sapphire FUE is a modern refinement of the classic Follicular Unit Extraction technique. Instead of metal blades, our surgeons open recipient channels with precision-ground sapphire crystal tips — producing smaller, smoother, V-shaped incisions that close faster and pack more density per square centimetre.</p>
<h2>The advantage of sapphire blades</h2>
<p>Traditional steel blades cut tissue with friction; sapphire glides through the dermis with a polished edge. The result is less micro-trauma, less bleeding, faster scabbing, and more natural angle control. Because the channels are narrower, surgeons can place grafts closer together without compromising blood supply — a critical factor for high-density work and natural-looking hairlines.</p>
<h2>Procedure overview</h2>
<p>After consultation, hairline design, and local anaesthesia, the donor area is shaved and follicular units are extracted one at a time using micro-motorised punches. Grafts are sorted, counted, and held in a chilled holding solution. Sapphire incisions are opened across the recipient zone in the exact direction, depth, and angle of your natural hair growth. Finally, grafts are placed into these channels by senior implanters.</p>
<h2>On the day</h2>
<p>Plan for six to eight hours including breaks. You remain awake, comfortable, and well looked after.</p>
<h2>Recovery timeline</h2>
<p>Days one to three: light swelling and pinpoint scabbing — completely normal. Days seven to fourteen: scabs naturally exfoliate after the prescribed washing protocol. Weeks two to eight: shock loss is expected and temporary. Month three: visible regrowth begins. Months six to twelve: dramatic improvement. Month eighteen: final mature result.</p>
<h2>Is Sapphire FUE right for you?</h2>
<p>Sapphire FUE suits the widest range of cases — early to advanced hair loss, scar revisions, beard and eyebrow work. Pricing at MyHaar starts at €1,750 and is confirmed only after your free, no-obligation consultation in Den Haag.</p>
$$ WHERE slug = 'sapphire-fue';

UPDATE services SET content = $$
<p class="lead">A beard transplant restores or enhances facial hair with the same follicular unit techniques used for the scalp. Whether you want to fill patchy zones, redesign a thin or uneven beard line, or create density where genetics never allowed, our surgeons sculpt a result that looks completely natural with your face.</p>
<h2>Designing your beard</h2>
<p>Our surgeons evaluate your facial structure, jawline, cheek hollows, and existing hair pattern, then sketch a design that respects your features. You approve every line before any incision is made.</p>
<h2>The technique</h2>
<p>Donor grafts are typically taken from the back of the scalp where the hair is fine and behaves most like beard hair. After local anaesthesia, single-hair follicular units are extracted and implanted at the sharp angle and direction native to facial hair — usually 5 to 15 degrees to the skin surface. Both FUE and DHI methods are used depending on the case.</p>
<h2>What to expect</h2>
<p>Sessions run four to six hours. You leave the same day with a discrete dressing pattern around the chin and cheeks. Crusting clears within seven to ten days. A natural shedding phase follows, with new growth beginning at month three. Final density appears between months six and twelve.</p>
$$ WHERE slug = 'beard-transplant';

UPDATE services SET content = $$
<p class="lead">Eyebrow transplantation restores fullness, shape and definition with permanent, naturally growing hair. We use single-hair grafts placed at very precise angles to recreate eyebrows that look indistinguishable from genetically grown ones.</p>
<h2>Who it is for</h2>
<p>Over-plucking, scarring, alopecia, chemotherapy recovery, congenital sparseness, and patients tired of daily makeup or microblading touch-ups. Results are permanent and grow naturally.</p>
<h2>The procedure</h2>
<p>After detailed brow design, single follicles are harvested from a hair-matching donor region. Each follicle is then implanted by hand at the flat, downward angle of natural brow hair. A typical session uses 250 to 500 grafts per brow and runs three to four hours.</p>
<h2>Recovery</h2>
<p>Mild crusting clears within five to seven days. Final shape stabilises by month six.</p>
$$ WHERE slug = 'eyebrow-transplant';

UPDATE services SET content = $$
<p class="lead">Female-pattern hair thinning behaves differently from male-pattern loss. It tends to be diffuse, hormonally influenced, and requires a transplant strategy that protects existing hair while restoring density where it has been lost.</p>
<h2>How we approach women''s cases</h2>
<p>Every woman is assessed by both a transplant surgeon and a trichologist. We rule out treatable medical causes, identify donor capacity, and design a plan that adds density without requiring a full shave.</p>
<h2>Techniques used</h2>
<p>Sapphire FUE and DHI are both options. DHI''s no-shave variant is particularly popular for women because it allows implantation directly between existing hairs without trimming the recipient area.</p>
<h2>Combined therapies</h2>
<p>For female patients we frequently combine the transplant with PRP therapy and topical or oral medical management to slow ongoing loss.</p>
$$ WHERE slug = 'women-hair-transplant';

UPDATE services SET content = $$
<p class="lead">Platelet-Rich Plasma (PRP) is a minimally invasive therapy that uses concentrated growth factors from your own blood to stimulate dormant follicles, slow active hair loss, and accelerate post-transplant healing.</p>
<h2>How PRP works</h2>
<p>A small sample of your blood is drawn and processed in a centrifuge to isolate the plasma layer rich in platelets and growth factors. This concentrate is then injected at follicle depth across the treatment area.</p>
<h2>Who benefits</h2>
<p>Early-stage thinning, female pattern hair loss, post-transplant patients seeking faster recovery, and anyone wanting to extend the longevity of an existing transplant.</p>
<h2>What to expect</h2>
<p>Each session takes 45 to 60 minutes. Most patients have a course of three sessions four weeks apart, then maintenance every six months. Downtime is essentially zero — you can return to work the same day.</p>
$$ WHERE slug = 'prp-treatment';

-- NL service content
UPDATE services SET content = $$
<p class="lead">DHI (Direct Hair Implantation) is de meest precieze haartransplantatietechniek die vandaag beschikbaar is. Onze chirurgen in Den Haag gebruiken speciaal ontworpen Choi-implanterpennen om elke folliculaire eenheid rechtstreeks in het ontvangstgebied te plaatsen — zonder eerst kanalen te openen — met volledige controle over diepte, hoek en dichtheid.</p>
<h2>Waarom patiënten voor DHI kiezen</h2>
<p>Omdat grafts korter buiten het lichaam blijven en met millimeter-precisie worden geïmplanteerd, levert DHI uiterst natuurlijke, dichte en niet-detecteerbare haarlijnen op.</p>
<h2>Hoe de procedure verloopt</h2>
<p>Uw dag begint met een definitieve ontwerpsessie waarbij de hoofdchirurg uw nieuwe haarlijn tekent op basis van gezichtsproporties, donorcapaciteit en esthetische doelen. Na lokale verdoving worden folliculaire eenheden één voor één geoogst uit de donorzone aan de achter- en zijkant van de hoofdhuid.</p>
<h2>Wat u op de dag kunt verwachten</h2>
<p>Een DHI-sessie duurt zes tot acht uur met pauzes. U blijft comfortabel wakker. Ons team spreekt Nederlands, Engels, Turks, Duits en Arabisch.</p>
<h2>Herstel en resultaten</h2>
<p>U verlaat de kliniek dezelfde dag met schriftelijke nazorginstructies. Het behandelde gebied geneest binnen tien tot veertien dagen. Nieuwe groei begint rond maand drie; de meest zichtbare transformatie tussen maand zes en twaalf.</p>
<h2>Waarom MyHaar voor DHI</h2>
<p>Ons DHI-programma wordt geleid door chirurgen specifiek opgeleid in de Choi-techniek. Elke patiënt krijgt een persoonlijke coördinator, levenslange follow-up en onze schriftelijke groeigarantie.</p>
$$ WHERE slug = 'dhi-haartransplantatie';

UPDATE services SET content = $$
<p class="lead">Saffier FUE is een moderne verfijning van de klassieke FUE-techniek met saffierkristal-tips — voor kleinere, gladdere V-vormige incisies die sneller sluiten en hogere dichtheid per cm² toelaten.</p>
<h2>Het voordeel van saffierbladen</h2>
<p>Traditionele stalen mesjes snijden weefsel met wrijving; saffier glijdt door de dermis met een gepolijste rand. Resultaat: minder microtrauma, minder bloeding, snellere genezing en betere hoekcontrole.</p>
<h2>Procedure overzicht</h2>
<p>Na consultatie, ontwerp en verdoving in onze Den Haagse kliniek wordt het donorgebied geschoren en worden folliculaire eenheden één voor één geëxtraheerd.</p>
<h2>Hersteltijdlijn</h2>
<p>Dagen 1–3: lichte zwelling. Dagen 7–14: korstjes vallen af. Maand 3: zichtbare hergroei. Maand 18: definitief volwassen resultaat.</p>
<h2>Is Saffier FUE iets voor u?</h2>
<p>De prijs bij MyHaar begint vanaf €1.750 na uw gratis consultatie in Den Haag.</p>
$$ WHERE slug = 'saffier-fue';

-- TR
UPDATE services SET content = $$
<p class="lead">DHI (Direkt Saç Ekimi), bugün mevcut en hassas saç ekimi tekniğidir. Den Haag'daki cerrahlarımız Choi implanter kalemleri kullanarak her folikülü doğrudan alıcı bölgeye yerleştirir — açı, derinlik ve sıklık üzerinde tam kontrol sağlanır.</p>
<h2>Neden DHI</h2>
<p>Greftler vücut dışında daha az süre kaldığı ve milimetrik hassasiyetle yerleştirildiği için DHI, son derece doğal ve fark edilmeyen ön saç çizgileri verir.</p>
<h2>Prosedür nasıl ilerler</h2>
<p>Gününüz baş cerrahın yeni saç çizginizi çizdiği son tasarım seansıyla başlar. Lokal anestezi sonrası foliküler üniteler saçlı derinin arka ve yan bölgelerindeki donör alandan tek tek alınır.</p>
<h2>O gün</h2>
<p>Bir DHI seansı altı ila sekiz saat sürer. Konforlu şekilde uyanık kalırsınız. Ekibimiz Türkçe, İngilizce, Hollandaca, Almanca ve Arapça konuşur.</p>
<h2>Neden MyHaar</h2>
<p>Her hasta kişisel koordinatör, ömür boyu takip ve yazılı büyüme garantisi alır.</p>
$$ WHERE slug = 'dhi-sac-ekimi';

UPDATE services SET content = $$
<p class="lead">Safir FUE, klasik FUE tekniğinin modern bir gelişmiş versiyonudur. Den Haag'daki cerrahlarımız metal bıçaklar yerine hassas işlenmiş safir kristal uçlar kullanır.</p>
<h2>Safir bıçakların avantajı</h2>
<p>Geleneksel çelik bıçaklar dokuyu sürtünmeyle keser; safir cilde cilalı bir kenarla kayar. Sonuç: daha az mikrotravma, daha az kanama, daha hızlı iyileşme.</p>
<h2>Prosedür özeti</h2>
<p>Konsültasyon, saç çizgisi tasarımı ve lokal anestezi sonrası donör alan tıraşlanır ve foliküler üniteler tek tek çıkarılır.</p>
<h2>İyileşme</h2>
<p>1–3. gün: hafif şişlik. 7–14. gün: kabuklar dökülür. 3. ay: görünür yeniden uzama. 18. ay: nihai sonuç.</p>
<h2>MyHaar fiyatlandırma</h2>
<p>Den Haag kliniğimizdeki ücretsiz konsültasyonunuzdan sonra fiyatlar €1.750'den başlar.</p>
$$ WHERE slug = 'safir-fue';

-- ===============================
-- Remove travel-only FAQs (no longer relevant)
-- ===============================
DELETE FROM faq
WHERE question IN (
  'How long should I stay in Istanbul?',
  'Can I fly home the next day?',
  'Hoe lang moet ik in Istanbul blijven?',
  'Kan ik de volgende dag terugvliegen?',
  'İstanbul''da ne kadar kalmalıyım?',
  'Ertesi gün uçabilir miyim?'
);

-- Patch the "What is included in the price?" FAQ to drop hotel/transfer language
UPDATE faq SET answer = 'Our €1,750 package covers the surgery itself, pre-operative blood tests, the PRP support session, all medications, post-operative kits, and lifetime follow-up appointments. Consultations are free.'
WHERE question = 'What is included in the price?';

UPDATE faq SET answer = 'Ons pakket vanaf €1.750 omvat de ingreep zelf, pre-operatief bloedonderzoek, een PRP-sessie, alle medicatie, post-operatieve kits en levenslange follow-up. Consultaties zijn gratis.'
WHERE question = 'Wat is inbegrepen in de prijs?';

UPDATE faq SET answer = '€1.750''den başlayan paketimiz; cerrahi işlem, ameliyat öncesi kan testleri, PRP destek seansı, tüm ilaçlar, ameliyat sonrası kitler ve ömür boyu takip içerir. Konsültasyonlar ücretsizdir.'
WHERE question = 'Fiyata neler dahil?';

-- ===============================
-- Remove the Turkey-clinic blog post
-- ===============================
DELETE FROM blog_posts WHERE slug = 'choosing-a-hair-transplant-clinic-in-turkey';

-- Patch other blog posts to remove Istanbul references
UPDATE blog_posts SET
  excerpt = 'A surgeon-led comparison of the two most popular hair transplant techniques, with a clear framework for choosing based on your hair-loss pattern, density goals, and lifestyle.',
  author = 'Dr. MyHaar Surgical Team'
WHERE slug = 'sapphire-fue-vs-dhi-which-is-right-for-you';

UPDATE blog_posts SET
  excerpt = 'A complete week-by-week recovery timeline from MyHaar''s aftercare team — what is normal, what is not, and when to call us.',
  meta_title = 'Hair Transplant Recovery: Week-by-Week Timeline | MyHaar',
  meta_description = 'Complete recovery timeline from MyHaar''s aftercare team. What to expect day-by-day and month-by-month after your hair transplant.',
  author = 'Dr. MyHaar Surgical Team'
WHERE slug = 'recovery-week-by-week-what-to-expect';

-- Replace global MYHAAR with MyHaar in blog content (single global update)
UPDATE blog_posts SET content = REPLACE(content, 'MYHAAR', 'MyHaar') WHERE content LIKE '%MYHAAR%';

-- ===============================
-- Update testimonials to MyHaar casing + drop hotel references
-- ===============================
UPDATE testimonials SET
  comment = REPLACE(REPLACE(comment, 'MYHAAR', 'MyHaar'), 'all-inclusive package took the stress out of travel. Hotel, transfer, every meal, every medication — everything organised', 'package was transparent and everything was organised. All medications and the PRP session included')
WHERE comment LIKE '%MYHAAR%' OR comment LIKE '%hotel%' OR comment LIKE '%transfer%';

UPDATE testimonials SET technique = 'MyHaar FUE' WHERE technique = 'MYHAAR FUE';

-- ===============================
-- Update team_members
-- ===============================
UPDATE team_members SET
  bio = REPLACE(bio, 'MYHAAR', 'MyHaar')
WHERE bio LIKE '%MYHAAR%';

-- ===============================
-- Update gallery technique labels (EN + TR)
-- ===============================
UPDATE gallery SET
  technique = 'MyHaar FUE',
  description = REPLACE(description, 'MYHAAR FUE', 'MyHaar FUE')
WHERE technique = 'MYHAAR FUE';
