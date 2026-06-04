-- Page Blocks: a generic, admin-editable content store for any section on any page.
-- The site components read from this table first (with sensible fallbacks), so
-- editors can change copy, eyebrows, CTAs and hero images from /admin/page-blocks
-- without redeploying.

CREATE TABLE IF NOT EXISTS page_blocks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key text NOT NULL,           -- 'home' | 'about' | 'services' | 'contact' | 'gallery' | 'blog' | ...
  section_key text NOT NULL,        -- 'hero' | 'why_us_intro' | 'services_intro' | ...
  locale text NOT NULL DEFAULT 'all', -- 'all' | 'en' | 'nl' | 'tr'
  eyebrow text,
  title text,
  subtitle text,
  body text,
  image_url text,
  cta_label text,
  cta_href text,
  extra jsonb,                       -- catch-all for less common fields
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_key, section_key, locale)
);

CREATE INDEX IF NOT EXISTS idx_page_blocks_lookup ON page_blocks(page_key, section_key, locale);
CREATE INDEX IF NOT EXISTS idx_page_blocks_active ON page_blocks(is_active);

ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read page_blocks" ON page_blocks;
CREATE POLICY "Public read page_blocks" ON page_blocks
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin all page_blocks" ON page_blocks;
CREATE POLICY "Admin all page_blocks" ON page_blocks
  FOR ALL USING (auth.role() = 'authenticated');

-- ===============================
-- Seed default blocks (locale 'all')
-- Components fall back to translation messages when a field is empty/null.
-- ===============================
INSERT INTO page_blocks (page_key, section_key, locale, eyebrow, title, subtitle, image_url, cta_label, cta_href) VALUES
  ('home', 'hero', 'all',
   'Premium Hair Restoration',
   'Restore Your Natural Hair, Restore Your Confidence',
   'World-class hair transplant procedures with proven results. Trusted by patients in the Netherlands and across Europe.',
   '/gallery/result-3400-sapphire-fue.jpg',
   'Get Free Consultation',
   '#contact'),

  ('home', 'why_us', 'all',
   'Why Choose MyHaar',
   'Why Choose MyHaar',
   'Excellence in every detail of your hair restoration journey',
   NULL, NULL, NULL),

  ('home', 'techniques', 'all',
   'Compare techniques',
   'Three techniques. One standard of care.',
   'Choose the approach that fits your hair-loss pattern, donor capacity, and lifestyle. Every package includes the procedure, all medications, PRP and lifetime follow-up at our Den Haag clinic.',
   NULL, NULL, NULL),

  ('home', 'services', 'all',
   'Our Services',
   'Our Services',
   'Comprehensive hair restoration solutions tailored to your needs',
   NULL, NULL, NULL),

  ('home', 'process', 'all',
   'Your Journey With Us',
   'Your Journey With Us',
   'A clear, supportive path from consultation to recovery',
   NULL, NULL, NULL),

  ('home', 'gallery', 'all',
   'Before & After',
   'Before & After',
   'Real results from real patients',
   NULL,
   'View all',
   '/gallery'),

  ('home', 'included', 'all',
   'What is included',
   'One transparent price. No surprises.',
   'The number on your written quote is the number you pay — and it covers everything from your first consultation to your last follow-up appointment, eighteen months later.',
   'https://images.unsplash.com/photo-1580281657527-47f249e8f4df?auto=format&fit=crop&w=900&q=80',
   NULL, NULL),

  ('home', 'recovery', 'all',
   'Recovery',
   'Your 18-month journey, mapped out',
   'Hair restoration is a process. Here is exactly what happens, when — so you can plan around it with confidence.',
   NULL, NULL, NULL),

  ('home', 'testimonials', 'all',
   'Patient Stories',
   'Patient Stories',
   'Hear from people who transformed their lives with us',
   NULL, NULL, NULL),

  ('home', 'faq', 'all',
   'FAQ',
   'Frequently Asked Questions',
   'Answers to common questions about hair transplantation',
   NULL, NULL, NULL),

  ('home', 'contact', 'all',
   'Get in Touch',
   'Get in Touch',
   'We are here to answer any questions',
   NULL,
   'Book Free Consultation',
   '/contact'),

  ('about', 'hero', 'all',
   'About MyHaar',
   'A clinic built on outcomes, not promises',
   'Two decades of hair restoration in Den Haag. One unwavering standard of care.',
   'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=900&q=80',
   NULL, NULL),

  ('about', 'story', 'all',
   NULL, 'Our story', NULL,
   NULL, NULL, NULL),

  ('about', 'mission', 'all',
   NULL, 'Our standard of care', NULL,
   NULL, NULL, NULL),

  ('services', 'hero', 'all',
   'Our Services',
   'Our Services',
   'Comprehensive hair restoration solutions tailored to your needs',
   NULL, NULL, NULL),

  ('gallery', 'hero', 'all',
   'Before & After',
   'Before & After',
   'Real results from real patients',
   NULL, NULL, NULL),

  ('contact', 'hero', 'all',
   'Get in Touch',
   'Get in Touch',
   'We are here to answer any questions',
   NULL, NULL, NULL),

  ('blog', 'hero', 'all',
   'Latest from our Blog',
   'Latest from our Blog',
   'Insights, tips, and stories about hair restoration',
   NULL, NULL, NULL)
ON CONFLICT (page_key, section_key, locale) DO NOTHING;
