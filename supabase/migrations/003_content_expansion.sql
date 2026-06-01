-- Hang Da Hair Transplant
-- Migration 003: Pricing update, long-form service content, expanded FAQs, trust signals

-- ===============================
-- Pricing: 1750€ base for hair-transplant services
-- ===============================
UPDATE services SET price_from = 1750
WHERE slug IN (
  'dhi-hair-transplant', 'sapphire-fue', 'women-hair-transplant',
  'dhi-haartransplantatie', 'saffier-fue', 'haartransplantatie-vrouwen',
  'dhi-sac-ekimi', 'safir-fue', 'kadinlarda-sac-ekimi'
);

-- ===============================
-- Long-form service content (EN)
-- ===============================
UPDATE services SET content = $$
<p class="lead">DHI (Direct Hair Implantation) is the most precise hair transplant technique available today. Using specially designed Choi implanter pens, our surgeons place each individual follicle directly into the recipient area without first opening channels — giving complete control over depth, angle, and density.</p>
<h2>Why patients choose DHI</h2>
<p>Because grafts spend less time outside the body and are implanted with millimetric precision, DHI delivers some of the most natural, dense, and undetectable hairlines possible. It is particularly well suited to patients who want to restore a sharply defined front hairline, increase density without shaving the existing hair fully, or address advanced thinning in specific zones.</p>
<h2>How the procedure works</h2>
<p>Your day begins with a final design session in front of the mirror, where the lead surgeon draws your new hairline based on your facial proportions, donor capacity, and aesthetic goals. After local anesthesia, follicular units are harvested one by one from the genetically resistant donor zone at the back and sides of the scalp using fine micro-punches. Each graft is examined under high magnification, sorted by follicle count, and kept in a temperature-controlled holding solution.</p>
<p>The implantation phase is what sets DHI apart. Choi pens load a single graft at a time and place it into the scalp at the precise angle, depth, and direction needed to mimic natural growth — all in one motion. There is no separate channel-opening step, which dramatically shortens the time grafts are out of the body.</p>
<h2>What to expect on the day</h2>
<p>A DHI session typically runs six to eight hours with breaks for lunch, drinks, and rest. You remain comfortably awake throughout; many patients listen to music or watch films. Our coordinators speak English, Dutch, Turkish, Arabic and German, and check in regularly to make sure you are at ease.</p>
<h2>Recovery and results</h2>
<p>You will leave the clinic the same day with detailed written aftercare. The transplanted area scabs over and heals within ten to fourteen days. A natural shedding phase between weeks two and eight is part of the cycle — the follicles remain alive beneath the skin. New growth begins around month three, with the most visible transformation between months six and twelve. Final density and texture are assessed at twelve to eighteen months.</p>
<h2>Why Hang Da for DHI</h2>
<p>Our DHI program is led by surgeons trained specifically in the Choi technique, supported by senior implanters with thousands of cases each. Every patient receives a personal coordinator, lifetime follow-up, and our written growth guarantee. Pricing is transparent and all-inclusive: surgery, accommodation, transfers, medications, and post-op care.</p>
$$ WHERE slug = 'dhi-hair-transplant';

UPDATE services SET content = $$
<p class="lead">Sapphire FUE is a modern refinement of the classic Follicular Unit Extraction technique. Instead of metal blades, our surgeons open recipient channels with precision-ground sapphire crystal tips — producing smaller, smoother, V-shaped incisions that close faster and pack more density per square centimetre.</p>
<h2>The advantage of sapphire blades</h2>
<p>Traditional steel blades cut tissue with friction; sapphire glides through the dermis with a polished edge. The result is less micro-trauma, lower bleeding, faster scabbing, and more natural angle control. Because the channels are narrower, surgeons can place grafts closer together without compromising blood supply — a critical factor for high-density work and natural-looking hairlines.</p>
<h2>Procedure overview</h2>
<p>After consultation, hairline design, and local anesthesia, the donor area is shaved and follicular units are extracted one at a time using micro-motorized punches calibrated to your hair caliber. Grafts are sorted, counted, and held in a chilled holding solution. Sapphire incisions are then opened across the recipient zone in the exact direction, depth, and angle of your natural hair growth. Finally, grafts are placed into these channels by senior implanters.</p>
<h2>On the day</h2>
<p>Plan for six to eight hours including breaks. You remain awake, comfortable, and well looked after. You will receive lunch, drinks, post-op kits, and a printed timeline of your recovery. Your medical coordinator stays with you from arrival to airport transfer.</p>
<h2>Recovery timeline</h2>
<p>Days one to three: light swelling and pinpoint scabbing — completely normal. Days seven to fourteen: scabs naturally exfoliate after the prescribed washing protocol. Weeks two to eight: shock loss is expected and temporary. Month three: visible regrowth begins. Months six to twelve: dramatic improvement in density and coverage. Month eighteen: final mature result.</p>
<h2>Is Sapphire FUE right for you?</h2>
<p>Sapphire FUE suits the widest range of cases — early to advanced hair loss, scar revisions, beard and eyebrow work, and patients who prefer not to commit to the deeper recovery of larger sessions. Pricing at Hang Da starts at €1,750 all-inclusive and is confirmed only after your free, no-obligation consultation.</p>
$$ WHERE slug = 'sapphire-fue';

