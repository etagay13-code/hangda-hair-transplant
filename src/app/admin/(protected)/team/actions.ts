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
    title: nullable(form.get('title')),
    bio: nullable(form.get('bio')),
    image_url: nullable(form.get('image_url')),
    specialization: nullable(form.get('specialization')),
    locale: str(form.get('locale')) || 'en',
    order_index: int(form.get('order_index')) ?? 0,
    is_active: bool(form.get('is_active')),
  };
}

export async function createMember(form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  if (!data.name) throw new Error('Name required');
  const { error } = await supabase.from('team_members').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/team');
  redirect('/admin/team');
}

export async function updateMember(id: string, form: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('team_members').update(payload(form)).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/team');
  revalidatePath(`/admin/team/${id}`);
  redirect('/admin/team');
}

export async function deleteMember(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('team_members').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/team');
}
