'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// Whitelist the keys the integrations form can touch — guards against a
// stray FormData entry overwriting unrelated settings.
const ALLOWED_KEYS = new Set([
  'ga_measurement_id',
  'gtm_id',
  'meta_pixel_id',
  'search_console_verification',
  'bing_site_verification',
  'yandex_verification',
  'hotjar_id',
  'clarity_id',
  'custom_head_html',
  'custom_body_html',
]);

/**
 * Upserts every integrations setting in one round-trip. Locale is always
 * 'all' for tracking codes (the same GA/GTM ID applies to every language).
 */
export async function saveIntegrations(formData: FormData) {
  const supabase = await createClient();
  const updates: Array<{ key: string; value: string }> = [];
  for (const [key, raw] of formData.entries()) {
    if (!ALLOWED_KEYS.has(key)) continue;
    const value = ((raw as string | null) ?? '').trim();
    updates.push({ key, value });
  }

  for (const u of updates) {
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          key: u.key,
          value: u.value || null,
          category: 'tracking',
          locale: 'all',
        },
        { onConflict: 'key,locale' }
      );
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/integrations');
  // Tracking is read in the root layout, so flush every cached page.
  revalidatePath('/', 'layout');
}
