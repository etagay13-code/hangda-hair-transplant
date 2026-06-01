'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

function str(v: FormDataEntryValue | null) {
  return ((v as string | null) ?? '').trim();
}
function nullable(v: FormDataEntryValue | null) {
  const s = str(v);
  return s.length > 0 ? s : null;
}
function bool(v: FormDataEntryValue | null) {
  return str(v) === 'on' || str(v) === 'true';
}

export async function upsertFormRedirect(form: FormData) {
  const supabase = await createClient();
  const form_name = str(form.get('form_name'));
  if (!form_name) throw new Error('Form name required');
  const data = {
    form_name,
    success_url: nullable(form.get('success_url')),
    email_to: nullable(form.get('email_to')),
    email_cc: nullable(form.get('email_cc')),
    webhook_url: nullable(form.get('webhook_url')),
    is_active: bool(form.get('is_active')),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('form_redirects')
    .upsert(data, { onConflict: 'form_name' });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/forms');
}

export async function deleteFormRedirect(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('form_redirects').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/forms');
}
