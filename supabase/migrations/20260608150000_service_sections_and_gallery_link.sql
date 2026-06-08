-- 1) gallery.service_slug — her vakanın hangi hizmet detay sayfasında
--    gösterileceğini belirler. NULL = sadece genel /gallery sayfasında.
ALTER TABLE gallery
  ADD COLUMN IF NOT EXISTS service_slug text;

CREATE INDEX IF NOT EXISTS idx_gallery_service_slug ON gallery(service_slug);

-- 2) services tablosuna yapılandırılmış bölüm alanları. content (HTML)
--    yerine bunları kullanacağız; admin tarafında bölüm bölüm düzenlenebilir.
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS content_sections jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS included_items   jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS eligibility_yes  jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS eligibility_no   jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS who_for_eyebrow  text,
  ADD COLUMN IF NOT EXISTS who_for_title    text,
  ADD COLUMN IF NOT EXISTS who_for_subtitle text;

-- content_sections shape: [{ title: 'How we approach…', body: '…paragraph…' }, …]
-- included_items shape:  ['Free surgeon consultation…', '…', …]
-- eligibility_yes/no shape: ['Stable hair-loss pattern…', …]
