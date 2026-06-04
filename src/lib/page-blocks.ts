import { createClient } from '@/lib/supabase/server';

export interface PageBlock {
  id: string;
  page_key: string;
  section_key: string;
  locale: string;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_href: string | null;
  extra: Record<string, unknown> | null;
  order_index: number;
  is_active: boolean;
  updated_at: string;
}

/**
 * Loads a single content block for a given page/section. Locale-specific rows
 * win over 'all'. Returns null silently if the table is missing (so the site
 * stays alive before migration 007 is applied).
 */
export async function getPageBlock(
  page: string,
  section: string,
  locale: string
): Promise<PageBlock | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('page_blocks')
      .select('*')
      .eq('page_key', page)
      .eq('section_key', section)
      .in('locale', [locale, 'all'])
      .eq('is_active', true)
      .order('locale', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return data as unknown as PageBlock;
  } catch {
    return null;
  }
}

/**
 * Helper that returns the first non-empty value among `block?.field` and a
 * fallback. Useful when a component wants to use admin overrides only when set.
 */
export function blockField<T extends string | null | undefined>(
  value: T,
  fallback: string
): string {
  const v = (value ?? '').toString().trim();
  return v.length > 0 ? v : fallback;
}
