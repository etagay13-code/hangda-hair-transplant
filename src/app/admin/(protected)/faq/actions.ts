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
    question: str(form.get('question')),
    answer: str(form.get('answer')),
    category: str(form.get('category')) || 'general',
    locale: str(form.get('locale')) || 'en',
    order_index: int(form.get('order_index')),
    is_active: bool(form.get('is_active')),
  };
}

export async function createFaq(form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  if (!data.question || !data.answer) throw new Error('Question and answer required');
  const { error } = await supabase.from('faq').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/faq');
  redirect('/admin/faq');
}

export async function updateFaq(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('faq').update(payload(form)).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/faq');
  redirect('/admin/faq');
}

export async function deleteFaq(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('faq').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/faq');
}
