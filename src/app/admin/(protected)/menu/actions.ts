'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function str(v: FormDataEntryValue | null) {
  return ((v as string | null) ?? '').trim();
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
    label: str(form.get('label')),
    href: str(form.get('href')),
    target: str(form.get('target')) || '_self',
    locale: str(form.get('locale')) || 'all',
    group_key: str(form.get('group_key')) || 'primary',
    order_index: int(form.get('order_index')),
    is_active: bool(form.get('is_active')),
  };
}

function revalidateLayout() {
  // Navbar lives in the locale layout; flushing the layout ripples to every page.
  revalidatePath('/', 'layout');
}

export async function createNavItem(form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  if (!data.label || !data.href) throw new Error('Label and href are required');
  const { error } = await supabase.from('nav_items').insert(data);
  if (error) throw new Error(error.message);
  revalidateLayout();
  revalidatePath('/admin/menu');
  redirect('/admin/menu');
}

export async function updateNavItem(id: string, form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  const { error } = await supabase.from('nav_items').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidateLayout();
  revalidatePath('/admin/menu');
  redirect('/admin/menu');
}

export async function deleteNavItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('nav_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidateLayout();
  revalidatePath('/admin/menu');
}

export async function reorderNavItem(id: string, direction: 'up' | 'down') {
  const supabase = await createClient();
  // Step ±10 keeps room for inserts; user can fine-tune in the edit form.
  const delta = direction === 'up' ? -15 : 15;
  const { data: current } = await supabase
    .from('nav_items')
    .select('order_index')
    .eq('id', id)
    .maybeSingle();
  if (!current) return;
  await supabase
    .from('nav_items')
    .update({ order_index: Math.max(0, (current.order_index ?? 0) + delta) })
    .eq('id', id);
  revalidateLayout();
  revalidatePath('/admin/menu');
}
