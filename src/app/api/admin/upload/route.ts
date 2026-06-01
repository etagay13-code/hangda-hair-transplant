import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { StorageBucket, UploadResponse } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_BUCKETS: StorageBucket[] = ['gallery', 'blog', 'team', 'general'];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

function isBucket(value: string): value is StorageBucket {
  return (ALLOWED_BUCKETS as string[]).includes(value);
}

function makeKey(originalName: string) {
  const safe = originalName
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const stamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${stamp}-${random}-${safe}`;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<UploadResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const bucketRaw = (formData.get('bucket') as string) || 'general';
    const folder = (formData.get('folder') as string) || '';

    if (!(file instanceof File)) {
      return NextResponse.json<UploadResponse>(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!isBucket(bucketRaw)) {
      return NextResponse.json<UploadResponse>(
        { success: false, error: 'Invalid bucket' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json<UploadResponse>(
        { success: false, error: 'File too large (max 10MB)' },
        { status: 413 }
      );
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json<UploadResponse>(
        { success: false, error: 'Unsupported file type' },
        { status: 415 }
      );
    }

    const key = `${folder ? folder.replace(/^\/|\/$/g, '') + '/' : ''}${makeKey(file.name)}`;
    const admin = createAdminClient();

    const { error: uploadError } = await admin.storage
      .from(bucketRaw)
      .upload(key, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json<UploadResponse>(
        { success: false, error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicUrl } = admin.storage.from(bucketRaw).getPublicUrl(key);

    return NextResponse.json<UploadResponse>({
      success: true,
      url: publicUrl.publicUrl,
      path: key,
    });
  } catch (err) {
    console.error('Upload route error:', err);
    return NextResponse.json<UploadResponse>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
