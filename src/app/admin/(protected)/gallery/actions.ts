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
  // The form has two modes:
  // 1. Default — a single 'image_url' field (the combined before/after image).
  //    We write it to BOTH before_image_url and after_image_url so the public
  //    render falls into Gallery's "combined" branch (single image card).
  // 2. Advanced details — explicit 'before_image_url_explicit' and
  //    'after_image_url_explicit'. If either is provided, they take precedence
  //    over the single field.
  const singleImage = nullable(form.get('image_url'));
  const explicitBefore = nullable(form.get('before_image_url_explicit'));
  const explicitAfter = nullable(form.get('after_image_url_explicit'));
  const before = explicitBefore ?? singleImage;
  const after = explicitAfter ?? singleImage;
  return {
    patient_code: nullable(form.get('patient_code')),
    category: str(form.get('category')) || 'hair',
    technique: nullable(form.get('technique')),
    grafts: int(form.get('grafts')),
    months_after: int(form.get('months_after')),
    before_image_url: before,
    after_image_url: after,
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