UPDATE services SET content = $$
<p class="lead">A beard transplant restores or enhances facial hair with the same follicular unit techniques used for the scalp. Whether you want to fill patchy zones, redesign a thin or uneven beard line, or create density where genetics never allowed, our surgeons sculpt a result that looks completely natural with your face.</p>
<h2>Designing your beard</h2>
<p>Beard design is as much art as science. Our surgeons evaluate your facial structure, jawline, cheek hollows, and existing hair pattern, then sketch a design that respects your features. You approve every line before any incision is made.</p>
<h2>The technique</h2>
<p>Donor grafts are typically taken from the back of the scalp where the hair is fine and behaves most like beard hair. After local anesthesia, single-hair follicular units are extracted and implanted at the sharp angle and direction native to facial hair — usually 5 to 15 degrees to the skin surface. Both FUE and DHI methods are used depending on the case.</p>
<h2>What to expect</h2>
<p>Sessions run four to six hours. You leave the same day with a discrete dressing pattern around the chin and cheeks. Crusting clears within seven to ten days. A natural shedding phase follows, with new growth beginning at month three. Final density appears between months six and twelve, after which you can shave or shape the beard like natural hair.</p>
<h2>Common requests</h2>
<p>Density along the jawline, restoration of a moustache, reconstruction over old scarring, full beard creation, sideburn extension, and goatee redesign. Each case is fully customised.</p>
$$ WHERE slug = 'beard-transplant';

UPDATE services SET content = $$
<p class="lead">Eyebrow transplantation restores fullness, shape and definition with permanent, naturally growing hair. We use single-hair grafts placed at very precise angles to recreate eyebrows that look indistinguishable from genetically grown ones — including direction, curve and texture.</p>
<h2>Who it is for</h2>
<p>Over-plucking, scarring, alopecia, chemotherapy recovery, congenital sparseness, and patients tired of daily makeup or microblading touch-ups. Results are permanent and grow naturally.</p>
<h2>The procedure</h2>
<p>After detailed brow design — including arch, peak, and tail placement — single follicles are harvested from a hair-matching donor region. Each follicle is then implanted by hand at the flat, downward angle of natural brow hair. A typical session uses 250 to 500 grafts per brow and runs three to four hours.</p>
<h2>Recovery</h2>
<p>Mild crusting clears within five to seven days. The transplanted hairs shed temporarily before regrowing from month two onwards. Because eyebrow hair originates from scalp donor follicles, light trimming will be part of your routine. Final shape stabilises by month six.</p>
$$ WHERE slug = 'eyebrow-transplant';

UPDATE services SET content = $$
<p class="lead">Female-pattern hair thinning behaves differently from male-pattern loss. It tends to be diffuse, hormonally influenced, and requires a transplant strategy that protects existing hair while restoring density where it has been lost — particularly around the part line, temples, and crown.</p>
<h2>How we approach women''s cases</h2>
<p>Every woman is assessed by both a transplant surgeon and a trichologist. We rule out treatable medical causes, identify donor capacity, and design a plan that adds density without requiring a full shave. Many of our female patients are operated on with only the donor strip shaved, which is then hidden beneath the surrounding hair.</p>
<h2>Techniques used</h2>
<p>Sapphire FUE and DHI are both options. DHI''s no-shave variant is particularly popular for women because it allows implantation directly between existing hairs without trimming the recipient area.</p>
<h2>Combined therapies</h2>
<p>For female patients we frequently combine the transplant with PRP therapy and topical or oral medical management to slow ongoing loss. Your medical coordinator builds a 12-month plan covering procedure, follow-up appointments, and adjunctive therapies.</p>
$$ WHERE slug = 'women-hair-transplant';

UPDATE services SET content = $$
<p class="lead">Platelet-Rich Plasma (PRP) is a minimally invasive therapy that uses concentrated growth factors from your own blood to stimulate dormant follicles, slow active hair loss, and accelerate post-transplant healing.</p>
<h2>How PRP works</h2>
<p>A small sample of your blood is drawn and processed in a centrifuge to isolate the plasma layer rich in platelets and growth factors. This concentrate is then injected at follicle depth across the treatment area. The growth factors signal nearby follicles to enter the active growth phase and improve local vascularisation.</p>
<h2>Who benefits</h2>
<p>Early-stage thinning, female pattern hair loss, post-transplant patients seeking faster recovery, and anyone wanting to extend the longevity of an existing transplant. PRP is not a substitute for a transplant once follicles are fully miniaturised, but it is the most effective non-surgical adjunct available.</p>
<h2>What to expect</h2>
<p>Each session takes 45 to 60 minutes. Most patients have a course of three sessions four weeks apart, then maintenance every six months. Downtime is essentially zero — you can return to work the same day.</p>
$$ WHERE slug = 'prp-treatment';

