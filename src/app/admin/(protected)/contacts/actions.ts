'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function nullable(value: FormDataEntryValue | null) {
  const v = (value as string | null)?.trim();
  return v && v.length > 0 ? v : null;
}

export async function updateContact(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('contacts')
    .update({
      status: (formData.get('status') as string) || 'new',
      notes: nullable(formData.get('notes')),
      assigned_to: nullable(formData.get('assigned_to')),
      follow_up_date: nullable(formData.get('follow_up_date')),
    })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/contacts');
  revalidatePath(`/admin/contacts/${id}`);
  revalidatePath('/admin');
}

export async function deleteContact(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/contacts');
  redirect('/admin/contacts');
}
