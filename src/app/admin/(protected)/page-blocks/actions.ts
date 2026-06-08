'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { routing } from '@/i18n/routing';
import { getRenderedField } from '@/lib/section-defaults';

type DefaultedField = 'eyebrow' | 'title' | 'subtitle' | 'body' | 'cta_label';

function str(v: FormDataEntryValue | null) {
  return ((v as string | null) ?? '').trim();
}
function nullable(v: FormDataEntryValue | null) {
  const s = str(v);
  return s.length > 0 ? s : null;
}

// The edit form pre-fills text fields with the current translation / static
// fallback so editors see live copy in place. Without this guard a save
// would persist the pre-filled English copy as an override and freeze every
// locale to English. So: if the submitted value matches what the public
// site would render anyway, store NULL and let translation fallback work.
function smartNullable(
  v: FormDataEntryValue | null,
  pageKey: string,
  sectionKey: string,
  locale: string,
  field: DefaultedField
) {
  const s = str(v);
  if (!s) return null;
  const rendered = getRenderedField(pageKey, sectionKey, locale, field).trim();
  if (rendered && rendered === s) return null;
  return s;
}
function int(v: FormDataEntryValue | null): number {
  const s = str(v);
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}
function bool(v: FormDataEntryValue | null) {
  return str(v) === 'on' || str(v) === 'true';
}

function parseExtra(form: FormData, pageKey: string, sectionKey: string): Record<string, unknown> | null {
  // Section-specific 'extra' fields. For the homepage hero block we expose
  // stats + floating badges + result-card caption via the form, then bundle
  // them into a JSON-serialisable object that lives in page_blocks.extra.
  if (pageKey === 'home' && sectionKey === 'hero') {
    const stats: Array<{ label: string; value: string; visible: boolean }> = [];
    for (let i = 0; i < 4; i++) {
      stats.push({
        label: str(form.get(`stat_${i}_label`)),
        value: str(form.get(`stat_${i}_value`)),
        visible: bool(form.get(`stat_${i}_visible`)),
      });
    }
    return {
      stats,
      badgeTopLeft: {
        label: str(form.get('badgeTopLeft_label')),
        value: str(form.get('badgeTopLeft_value')),
        visible: bool(form.get('badgeTopLeft_visible')),
      },
      badgeBottomRight: {
        label: str(form.get('badgeBottomRight_label')),
        value: str(form.get('badgeBottomRight_value')),
        visible: bool(form.get('badgeBottomRight_visible')),
      },
      resultCard: {
        eyebrow: str(form.get('resultCard_eyebrow')),
        title: str(form.get('resultCard_title')),
        visible: bool(form.get('resultCard_visible')),
      },
    };
  }
  return null;
}

function payload(form: FormData) {
  const page_key = str(form.get('page_key'));
  const section_key = str(form.get('section_key'));
  const locale = str(form.get('locale')) || 'all';
  return {
    page_key,
    section_key,
    locale,
    eyebrow: smartNullable(form.get('eyebrow'), page_key, section_key, locale, 'eyebrow'),
    title: smartNullable(form.get('title'), page_key, section_key, locale, 'title'),
    subtitle: smartNullable(form.get('subtitle'), page_key, section_key, locale, 'subtitle'),
    body: smartNullable(form.get('body'), page_key, section_key, locale, 'body'),
    image_url: nullable(form.get('image_url')),
    cta_label: smartNullable(form.get('cta_label'), page_key, section_key, locale, 'cta_label'),
    cta_href: nullable(form.get('cta_href')),
    extra: parseExtra(form, page_key, section_key) as never,
    order_index: int(form.get('order_index')),
    is_active: bool(form.get('is_active')),
    updated_at: new Date().toISOString(),
  };
}