-- ===============================
-- Long-form service content (NL)
-- ===============================
UPDATE services SET content = $$
<p class="lead">DHI (Direct Hair Implantation) is de meest precieze haartransplantatietechniek die vandaag beschikbaar is. Met speciaal ontworpen Choi-implanterpennen plaatsen onze chirurgen elke folliculaire eenheid rechtstreeks in het ontvangstgebied — zonder eerst kanalen te openen — met volledige controle over diepte, hoek en dichtheid.</p>
<h2>Waarom patiënten voor DHI kiezen</h2>
<p>Omdat grafts korter buiten het lichaam blijven en met millimeter-precisie worden geïmplanteerd, levert DHI uiterst natuurlijke, dichte en niet-detecteerbare haarlijnen op. Bijzonder geschikt voor patiënten die een scherp gedefinieerde voorste haarlijn willen herstellen of dichtheid willen toevoegen zonder het bestaande haar volledig te scheren.</p>
<h2>Hoe de procedure verloopt</h2>
<p>Uw dag begint met een definitieve ontwerpsessie waarbij de hoofdchirurg uw nieuwe haarlijn tekent op basis van gezichtsproporties, donorcapaciteit en esthetische doelen. Na lokale verdoving worden folliculaire eenheden één voor één geoogst uit de donorzone aan de achter- en zijkant van de hoofdhuid. Elke graft wordt onder microscoop beoordeeld en in een gekoelde bewaaroplossing gehouden.</p>
<p>De implantatiefase maakt DHI uniek: Choi-pennen plaatsen één graft tegelijk in de hoofdhuid in precies de juiste hoek, diepte en richting — alles in één beweging.</p>
<h2>Wat u op de dag kunt verwachten</h2>
<p>Een DHI-sessie duurt zes tot acht uur met pauzes. U blijft comfortabel wakker. Onze coördinatoren spreken Nederlands, Engels, Turks, Arabisch en Duits.</p>
<h2>Herstel en resultaten</h2>
<p>U verlaat de kliniek dezelfde dag met schriftelijke nazorginstructies. Het behandelde gebied geneest binnen tien tot veertien dagen. Een natuurlijke uitvalfase tussen week twee en acht is onderdeel van de cyclus. Nieuwe groei begint rond maand drie; de meest zichtbare transformatie tussen maand zes en twaalf. Eindresultaat op twaalf tot achttien maanden.</p>
<h2>Waarom Hang Da voor DHI</h2>
<p>Ons DHI-programma wordt geleid door chirurgen specifiek opgeleid in de Choi-techniek, ondersteund door senior implanters met duizenden cases elk. Elke patiënt krijgt een persoonlijke coördinator, levenslange follow-up en onze schriftelijke groeigarantie. Prijzen zijn transparant en all-inclusive: ingreep, accommodatie, transfers, medicatie en nazorg.</p>
$$ WHERE slug = 'dhi-haartransplantatie';

UPDATE services SET content = $$
<p class="lead">Saffier FUE is een moderne verfijning van de klassieke FUE-techniek. In plaats van metalen mesjes openen onze chirurgen ontvangstkanalen met precisie-geslepen saffierkristal-tips — wat zorgt voor kleinere, gladdere V-vormige incisies die sneller sluiten en hogere dichtheid per cm² toelaten.</p>
<h2>Het voordeel van saffierbladen</h2>
<p>Traditionele stalen mesjes snijden weefsel met wrijving; saffier glijdt door de dermis met een gepolijste rand. Resultaat: minder microtrauma, minder bloeding, snellere genezing en betere hoekcontrole.</p>
<h2>Procedure overzicht</h2>
<p>Na consultatie, ontwerp en verdoving wordt het donorgebied geschoren en worden folliculaire eenheden één voor één geëxtraheerd. Saffier-incisies worden vervolgens geopend in de exacte richting van uw natuurlijke haargroei. Tot slot plaatsen senior implanters de grafts in deze kanalen.</p>
<h2>Op de dag</h2>
<p>Reken op zes tot acht uur inclusief pauzes. U blijft wakker, comfortabel en wordt goed verzorgd.</p>
<h2>Hersteltijdlijn</h2>
<p>Dagen 1–3: lichte zwelling. Dagen 7–14: korstjes vallen af. Weken 2–8: tijdelijke uitval. Maand 3: zichtbare hergroei. Maanden 6–12: dramatische verbetering. Maand 18: definitief volwassen resultaat.</p>
<h2>Is Saffier FUE iets voor u?</h2>
<p>Saffier FUE past bij het breedste scala aan cases. De prijs bij Hang Da begint vanaf €1.750 all-inclusive na uw gratis consultatie.</p>
$$ WHERE slug = 'saffier-fue';

