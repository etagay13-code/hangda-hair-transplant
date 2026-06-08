'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { StorageBucket } from '@/types';

const ALLOWED_BUCKETS: StorageBucket[] = ['gallery', 'blog', 'team', 'general'];

function assertBucket(bucket: string): asserts bucket is StorageBucket {
  if (!(ALLOWED_BUCKETS as string[]).includes(bucket)) {
    throw new Error('Invalid bucket');
  }
}

export async function deleteMediaFile(bucket: string, path: string) {
  assertBucket(bucket);
  // Verify the user is logged in via the auth-cookie client before we use
  // the admin client to actually delete (which bypasses RLS).
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const admin = createAdminClient();
  const { error } = await admin.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/media');
}
