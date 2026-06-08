'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { routing } from '@/i18n/routing';

// Collection tables we expose to the inline section editor. Restricted
// list keeps a stray `table` form value from turning into a generic delete.
const ALLOWED_TABLES = [
  'gallery',
  'services',
  'testimonials',
  'faq',
  'team_members',
  'blog_posts',
] as const;
type Table = (typeof ALLOWED_TABLES)[number];

function pathFor(pageKey: string) {
  return pageKey === 'home' ? '' : `/${pageKey}`;
}

function revalidateAllLocales(pageKey: string) {
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}${pathFor(pageKey)}`);
  }
  revalidatePath('/', 'layout');
}

function assertTable(table: string): asserts table is Table {
  if (!(ALLOWED_TABLES as readonly string[]).includes(table)) {
    throw new Error(`Bu tablo (${table}) inline yönetim için yetkili değil.`);
  }
}

export async function deleteCollectionItem(
  table: string,
  id: string,
  pageKey: string
) {
  assertTable(table);
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidateAllLocales(pageKey);
  revalidatePath(`/admin/pages/${pageKey}`);
}

export async function toggleCollectionItemActive(
  table: string,
  id: string,
  pageKey: string
) {
  assertTable(table);
  const supabase = await createClient();
  const { data } = await supabase
    .from(table)
    .select('is_active')
    .eq('id', id)
    .maybeSingle<{ is_active: boolean | null }>();
  if (!data) return;
  await supabase
    .from(table)
    .update({ is_active: !data.is_active } as never)
    .eq('id', id);
  revalidateAllLocales(pageKey);
  revalidatePath(`/admin/pages/${pageKey}`);
}

export async function reorderCollectionItem(
  table: string,
  id: string,
  direction: 'up' | 'down',
  pageKey: string
) {
  assertTable(table);
  const supabase = await createClient();
  const { data } = await supabase
    .from(table)
    .select('order_index')
    .eq('id', id)
    .maybeSingle<{ order_index: number | null }>();
  if (!data) return;
  const delta = direction === 'up' ? -15 : 15;
  await supabase
    .from(table)
    .update({ order_index: Math.max(0, (data.order_index ?? 0) + delta) } as never)
    .eq('id', id);
  revalidateAllLocales(pageKey);
  revalidatePath(`/admin/pages/${pageKey}`);
}

/**
 * Create a missing page_blocks row. Used when an admin tries to edit a
 * section that doesn't have a row yet (e.g., newly added 'departments').
 * Returns the new id so the caller can redirect to its inline editor.
 */
export async function createMissingBlock(
  pageKey: string,
  sectionKey: string,
  locale: string
) {
  const supabase = await createClient();
  // Skip if it already exists
  const { data: existing } = await supabase
    .from('page_blocks')
    .select('id')
    .eq('page_key', pageKey)
    .eq('section_key', sectionKey)
    .eq('locale', locale)
    .maybeSingle();
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from('page_blocks')
    .insert({
      page_key: pageKey,
      section_key: sectionKey,
      locale,
      is_active: true,
      order_index: 9999,
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  revalidateAllLocales(pageKey);
  revalidatePath(`/admin/pages/${pageKey}`);
  return data.id;
}