UPDATE services SET content = $$
<p class="lead">Een baardtransplantatie herstelt of versterkt gezichtshaar met dezelfde folliculaire technieken die voor de hoofdhuid worden gebruikt. Of u nu kale plekken wilt opvullen of dichtheid wilt creëren waar de genetica dat nooit toeliet — onze chirurgen ontwerpen een resultaat dat volledig natuurlijk oogt.</p>
<h2>Uw baard ontwerpen</h2>
<p>Onze chirurgen evalueren uw gezichtsstructuur, kaaklijn en bestaande haarpatroon en schetsen vervolgens een ontwerp dat uw kenmerken respecteert. U keurt elke lijn goed voordat er een incisie wordt gemaakt.</p>
<h2>De techniek</h2>
<p>Donor-grafts worden meestal uit de achterkant van de hoofdhuid genomen. Na verdoving worden enkele-haar follikels geëxtraheerd en geïmplanteerd onder de scherpe hoek van gezichtshaar (5–15 graden).</p>
<h2>Wat u kunt verwachten</h2>
<p>Sessies duren vier tot zes uur. Korsten verdwijnen binnen zeven tot tien dagen. Nieuwe groei begint maand drie. Eindresultaat tussen maand zes en twaalf.</p>
$$ WHERE slug = 'baardtransplantatie';

UPDATE services SET content = $$
<p class="lead">Wenkbrauwtransplantatie herstelt volume, vorm en definitie met permanent, natuurlijk groeiend haar. We gebruiken enkele-haar grafts geplaatst onder zeer precieze hoeken om wenkbrauwen te creëren die niet te onderscheiden zijn van genetisch gegroeide.</p>
<h2>Voor wie</h2>
<p>Over-epileren, littekens, alopecia, herstel na chemotherapie, aangeboren dunne wenkbrauwen en patiënten die genoeg hebben van dagelijkse make-up of microblading-bijwerkingen.</p>
<h2>De procedure</h2>
<p>Na gedetailleerd brauwontwerp worden enkele follikels geoogst en met de hand geïmplanteerd onder de vlakke, neerwaartse hoek van natuurlijk brauwhaar. Een sessie gebruikt 250 tot 500 grafts per wenkbrauw en duurt drie tot vier uur.</p>
<h2>Herstel</h2>
<p>Korstjes verdwijnen binnen vijf tot zeven dagen. Definitieve vorm stabiliseert tegen maand zes.</p>
$$ WHERE slug = 'wenkbrauwtransplantatie';

UPDATE services SET content = $$
<p class="lead">Haaruitval bij vrouwen gedraagt zich anders dan bij mannen. Het is meestal diffuus, hormonaal beïnvloed en vereist een transplantatiestrategie die bestaand haar beschermt terwijl dichtheid wordt hersteld waar deze verloren is gegaan.</p>
<h2>Onze benadering</h2>
<p>Elke vrouw wordt beoordeeld door zowel een transplantatiechirurg als een trichologist. We sluiten behandelbare medische oorzaken uit, identificeren donorcapaciteit en ontwerpen een plan dat dichtheid toevoegt zonder volledig te hoeven scheren.</p>
<h2>Gebruikte technieken</h2>
<p>Saffier FUE en DHI zijn beide opties. De no-shave variant van DHI is bijzonder populair bij vrouwen.</p>
<h2>Gecombineerde therapieën</h2>
<p>Voor vrouwelijke patiënten combineren we de transplantatie vaak met PRP en topische of orale medische behandeling. Uw coördinator bouwt een 12-maandenplan.</p>
$$ WHERE slug = 'haartransplantatie-vrouwen';

UPDATE services SET content = $$
<p class="lead">Platelet-Rich Plasma (PRP) is een minimaal invasieve therapie die geconcentreerde groeifactoren uit uw eigen bloed gebruikt om slapende follikels te stimuleren, actieve haaruitval te vertragen en het herstel na transplantatie te versnellen.</p>
<h2>Hoe PRP werkt</h2>
<p>Een kleine bloedmonster wordt afgenomen en in een centrifuge verwerkt om de plasmalaag te isoleren die rijk is aan bloedplaatjes en groeifactoren. Dit concentraat wordt vervolgens op follikeldiepte in het behandelgebied geïnjecteerd.</p>
<h2>Wie heeft baat</h2>
<p>Vroege uitval, vrouwelijke haaruitval, post-transplantatie patiënten die sneller herstel zoeken, en iedereen die de levensduur van een bestaande transplantatie wil verlengen.</p>
<h2>Wat u kunt verwachten</h2>
<p>Elke sessie duurt 45 tot 60 minuten. Een kuur omvat meestal drie sessies met vier weken tussenruimte, vervolgens onderhoud elke zes maanden. Downtime is praktisch nul.</p>
$$ WHERE slug = 'prp-behandeling';

