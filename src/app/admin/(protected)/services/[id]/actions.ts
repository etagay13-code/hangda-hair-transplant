'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * Remove the service_slug tag from a gallery case so it stops appearing
 * on this service's detail page. The case itself is kept — it still shows
 * on /gallery and can be reassigned. Used by the "Hizmetten kaldır" button
 * on the service edit screen.
 */
export async function unlinkCaseFromService(galleryId: string, serviceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('gallery')
    .update({ service_slug: null } as never)
    .eq('id', galleryId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/gallery');
  revalidatePath(`/admin/services`);
  revalidatePath('/', 'layout');
  // Force the service edit page to re-render the empty case list
  // without a redirect (caller stays on the same page).
  if (serviceSlug) {
    revalidatePath(`/en/services/${serviceSlug}`);
    revalidatePath(`/nl/services/${serviceSlug}`);
    revalidatePath(`/tr/services/${serviceSlug}`);
  }
}
