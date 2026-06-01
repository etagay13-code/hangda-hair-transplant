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
    name: str(form.get('name')),
    country: nullable(form.get('country')),
    rating: int(form.get('rating')) ?? 5,
    comment: nullable(form.get('comment')),
    technique: nullable(form.get('technique')),
    grafts: int(form.get('grafts')),
    image_url: nullable(form.get('image_url')),
    video_url: nullable(form.get('video_url')),
    locale: str(form.get('locale')) || 'en',
    is_active: bool(form.get('is_active')),
    is_featured: bool(form.get('is_featured')),
  };
}

export async function createTestimonial(form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  if (!data.name) throw new Error('Name required');
  const { error } = await supabase.from('testimonials').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/testimonials');
  redirect('/admin/testimonials');
}

export async function updateTestimonial(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('testimonials').update(payload(form)).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/testimonials');
  revalidatePath(`/admin/testimonials/${id}`);
  redirect('/admin/testimonials');
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/testimonials');
}
