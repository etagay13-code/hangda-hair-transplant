'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Upload, FolderOpen } from 'lucide-react';
import type { StorageBucket } from '@/types';

interface Props {
  defaultBucket?: StorageBucket;
}

export function MediaUploader({ defaultBucket = 'general' }: Props) {
  const router = useRouter();
  const [bucket, setBucket] = useState<StorageBucket>(defaultBucket);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList) {
    setUploading(true);
    setError(null);
    let okCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress(`${i + 1} / ${files.length} · ${file.name}`);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('bucket', bucket);
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        const json = await res.json();
        if (json.success) okCount++;
        else setError(json.error || 'Yüklenemedi');
      } catch {
        setError('Bağlantı hatası');
      }
    }
    setProgress(null);
    setUploading(false);
    if (okCount > 0) {
      // Refetch the list
      router.refresh();
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <Upload size={18} strokeWidth={1.8} className="text-[var(--color-primary-darker)]" />
            <span>Medya Yükle</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            JPG, PNG, WebP, AVIF, GIF · max 10 MB · birden fazla dosya seçilebilir
          </p>
        </div>
        <label className="text-sm">
          <span className="text-xs font-medium text-slate-600">Hangi klasöre?</span>
          <select
            value={bucket}
            onChange={(e) => setBucket(e.target.value as StorageBucket)}
            className="ml-2 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm"
            disabled={uploading}
          >
            <option value="general">Genel (sayfa içerikleri)</option>
            <option value="gallery">Galeri (vakalar)</option>
            <option value="blog">Blog</option>
            <option value="team">Ekip</option>
          </select>
        </label>
      </div>

      <label className="mt-4 flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-600 transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5">
        <FolderOpen size={26} strokeWidth={1.5} className="text-slate-400" />
        <span>
          {uploading
            ? progress ?? 'Yükleniyor...'
            : 'Dosya seçmek için tıkla veya buraya sürükle'}
        </span>
        <input
          type="file"
          multiple
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              void upload(e.target.files);
              e.target.value = '';
            }
          }}
          className="hidden"
        />
      </label>

      {error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
