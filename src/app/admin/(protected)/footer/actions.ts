'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_FOOTER_KEYS = new Set([
  'trust_section_visible',
  'trust_certifications_visible',
  'trust_guarantee_visible',
  'trust_patients_visible',
  'trust_countries_visible',
  'trust_press_visible',
  'trust_certifications',
  'trust_guarantee_years',
  'trust_patients_count',
  'trust_countries_count',
  'trust_press',
  'footer_tagline',
]);

const ALLOWED_POPUP_KEYS = new Set([
  'popup_enabled',
  'popup_delay_seconds',
  'popup_dismiss_hours',
  'popup_line_one',
  'popup_line_two',
  'popup_line_three',
  'popup_check_1',
  'popup_check_2',
  'popup_cta',
  'popup_disclaimer',
  'popup_right_title',
  'popup_card_1',
  'popup_card_2',
  'popup_card_3',
  'popup_card_4',
  'popup_whatsapp_message',
]);

function payloadEntries(form: FormData, allow: Set<string>) {
  const out: Array<{ key: string; value: string; locale: string }> = [];
  for (const [field, raw] of form.entries()) {
    if (field.startsWith('locale_for__')) continue;
    // Form fields look like 'popup_line_one__en' or 'trust_section_visible__all'
    const [key, locale] = field.split('__');
    if (!key || !locale) continue;
    if (!allow.has(key)) continue;
    out.push({ key, value: ((raw as string | null) ?? '').trim(), locale });
  }
  return out;
}

async function upsert(updates: Array<{ key: string; value: string; locale: string }>, category: string) {
  const supabase = await createClient();
  for (const u of updates) {
    const { error } = await supabase.from('site_settings').upsert(
      {
        key: u.key,
        value: u.value || null,
        category,
        locale: u.locale,
      },
      { onConflict: 'key,locale' }
    );
    if (error) throw new Error(error.message);
  }
}

export async function saveFooter(form: FormData) {
  const entries = payloadEntries(form, ALLOWED_FOOTER_KEYS);
  // Checkboxes only submit when checked — pad missing visibility flags with
  // 'false' so unticking actually persists.
  const allKeys = new Set(entries.map((e) => `${e.key}__${e.locale}`));
  for (const k of [
    'trust_section_visible',
    'trust_certifications_visible',
    'trust_guarantee_visible',
    'trust_patients_visible',
    'trust_countries_visible',
    'trust_press_visible',
  ]) {
    if (!allKeys.has(`${k}__all`)) {
      entries.push({ key: k, value: 'false', locale: 'all' });
    }
  }
  await upsert(entries, 'footer');
  revalidatePath('/admin/footer');
  revalidatePath('/', 'layout');
}

export async function savePopup(form: FormData) {
  const entries = payloadEntries(form, ALLOWED_POPUP_KEYS);
  if (!entries.find((e) => e.key === 'popup_enabled' && e.locale === 'all')) {
    entries.push({ key: 'popup_enabled', value: 'false', locale: 'all' });
  }
  await upsert(entries, 'popup');
  revalidatePath('/admin/popup');
  revalidatePath('/', 'layout');
}
