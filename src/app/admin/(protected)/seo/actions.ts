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

function payload(form: FormData) {
  return {
    page_key: str(form.get('page_key')),
    locale: str(form.get('locale')) || 'en',
    title: nullable(form.get('title')),
    description: nullable(form.get('description')),
    og_image: nullable(form.get('og_image')),
    keywords: nullable(form.get('keywords')),
    canonical_url: nullable(form.get('canonical_url')),
  };
}

export async function upsertPageSeo(form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  if (!data.page_key) throw new Error('Page key required');
  const { error } = await supabase
    .from('page_seo')
    .upsert(data, { onConflict: 'page_key,locale' });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/seo');
  revalidatePath('/', 'layout');
  redirect('/admin/seo');
}

export async function deletePageSeo(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('page_seo').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/seo');
}
