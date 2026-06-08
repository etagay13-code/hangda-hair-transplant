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

// Multiline textareas — each non-empty line is a separate bullet point.
function lines(v: FormDataEntryValue | null): string[] {
  return str(v)
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

// The ContentSectionsEditor hidden input is a JSON-stringified array of
// { title, body } pairs. Empty / malformed → [].
function parseSections(v: FormDataEntryValue | null): Array<{ title: string; body: string }> {
  const raw = str(v);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s) => s && typeof s === 'object')
      .map((s) => ({
        title: typeof s.title === 'string' ? s.title.trim() : '',
        body: typeof s.body === 'string' ? s.body.trim() : '',
      }))
      .filter((s) => s.title.length > 0 || s.body.length > 0);
  } catch {
    return [];
  }
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
    content_sections: parseSections(form.get('content_sections')) as never,
    included_items: lines(form.get('included_items')) as never,
    eligibility_yes: lines(form.get('eligibility_yes')) as never,
    eligibility_no: lines(form.get('eligibility_no')) as never,
    who_for_eyebrow: nullable(form.get('who_for_eyebrow')),
    who_for_title: nullable(form.get('who_for_title')),
    who_for_subtitle: nullable(form.get('who_for_subtitle')),
  };
}

export async function createService(form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  if (!data.slug || !data.title) throw new Error('Slug and title are required');
  const { error } = await supabase.from('services').insert(data as never);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/services');
  revalidatePath('/', 'layout');
  redirect(`/admin/services?locale=${data.locale}`);
}

export async function updateService(id: string, form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  if (!data.slug || !data.title) throw new Error('Slug and title are required');
  const { error } = await supabase.from('services').update(data as never).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/services');
  revalidatePath(`/admin/services/${id}`);
  revalidatePath('/', 'layout');
  redirect(`/admin/services?locale=${data.locale}`);
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/services');
  revalidatePath('/', 'layout');
}
