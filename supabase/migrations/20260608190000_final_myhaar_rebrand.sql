-- Final brand sweep: every remaining 'Hang Da' / 'Hangda' / 'HangDa' string
-- in seeded data is rewritten to 'MyHaar', plus location references that
-- said Turkey/Istanbul are corrected to Den Haag / Netherlands.

-- site_settings — guard rails in case earlier rebrand missed a row
UPDATE site_settings SET value = REPLACE(REPLACE(REPLACE(value, 'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar') WHERE value LIKE '%Hang%';

-- page_seo (titles, descriptions, keywords)
UPDATE page_seo
SET title       = REPLACE(REPLACE(REPLACE(title,       'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar'),
    description = REPLACE(REPLACE(REPLACE(description, 'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar'),
    keywords    = REPLACE(REPLACE(REPLACE(keywords,    'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar')
WHERE title LIKE '%Hang%' OR description LIKE '%Hang%' OR keywords LIKE '%Hang%';

-- Fix lingering Turkey / Istanbul references for the public-facing meta
-- (MyHaar operates only out of Den Haag, NL).
UPDATE page_seo
SET keywords    = REPLACE(REPLACE(keywords, 'Turkey', 'Den Haag'), 'Türkiye', 'Den Haag'),
    description = REPLACE(REPLACE(description, 'Istanbul', 'Den Haag'), 'İstanbul', 'Den Haag')
WHERE keywords LIKE '%Turkey%' OR keywords LIKE '%Türkiye%'
   OR description LIKE '%Istanbul%' OR description LIKE '%İstanbul%';

-- services — meta titles + meta descriptions + legacy HTML content
UPDATE services
SET meta_title       = REPLACE(REPLACE(REPLACE(meta_title,       'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar'),
    meta_description = REPLACE(REPLACE(REPLACE(meta_description, 'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar'),
    content          = REPLACE(REPLACE(REPLACE(content,          'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar')
WHERE meta_title LIKE '%Hang%' OR meta_description LIKE '%Hang%' OR content LIKE '%Hang%';

-- blog_posts — author default + content
UPDATE blog_posts
SET author  = REPLACE(REPLACE(REPLACE(author,  'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar'),
    content = REPLACE(REPLACE(REPLACE(content, 'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar'),
    title   = REPLACE(REPLACE(REPLACE(title,   'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar')
WHERE author LIKE '%Hang%' OR content LIKE '%Hang%' OR title LIKE '%Hang%';

-- page_blocks — any seeded text override that snuck through
UPDATE page_blocks
SET eyebrow  = REPLACE(REPLACE(REPLACE(eyebrow,  'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar'),
    title    = REPLACE(REPLACE(REPLACE(title,    'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar'),
    subtitle = REPLACE(REPLACE(REPLACE(subtitle, 'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar'),
    body     = REPLACE(REPLACE(REPLACE(body,     'Hang Da', 'MyHaar'), 'HangDa', 'MyHaar'), 'Hangda', 'MyHaar')
WHERE eyebrow LIKE '%Hang%' OR title LIKE '%Hang%' OR subtitle LIKE '%Hang%' OR body LIKE '%Hang%';
