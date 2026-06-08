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
  // Each gallery item is a single composite image (before+after baked
  // together). We store it in before_image_url and leave after_image_url
  // NULL so the public renderers all show a single image card.
  return {
    patient_code: nullable(form.get('patient_code')),
    category: str(form.get('category')) || 'hair',
    technique: nullable(form.get('technique')),
    grafts: int(form.get('grafts')),
    months_after: int(form.get('months_after')),
    before_image_url: nullable(form.get('image_url')),
    after_image_url: null,
    description: nullable(form.get('description')),
    locale: str(form.get('locale')) || 'en',
    is_active: bool(form.get('is_active')),
    order_index: int(form.get('order_index')) ?? 0,
    service_slug: nullable(form.get('service_slug')),
  };
}

export async function createGallery(form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('gallery').insert(payload(form) as never);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/gallery');
  revalidatePath('/', 'layout'); // gallery shows on home + service detail pages
  redirect('/admin/gallery');
}

export async function updateGallery(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('gallery').update(payload(form) as never).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/gallery');
  revalidatePath(`/admin/gallery/${id}`);
  revalidatePath('/', 'layout');
  redirect('/admin/gallery');
}

export async function deleteGallery(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/gallery');
  revalidatePath('/', 'layout');
}