-- ===============================
-- Long-form service content (TR)
-- ===============================
UPDATE services SET content = $$
<p class="lead">DHI (Direkt Saç Ekimi), bugün mevcut en hassas saç ekimi tekniğidir. Özel olarak tasarlanmış Choi implanter kalemleri kullanan cerrahlarımız, her bir folikülü doğrudan alıcı bölgeye yerleştirir — önceden kanal açmadan — açı, derinlik ve sıklık üzerinde tam kontrol sağlanır.</p>
<h2>Hastaların DHI tercih etme nedenleri</h2>
<p>Greftler vücut dışında daha az süre kaldığı ve milimetrik hassasiyetle yerleştirildiği için DHI, son derece doğal, sık ve fark edilmeyen ön saç çizgileri verir. Özellikle keskin tanımlı bir ön saç çizgisi yeniden oluşturmak veya mevcut saçı tamamen tıraş etmeden sıklık eklemek isteyen hastalar için uygundur.</p>
<h2>Prosedür nasıl ilerler</h2>
<p>Gününüz, baş cerrahın yüz oranlarınıza, donör kapasitenize ve estetik hedeflerinize göre yeni saç çizginizi çizdiği son tasarım seansıyla başlar. Lokal anestezi sonrası foliküler üniteler saçlı derinin arka ve yan bölgelerindeki donör alandan tek tek alınır. Her greft mikroskop altında değerlendirilir ve soğutulmuş bekletme solüsyonunda tutulur.</p>
<p>İmplantasyon fazı DHI'yı özel kılar: Choi kalemleri tek seferde bir greft yükler ve doğal büyümeyi taklit eden tam açı, derinlik ve yönde saç derisine yerleştirir — tek hareketle.</p>
<h2>O gün ne bekleyebilirsiniz</h2>
<p>Bir DHI seansı genellikle altı ila sekiz saat sürer, aralar dahildir. Konforlu şekilde uyanık kalırsınız. Koordinatörlerimiz Türkçe, İngilizce, Hollandaca, Arapça ve Almanca konuşur.</p>
<h2>İyileşme ve sonuçlar</h2>
<p>Kliniğden aynı gün ayrılırsınız. Bölge on ila on dört gün içinde iyileşir. İki ila sekiz hafta arasındaki doğal dökülme fazı sürecin bir parçasıdır. Yeni uzama üçüncü ay civarı başlar; en görünür dönüşüm altıncı ile on ikinci aylar arasında olur. Nihai yoğunluk on iki ila on sekiz ayda değerlendirilir.</p>
<h2>Neden Hang Da DHI</h2>
<p>DHI programımız özellikle Choi tekniğinde eğitilmiş cerrahlar tarafından yönetilir. Her hasta kişisel koordinatör, ömür boyu takip ve yazılı büyüme garantisi alır. Fiyatlar şeffaf ve her şey dahildir.</p>
$$ WHERE slug = 'dhi-sac-ekimi';

UPDATE services SET content = $$
<p class="lead">Safir FUE, klasik FUE tekniğinin modern bir gelişmiş versiyonudur. Cerrahlarımız metal bıçaklar yerine hassas işlenmiş safir kristal uçlar kullanır — daha küçük, daha düzgün V şekilli kesiler oluşturur, daha hızlı kapanır ve cm² başına daha fazla yoğunluk sağlar.</p>
<h2>Safir bıçakların avantajı</h2>
<p>Geleneksel çelik bıçaklar dokuyu sürtünmeyle keser; safir cilde cilalı bir kenarla kayar. Sonuç: daha az mikrotravma, daha az kanama, daha hızlı iyileşme ve daha iyi açı kontrolü.</p>
<h2>Prosedür özeti</h2>
<p>Konsültasyon, saç çizgisi tasarımı ve lokal anestezi sonrası donör alan tıraşlanır ve foliküler üniteler tek tek çıkarılır. Safir kesiler doğal saç büyüme yönünüze uygun açılarda açılır. Son olarak kıdemli implant uzmanları greftleri bu kanallara yerleştirir.</p>
<h2>O gün</h2>
<p>Aralar dahil altı ila sekiz saat planlayın. Uyanık, konforlu ve iyi bakım altındasınız.</p>
<h2>İyileşme zaman çizelgesi</h2>
<p>1–3. gün: hafif şişlik. 7–14. gün: kabuklar dökülür. 2–8. hafta: geçici dökülme. 3. ay: görünür yeniden uzama. 6–12. ay: dramatik iyileşme. 18. ay: nihai olgun sonuç.</p>
<h2>Safir FUE size uygun mu?</h2>
<p>Safir FUE en geniş vaka yelpazesine uygundur. Hang Da'da fiyatlar ücretsiz konsültasyonunuzdan sonra €1.750'den başlar, her şey dahildir.</p>
$$ WHERE slug = 'safir-fue';

UPDATE services SET content = $$
<p class="lead">Sakal ekimi, saçlı deri için kullanılan aynı foliküler ünite teknikleriyle yüz kıllarını geri kazandırır veya geliştirir. Seyrek bölgeleri doldurmak, ince veya düzensiz bir sakal hattını yeniden tasarlamak ya da genetik olarak hiç oluşmamış yoğunluğu yaratmak için cerrahlarımız tamamen doğal görünen bir sonuç şekillendirir.</p>
<h2>Sakalınızın tasarımı</h2>
<p>Cerrahlarımız yüz yapınızı, çene hattınızı ve mevcut kıl deseninizi değerlendirir ve ardından özelliklerinize saygılı bir tasarım çizer. Herhangi bir kesi yapılmadan önce her çizgiyi onaylarsınız.</p>
<h2>Teknik</h2>
<p>Donör greftler genellikle saçlı derinin arka kısmından alınır. Anesteziden sonra tek tüylü foliküler üniteler çıkarılır ve yüz kıllarının keskin açısı (cilde 5–15 derece) altında yerleştirilir.</p>
<h2>Ne bekleyebilirsiniz</h2>
<p>Seanslar dört ila altı saat sürer. Kabuklar yedi ila on gün içinde temizlenir. Yeni uzama üçüncü ayda başlar. Nihai yoğunluk altıncı ile on ikinci aylar arasında ortaya çıkar.</p>
$$ WHERE slug = 'sakal-ekimi';

