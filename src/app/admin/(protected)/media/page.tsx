import Link from 'next/link';
import {
  FolderOpen,
  Image as ImageIcon,
  PenLine,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/Toolbar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { MediaCard } from '@/components/admin/MediaCard';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { createAdminClient } from '@/lib/supabase/admin';
import { deleteMediaFile } from './actions';
import type { StorageBucket } from '@/types';

export const dynamic = 'force-dynamic';

const BUCKETS: { key: StorageBucket; label: string; Icon: LucideIcon }[] = [
  { key: 'general', label: 'Genel', Icon: FolderOpen },
  { key: 'gallery', label: 'Galeri', Icon: ImageIcon },
  { key: 'blog', label: 'Blog', Icon: PenLine },
  { key: 'team', label: 'Ekip', Icon: Users },
];

interface FileEntry {
  name: string;
  path: string;
  url: string;
  size?: number;
  updated_at?: string;
}

interface Props {
  searchParams: Promise<{ bucket?: string }>;
}

function formatSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Walk the bucket recursively so files in subfolders (services/, before/,
// page-blocks/...) all show up.
async function listBucketFiles(bucket: StorageBucket): Promise<FileEntry[]> {
  const admin = createAdminClient();
  const all: FileEntry[] = [];

  async function walk(prefix: string) {
    const { data, error } = await admin.storage.from(bucket).list(prefix, {
      limit: 1000,
      sortBy: { column: 'updated_at', order: 'desc' },
    });
    if (error || !data) return;
    for (const entry of data) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      // Folders in Supabase Storage show up as zero-byte entries with no id.
      // We probe recursively when a path looks like a folder.
      if (!entry.id) {
        await walk(path);
        continue;
      }
      const { data: pub } = admin.storage.from(bucket).getPublicUrl(path);
      all.push({
        name: entry.name,
        path,
        url: pub.publicUrl,
        size: (entry.metadata as { size?: number } | null)?.size,
        updated_at: entry.updated_at ?? entry.created_at ?? undefined,
      });
    }
  }

  await walk('');
  return all;
}

export default async function MediaPage({ searchParams }: Props) {
  const { bucket: rawBucket } = await searchParams;
  const bucket = (BUCKETS.find((b) => b.key === rawBucket)?.key ?? 'general') as StorageBucket;

  const files = await listBucketFiles(bucket);

  return (
    <>
      <AdminTopbar crumb="Medya Kütüphanesi" hideLocale />
      <div className="px-8 py-8">
        <PageHeader
          title="Medya Kütüphanesi"
          description="Yüklediğiniz tüm görsel ve medyalar. URL'i kopyalayıp herhangi bir alanda kullanabilir, yenisini yükleyebilir veya silebilirsiniz."
        />

        <div className="mt-6 space-y-6">
          <MediaUploader defaultBucket={bucket} />

          <div className="flex flex-wrap items-center gap-2">
            {BUCKETS.map((b) => {
              const active = b.key === bucket;
              return (
                <Link
                  key={b.key}
                  href={`/admin/media?bucket=${b.key}`}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'border border-slate-300 bg-white text-slate-600 hover:border-[var(--color-primary)]'
                  }`}
                >
                  <b.Icon size={14} strokeWidth={1.8} />
                  <span>{b.label}</span>
                </Link>
              );
            })}
            <span className="ml-2 text-xs text-slate-500">
              {files.length} dosya
            </span>
          </div>

          {files.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-sm text-slate-500">
              Bu klasörde henüz medya yok. Yukarıdan yükleyin.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {files.map((f) => (
                <MediaCard
                  key={`${bucket}/${f.path}`}
                  url={f.url}
                  name={f.name}
                  size={formatSize(f.size)}
                  bucket={bucket}
                  path={f.path}
                  onDelete={deleteMediaFile}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
