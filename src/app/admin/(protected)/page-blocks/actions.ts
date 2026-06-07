'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { routing } from '@/i18n/routing';

function str(v: FormDataEntryValue | null) {
  return ((v as string | null) ?? '').trim();
}
function nullable(v: FormDataEntryValue | null) {
  const s = str(v);
  return s.length > 0 ? s : null;
}
function int(v: FormDataEntryValue | null): number {
  const s = str(v);
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}
function bool(v: FormDataEntryValue | null) {
  return str(v) === 'on' || str(v) === 'true';
}

function payload(form: FormData) {
  return {
    page_key: str(form.get('page_key')),
    section_key: str(form.get('section_key')),
    locale: str(form.get('locale')) || 'all',
    eyebrow: nullable(form.get('eyebrow')),
    title: nullable(form.get('title')),
    subtitle: nullable(form.get('subtitle')),
    body: nullable(form.get('body')),
    image_url: nullable(form.get('image_url')),
    cta_label: nullable(form.get('cta_label')),
    cta_href: nullable(form.get('cta_href')),
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
  revalidatePageInAllLocales(data.page_key);
  revalidatePath('/admin/page-blocks');
  revalidatePath(`/admin/page-blocks/${id}`);
  redirect('/admin/page-blocks');
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