UPDATE services SET content = $$
<p class="lead">Kaş ekimi, kalıcı ve doğal büyüyen kıllarla dolgunluk, şekil ve belirginlik kazandırır. Genetik olarak büyümüş kaşlarından ayırt edilemeyen kaşlar yeniden oluşturmak için çok hassas açılarda yerleştirilen tek tüylü greftler kullanırız.</p>
<h2>Kimler için</h2>
<p>Aşırı alma, izler, alopesi, kemoterapi sonrası iyileşme, doğuştan seyreklik ve günlük makyaj veya microblading dokunuşlarından bıkmış hastalar.</p>
<h2>Prosedür</h2>
<p>Ayrıntılı kaş tasarımı sonrası — kavis, tepe ve kuyruk yerleşimi dahil — tek folliküller hasat edilir ve doğal kaş kılının düz, aşağı doğru açısında elle yerleştirilir. Tipik bir seans kaş başına 250 ila 500 greft kullanır ve üç ila dört saat sürer.</p>
<h2>İyileşme</h2>
<p>Hafif kabuklar beş ila yedi gün içinde temizlenir. Nakledilen kıllar geçici olarak dökülür, ardından ikinci aydan itibaren yeniden uzar. Nihai şekil altıncı ayda sabitlenir.</p>
$$ WHERE slug = 'kas-ekimi';

UPDATE services SET content = $$
<p class="lead">Kadınlardaki saç dökülmesi erkeklerdekinden farklı davranır. Genellikle yaygındır, hormonal etkilidir ve mevcut saçı korurken kaybedilen alanlarda — özellikle saç ayrım çizgisi, şakaklar ve tepe çevresinde — yoğunluğu yeniden kazandıran bir transplantasyon stratejisi gerektirir.</p>
<h2>Yaklaşımımız</h2>
<p>Her kadın hem transplantasyon cerrahı hem de bir trikologist tarafından değerlendirilir. Tedavi edilebilir tıbbi nedenleri dışlarız, donör kapasitesini belirleriz ve tam tıraş gerektirmeden yoğunluk ekleyen bir plan tasarlarız.</p>
<h2>Kullanılan teknikler</h2>
<p>Safir FUE ve DHI ikisi de seçenektir. DHI'nın tıraşsız varyantı kadınlar için özellikle popülerdir.</p>
<h2>Kombine tedaviler</h2>
<p>Kadın hastalar için transplantasyonu genellikle PRP ve topikal/oral tıbbi tedavi ile birleştiririz. Koordinatörünüz 12 aylık bir plan oluşturur.</p>
$$ WHERE slug = 'kadinlarda-sac-ekimi';

UPDATE services SET content = $$
<p class="lead">Trombositten Zengin Plazma (PRP), uyuyan folikülleri uyandırmak, aktif saç dökülmesini yavaşlatmak ve transplantasyon sonrası iyileşmeyi hızlandırmak için kendi kanınızdan elde edilen yoğunlaştırılmış büyüme faktörlerini kullanan minimal invaziv bir tedavidir.</p>
<h2>PRP nasıl çalışır</h2>
<p>Küçük bir kan örneği alınır ve trombositlerden ve büyüme faktörlerinden zengin plazma katmanını izole etmek için santrifüjde işlenir. Bu konsantre daha sonra tedavi bölgesinde folikül derinliğine enjekte edilir.</p>
<h2>Kimler yararlanır</h2>
<p>Erken evre incelme, kadın tipi saç dökülmesi, daha hızlı iyileşme arayan transplantasyon sonrası hastalar ve mevcut bir transplantasyonun ömrünü uzatmak isteyen herkes.</p>
<h2>Ne bekleyebilirsiniz</h2>
<p>Her seans 45 ila 60 dakika sürer. Tipik kür dört hafta arayla üç seans, ardından altı ayda bir bakımdır. İşten ayrı kalma süresi pratik olarak sıfırdır.</p>
$$ WHERE slug = 'prp-tedavisi';

