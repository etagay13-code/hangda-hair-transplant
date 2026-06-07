import { createClient } from '@/lib/supabase/server';
import type { NavItem } from '@/types';

/**
 * Loads navigation items for a given group ('primary' for navbar, 'footer'
 * for footer nav). Locale-specific rows override 'all'. Returns [] if the
 * nav_items table doesn't exist yet so the navbar keeps working before
 * migration 008 is applied.
 */
export async function getNavItems(group: string, locale: string): Promise<NavItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('nav_items')
      .select('*')
      .eq('group_key', group)
      .eq('is_active', true)
      .in('locale', [locale, 'all'])
      .order('order_index', { ascending: true });
    if (error || !data) return [];
    // Prefer locale-specific rows over 'all' rows when both exist for the same href
    const specific = data.filter((row) => row.locale === locale).map((r) => r.href);
    return (data as NavItem[]).filter(
      (row) => row.locale === locale || !specific.includes(row.href)
    );
  } catch {
    return [];
  }
}