// Revalidate the public pages tied to a block. We invalidate every locale so
// edits ripple immediately across EN / NL / TR.
function revalidatePageInAllLocales(page_key: string) {
  const path =
    page_key === 'home'
      ? ''
      : `/${page_key}`;
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}${path}`);
  }
  // Also flush layout cache so nav/footer reflect site_settings if relevant
  revalidatePath('/', 'layout');
}

export async function createBlock(form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  if (!data.page_key || !data.section_key) throw new Error('Page key and section key are required');
  const { error } = await supabase.from('page_blocks').insert(data);
  if (error) throw new Error(error.message);
  revalidatePageInAllLocales(data.page_key);
  revalidatePath('/admin/page-blocks');
  redirect('/admin/page-blocks');
}

export async function updateBlock(id: string, form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  const { error } = await supabase.from('page_blocks').update(data).eq('id', id);
  if (error) throw new Error(error.message);

  // If the editor just touched the 'all' (master) row, push the same values
  // into the EN / NL / TR specific rows so every language picks up the change
  // immediately — this is the "edit once → all languages update" UX.
  // Locale-specific edits stay scoped to that locale.
  if (data.locale === 'all') {
    for (const locale of routing.locales) {
      const sibling = {
        page_key: data.page_key,
        section_key: data.section_key,
        locale,
        eyebrow: data.eyebrow,
        title: data.title,
        subtitle: data.subtitle,
        body: data.body,
        image_url: data.image_url,
        cta_label: data.cta_label,
        cta_href: data.cta_href,
        extra: data.extra,
        order_index: data.order_index,
        is_active: data.is_active,
        updated_at: new Date().toISOString(),
      };
      const { data: existing } = await supabase
        .from('page_blocks')
        .select('id')
        .eq('page_key', data.page_key)
        .eq('section_key', data.section_key)
        .eq('locale', locale)
        .maybeSingle();
      if (existing) {
        await supabase.from('page_blocks').update(sibling).eq('id', existing.id);
      }
    }
  }

  revalidatePageInAllLocales(data.page_key);
  revalidatePath('/admin/page-blocks');
  revalidatePath(`/admin/page-blocks/${id}`);
  revalidatePath(`/admin/pages/${data.page_key}`);
  redirect(`/admin/pages/${data.page_key}?locale=${data.locale}`);
}

export async function deleteBlock(id: string, page_key: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('page_blocks').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePageInAllLocales(page_key);
  revalidatePath('/admin/page-blocks');
}

/**
 * Copy a source block's editable fields into rows for every other locale.
 * Existing rows are upserted (so editors can re-run after tweaking the source
 * to push the new copy across NL/TR). Used by the "Sync to all locales" button
 * on the page-blocks list/edit screens.
 */
export async function syncBlockToAllLocales(sourceId: string) {
  const supabase = await createClient();
  const { data: src } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('id', sourceId)
    .maybeSingle();
  if (!src) throw new Error('Source block not found');

  const targets = routing.locales.filter((l) => l !== src.locale);
  for (const locale of targets) {
    const { data: existing } = await supabase
      .from('page_blocks')
      .select('id')
      .eq('page_key', src.page_key)
      .eq('section_key', src.section_key)
      .eq('locale', locale)
      .maybeSingle();

    const data = {
      page_key: src.page_key,
      section_key: src.section_key,
      locale,
      eyebrow: src.eyebrow,
      title: src.title,
      subtitle: src.subtitle,
      body: src.body,
      image_url: src.image_url,
      cta_label: src.cta_label,
      cta_href: src.cta_href,
      order_index: src.order_index,
      is_active: src.is_active,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      await supabase.from('page_blocks').update(data).eq('id', existing.id);
    } else {
      await supabase.from('page_blocks').insert(data);
    }
  }

  revalidatePageInAllLocales(src.page_key);
  revalidatePath('/admin/page-blocks');
}

/**
 * Bump a block's order_index up or down (±15) so editors can rearrange the
 * section order on the per-page editor without dragging. Components fetch
 * blocks order_index ascending, so 'up' moves the section earlier on screen.
 */
export async function reorderBlock(id: string, direction: 'up' | 'down') {
  const supabase = await createClient();
  const { data: current } = await supabase
    .from('page_blocks')
    .select('order_index, page_key')
    .eq('id', id)
    .maybeSingle();
  if (!current) return;
  const delta = direction === 'up' ? -15 : 15;
  await supabase
    .from('page_blocks')
    .update({ order_index: Math.max(0, (current.order_index ?? 0) + delta) })
    .eq('id', id);
  revalidatePageInAllLocales(current.page_key);
  revalidatePath('/admin/page-blocks');
}