-- ===============================
-- Extended FAQs (EN) — adds 10 more, total 15
-- ===============================
INSERT INTO faq (question, answer, category, locale, order_index, is_active) VALUES
  ('Is local or general anesthesia used?', 'All procedures at Hang Da use local anesthesia. You remain comfortably awake throughout, can listen to music, watch films, eat, and use your phone. General anesthesia is unnecessary and carries higher risk for an elective scalp procedure.', 'safety', 'en', 6, true),
  ('How many grafts will I need?', 'It depends on your hair loss pattern, donor capacity, and the density you want to achieve. Norwood 3 cases typically need 2,500–3,500 grafts; Norwood 4–5 need 3,500–5,000; advanced cases up to 6,500 across one or two sessions. Your free consultation includes a precise estimate.', 'general', 'en', 7, true),
  ('Will the result look natural?', 'Yes. Modern Sapphire FUE and DHI place follicles at the exact angle, direction, and density of natural growth. Hairlines are designed in advance based on your facial proportions and approved by you before any incision is made.', 'results', 'en', 8, true),
  ('What is included in the price?', 'Our €1,750 all-inclusive package covers the surgery itself, pre-operative blood tests, two nights of 4-star hotel accommodation, airport and clinic transfers, all medications, post-operative kits, PRP support session, and lifetime follow-up.', 'general', 'en', 9, true),
  ('How long should I stay in Istanbul?', 'Most international patients arrive the day before surgery and leave on the third day. A typical stay is three nights, two of which we include in your package. We can extend accommodation on request.', 'travel', 'en', 10, true),
  ('Can I fly home the next day?', 'Yes, you can fly the day after surgery. We recommend a window seat and a loose hat to avoid contact with the recipient area. Detailed travel-day instructions are part of your aftercare booklet.', 'travel', 'en', 11, true),
  ('When can I exercise again?', 'Light walking is fine from day one. Avoid weight training, swimming, sauna, and contact sports for two weeks. Gradual return to full exercise by week four.', 'recovery', 'en', 12, true),
  ('What if my transplanted hair falls out?', 'A natural shedding phase between weeks two and eight is part of every transplant cycle — the follicles remain alive beneath the skin and regrow from month three. This is a normal, expected phase, not failure.', 'results', 'en', 13, true),
  ('Do you offer a growth guarantee?', 'Yes. Hang Da provides a written growth guarantee. If transplanted follicles do not yield, we re-implant at no additional surgical cost within the first 18 months.', 'safety', 'en', 14, true),
  ('How is Hang Da different from other clinics?', 'Surgeons (not technicians) perform the critical steps, ratios of one coordinator per patient, transparent all-inclusive pricing, lifetime follow-up, and a written guarantee. Every patient meets the lead surgeon in person on the day of the procedure.', 'general', 'en', 15, true)
ON CONFLICT DO NOTHING;

-- Extended FAQs (NL)
INSERT INTO faq (question, answer, category, locale, order_index, is_active) VALUES
  ('Wordt lokale of algemene anesthesie gebruikt?', 'Alle ingrepen bij Hang Da gebeuren onder lokale verdoving. U blijft comfortabel wakker, kunt muziek luisteren, films kijken, eten en uw telefoon gebruiken. Algemene anesthesie is niet nodig en draagt een hoger risico voor een electieve ingreep.', 'safety', 'nl', 6, true),
  ('Hoeveel grafts heb ik nodig?', 'Dat hangt af van uw uitvalpatroon, donorcapaciteit en gewenste dichtheid. Norwood 3: 2.500–3.500 grafts; Norwood 4–5: 3.500–5.000; gevorderde gevallen tot 6.500 over één of twee sessies. Uw gratis consult bevat een precieze inschatting.', 'general', 'nl', 7, true),
  ('Zal het resultaat natuurlijk lijken?', 'Ja. Moderne Saffier FUE en DHI plaatsen follikels onder de exacte hoek, richting en dichtheid van natuurlijke groei. Haarlijnen worden vooraf ontworpen op basis van uw gezichtsproporties en door u goedgekeurd voor elke incisie.', 'results', 'nl', 8, true),
  ('Wat is inbegrepen in de prijs?', 'Ons all-inclusive pakket vanaf €1.750 omvat de ingreep zelf, pre-operatief bloedonderzoek, twee nachten in een 4-sterren hotel, transfers van/naar luchthaven en kliniek, alle medicatie, post-operatieve kits, een PRP-sessie en levenslange follow-up.', 'general', 'nl', 9, true),
  ('Hoe lang moet ik in Istanbul blijven?', 'De meeste internationale patiënten komen de dag vóór de ingreep aan en vertrekken op de derde dag. Een typisch verblijf is drie nachten, waarvan twee in uw pakket zijn opgenomen.', 'travel', 'nl', 10, true),
  ('Kan ik de volgende dag terugvliegen?', 'Ja, u kunt de dag na de ingreep vliegen. Wij raden een raamzitplaats en een losse hoed aan. Gedetailleerde reisinstructies zijn onderdeel van uw nazorgboekje.', 'travel', 'nl', 11, true),
  ('Wanneer kan ik weer sporten?', 'Licht wandelen vanaf dag één is prima. Vermijd krachttraining, zwemmen, sauna en contactsporten gedurende twee weken. Volledige terugkeer naar sport tegen week vier.', 'recovery', 'nl', 12, true),
  ('Wat als mijn getransplanteerde haar uitvalt?', 'Een natuurlijke uitvalfase tussen week twee en acht hoort bij elke transplantatiecyclus — de follikels blijven leven onder de huid en groeien terug vanaf maand drie. Dit is normaal, geen mislukking.', 'results', 'nl', 13, true),
  ('Bieden jullie een groeigarantie?', 'Ja. Hang Da biedt een schriftelijke groeigarantie. Als getransplanteerde follikels niet uitkomen, herimplanteren we kosteloos binnen de eerste 18 maanden.', 'safety', 'nl', 14, true),
  ('Wat maakt Hang Da anders?', 'Chirurgen (geen technici) voeren de kritieke stappen uit, één coördinator per patiënt, transparante all-inclusive prijzen, levenslange follow-up en schriftelijke garantie. Elke patiënt ontmoet de hoofdchirurg persoonlijk op de dag van de ingreep.', 'general', 'nl', 15, true)
