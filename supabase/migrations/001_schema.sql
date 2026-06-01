-- Hang Da Hair Transplant - Database Schema
-- Migration 001: Initial schema with RLS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================
-- Site Settings (dynamic content)
-- ===============================
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL,
  value text,
  locale text DEFAULT 'all',
  category text DEFAULT 'general',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(key, locale)
);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);

-- ===============================
-- Services
-- ===============================
CREATE TABLE IF NOT EXISTS services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL,
  title text NOT NULL,
  short_description text,
  description text,
  content text,
  image_url text,
  icon text,
  price_from integer,
  duration text,
  locale text DEFAULT 'en',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(slug, locale)
);

CREATE INDEX IF NOT EXISTS idx_services_locale ON services(locale);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_index);

-- ===============================
-- Gallery / Before-After
-- ===============================
CREATE TABLE IF NOT EXISTS gallery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_code text,
  category text DEFAULT 'hair',
  technique text,
  grafts integer,
  months_after integer,
  before_image_url text,
  after_image_url text,
  description text,
  locale text DEFAULT 'en',
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_locale ON gallery(locale);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);

-- ===============================
-- Blog Posts
-- ===============================
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text,
  cover_image_url text,
  author text DEFAULT 'Hang Da Team',
  category text,
  tags text[],
  locale text DEFAULT 'en',
  is_published boolean DEFAULT false,
  published_at timestamptz,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(slug, locale)
);

CREATE INDEX IF NOT EXISTS idx_blog_locale ON blog_posts(locale);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_published_at ON blog_posts(published_at DESC);

-- ===============================
-- Contacts (form submissions)
-- ===============================
CREATE TABLE IF NOT EXISTS contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  phone text,
  country text,
  message text,
  service_interest text,
  hair_loss_type text,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  locale text DEFAULT 'en',
  status text DEFAULT 'new',
  notes text,
  assigned_to text,
  follow_up_date date,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_follow_up ON contacts(follow_up_date);

-- ===============================
-- Team Members
-- ===============================
CREATE TABLE IF NOT EXISTS team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  title text,
  bio text,
  image_url text,
  specialization text,
  locale text DEFAULT 'en',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_team_locale ON team_members(locale);
CREATE INDEX IF NOT EXISTS idx_team_active ON team_members(is_active);

-- ===============================
-- Testimonials
-- ===============================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  country text,
  rating integer DEFAULT 5,
  comment text,
  technique text,
  grafts integer,
  image_url text,
  video_url text,
  locale text DEFAULT 'en',
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_locale ON testimonials(locale);
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);

-- ===============================
-- FAQ
-- ===============================
CREATE TABLE IF NOT EXISTS faq (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'general',
  locale text DEFAULT 'en',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_faq_locale ON faq(locale);
CREATE INDEX IF NOT EXISTS idx_faq_category ON faq(category);
CREATE INDEX IF NOT EXISTS idx_faq_active ON faq(is_active);

-- ===============================
-- Form Redirects
-- ===============================
CREATE TABLE IF NOT EXISTS form_redirects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  form_name text NOT NULL UNIQUE,
  success_url text,
  email_to text,
  email_cc text,
  webhook_url text,
  is_active boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- ===============================
-- Page SEO
-- ===============================
CREATE TABLE IF NOT EXISTS page_seo (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key text NOT NULL,
  locale text DEFAULT 'en',
  title text,
  description text,
  og_image text,
  keywords text,
  canonical_url text,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_key, locale)
);

CREATE INDEX IF NOT EXISTS idx_page_seo_key ON page_seo(page_key);

-- ===============================
-- Analytics Events Log
-- ===============================
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text,
  event_data jsonb,
  page_url text,
  locale text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at DESC);

-- ===============================
-- Enable Row Level Security
-- ===============================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- ===============================
-- Public read policies
-- ===============================
DROP POLICY IF EXISTS "Public read services" ON services;
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read gallery" ON gallery;
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read blog" ON blog_posts;
CREATE POLICY "Public read blog" ON blog_posts FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Public read team" ON team_members;
CREATE POLICY "Public read team" ON team_members FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read faq" ON faq;
CREATE POLICY "Public read faq" ON faq FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read settings" ON site_settings;
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read page_seo" ON page_seo;
CREATE POLICY "Public read page_seo" ON page_seo FOR SELECT USING (true);

-- ===============================
-- Public insert policies
-- ===============================
DROP POLICY IF EXISTS "Public insert contacts" ON contacts;
CREATE POLICY "Public insert contacts" ON contacts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert analytics" ON analytics_events;
CREATE POLICY "Public insert analytics" ON analytics_events FOR INSERT WITH CHECK (true);

-- ===============================
-- Admin full access (authenticated)
-- ===============================
DROP POLICY IF EXISTS "Admin all services" ON services;
CREATE POLICY "Admin all services" ON services FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all gallery" ON gallery;
CREATE POLICY "Admin all gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all blog" ON blog_posts;
CREATE POLICY "Admin all blog" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all contacts" ON contacts;
CREATE POLICY "Admin all contacts" ON contacts FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all team" ON team_members;
CREATE POLICY "Admin all team" ON team_members FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all testimonials" ON testimonials;
CREATE POLICY "Admin all testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all faq" ON faq;
CREATE POLICY "Admin all faq" ON faq FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all settings" ON site_settings;
CREATE POLICY "Admin all settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all form_redirects" ON form_redirects;
CREATE POLICY "Admin all form_redirects" ON form_redirects FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin all page_seo" ON page_seo;
CREATE POLICY "Admin all page_seo" ON page_seo FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin read analytics" ON analytics_events;
CREATE POLICY "Admin read analytics" ON analytics_events FOR SELECT USING (auth.role() = 'authenticated');

-- ===============================
-- Storage buckets (run from dashboard or via SQL):
--   gallery (public)
--   blog (public)
--   team (public)
--   general (public)
-- ===============================
