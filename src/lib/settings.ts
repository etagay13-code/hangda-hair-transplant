import { createClient } from '@/lib/supabase/server';
import type { SiteSetting } from '@/types';

export type SettingsMap = Record<string, string>;

/**
 * Loads all site_settings keys into a plain string map.
 * Locale-specific values override 'all' fallbacks.
 */
export async function getSiteSettings(
  locale: string = 'all'
): Promise<SettingsMap> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .in('locale', [locale, 'all']);

    if (error || !data) return {};

    const map: SettingsMap = {};
    (data as SiteSetting[]).forEach((row) => {
      if (row.locale === 'all' && map[row.key] !== undefined) return;
      if (row.value !== null) map[row.key] = row.value;
    });
    return map;
  } catch {
    return {};
  }
}

export function getSetting(map: SettingsMap, key: string, fallback = ''): string {
  return map[key] ?? fallback;
}

export async function getPageSeo(pageKey: string, locale: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('page_seo')
      .select('*')
      .eq('page_key', pageKey)
      .eq('locale', locale)
      .maybeSingle();
    return data ?? null;
  } catch {
    return null;
  }
}