ON CONFLICT DO NOTHING;

-- Extended FAQs (TR)
INSERT INTO faq (question, answer, category, locale, order_index, is_active) VALUES
  ('Lokal mi yoksa genel anestezi mi kullanılıyor?', 'Hang Da''daki tüm işlemler lokal anestezi ile yapılır. Konforlu şekilde uyanık kalırsınız, müzik dinleyebilir, film izleyebilir, yemek yiyebilir ve telefonunuzu kullanabilirsiniz. Genel anestezi gereksizdir.', 'safety', 'tr', 6, true),
  ('Kaç greft gerekecek?', 'Saç dökülme deseninize, donör kapasitenize ve istediğiniz yoğunluğa bağlıdır. Norwood 3: 2.500–3.500 greft; Norwood 4–5: 3.500–5.000; ileri vakalar bir veya iki seansta 6.500''e kadar. Ücretsiz konsültasyonunuz net bir tahmin içerir.', 'general', 'tr', 7, true),
  ('Sonuç doğal görünecek mi?', 'Evet. Modern Safir FUE ve DHI, doğal büyümenin tam açı, yön ve yoğunluğunda foliküller yerleştirir. Saç çizgileri yüz oranlarınıza göre önceden tasarlanır ve herhangi bir kesi yapılmadan önce sizin tarafınızdan onaylanır.', 'results', 'tr', 8, true),
  ('Fiyata neler dahil?', '€1.750''den başlayan her şey dahil paketimiz; cerrahi işlem, ameliyat öncesi kan testleri, iki gece 4 yıldızlı otel konaklama, havalimanı ve klinik transferleri, tüm ilaçlar, ameliyat sonrası kitler, PRP destek seansı ve ömür boyu takip içerir.', 'general', 'tr', 9, true),
  ('İstanbul''da ne kadar kalmalıyım?', 'Çoğu uluslararası hasta ameliyatın bir gün öncesi gelir ve üçüncü gün ayrılır. Tipik konaklama üç gecedir, ikisi paketinizde dahildir.', 'travel', 'tr', 10, true),
  ('Ertesi gün uçabilir miyim?', 'Evet, ameliyatın ertesi günü uçabilirsiniz. Pencere koltuğu ve gevşek bir şapka öneririz. Ayrıntılı seyahat günü talimatları bakım kitapçığınızda mevcuttur.', 'travel', 'tr', 11, true),
  ('Ne zaman spor yapabilirim?', 'Birinci günden itibaren hafif yürüyüş uygundur. Ağırlık antrenmanı, yüzme, sauna ve temas sporlarından iki hafta uzak durun. Dördüncü haftada tam egzersize dönüş.', 'recovery', 'tr', 12, true),
  ('Nakledilen saçım dökülürse ne olur?', 'İkinci ila sekizinci hafta arasındaki doğal dökülme fazı her transplantasyon döngüsünün parçasıdır — foliküller cilt altında canlı kalır ve üçüncü aydan itibaren yeniden uzar. Bu normal bir aşamadır, başarısızlık değildir.', 'results', 'tr', 13, true),
  ('Büyüme garantiniz var mı?', 'Evet. Hang Da yazılı büyüme garantisi sunar. Nakledilen foliküller verim vermezse, ilk 18 ay içinde ek cerrahi maliyet olmadan yeniden ekiyoruz.', 'safety', 'tr', 14, true),
  ('Hang Da diğer kliniklerden nasıl ayrılıyor?', 'Kritik adımları cerrahlar (teknisyenler değil) yapar, hasta başına bir koordinatör, şeffaf her şey dahil fiyatlar, ömür boyu takip ve yazılı garanti. Her hasta işlem günü baş cerrah ile şahsen tanışır.', 'general', 'tr', 15, true)
ON CONFLICT DO NOTHING;

-- ===============================
-- Trust signal site settings
-- ===============================
INSERT INTO site_settings (key, value, locale, category) VALUES
  ('trust_certifications', 'JCI Accredited · ISHRS Member · ISO 9001:2015 · Turkish Ministry of Health Licensed', 'all', 'trust'),
  ('trust_guarantee_years', '18-month written growth guarantee', 'all', 'trust'),
  ('trust_patients_count', '15,000+', 'all', 'trust'),
  ('trust_countries_count', '60+', 'all', 'trust'),
  ('trust_press', 'Featured in BBC, Vogue, Daily Mail, Hürriyet, Telegraaf', 'all', 'trust')
ON CONFLICT (key, locale) DO NOTHING;
