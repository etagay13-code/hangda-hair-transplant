'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function saveSettings(formData: FormData) {
  const supabase = await createClient();
  const ids = formData.getAll('id') as string[];

  const updates = ids
    .map((id, idx) => ({
      id,
      value: ((formData.getAll('value')[idx] as string) ?? '').toString(),
    }))
    .filter((u) => !!u.id);

  for (const u of updates) {
    const { error } = await supabase
      .from('site_settings')
      .update({ value: u.value })
      .eq('id', u.id);
    if (error) throw new Error(error.message);
  }

  revalidatePath('/admin/settings');
  revalidatePath('/', 'layout');
}

export async function addSetting(formData: FormData) {
  const supabase = await createClient();
  const key = ((formData.get('key') as string) ?? '').trim();
  const value = ((formData.get('value') as string) ?? '').trim();
  const category = ((formData.get('category') as string) ?? 'general').trim();
  const locale = ((formData.get('locale') as string) ?? 'all').trim();

  if (!key) throw new Error('Key is required');

  const { error } = await supabase.from('site_settings').upsert(
    {
      key,
      value: value || null,
      category,
      locale,
    },
    { onConflict: 'key,locale' }
  );
  if (error) throw new Error(error.message);
  revalidatePath('/admin/settings');
}
