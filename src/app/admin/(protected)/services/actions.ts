'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function str(v: FormDataEntryValue | null) {
  return ((v as string | null) ?? '').trim();
}
function nullable(v: FormDataEntryValue | null) {
  const s = str(v);
  return s.length > 0 ? s : null;
}
function int(v: FormDataEntryValue | null): number | null {
  const s = str(v);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}
function bool(v: FormDataEntryValue | null) {
  return str(v) === 'on' || str(v) === 'true';
}

function payload(form: FormData) {
  return {
    slug: str(form.get('slug')),
    title: str(form.get('title')),
    short_description: nullable(form.get('short_description')),
    description: nullable(form.get('description')),
    content: nullable(form.get('content')),
    image_url: nullable(form.get('image_url')),
    icon: nullable(form.get('icon')),
    price_from: int(form.get('price_from')),
    duration: nullable(form.get('duration')),
    locale: str(form.get('locale')) || 'en',
    order_index: int(form.get('order_index')) ?? 0,
    is_active: bool(form.get('is_active')),
    meta_title: nullable(form.get('meta_title')),
    meta_description: nullable(form.get('meta_description')),
  };
}

export async function createService(form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  if (!data.slug || !data.title) throw new Error('Slug and title are required');
  const { error } = await supabase.from('services').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/services');
  redirect(`/admin/services?locale=${data.locale}`);
}

export async function updateService(id: string, form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  if (!data.slug || !data.title) throw new Error('Slug and title are required');
  const { error } = await supabase.from('services').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/services');
  revalidatePath(`/admin/services/${id}`);
  redirect(`/admin/services?locale=${data.locale}`);
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/services');
}
