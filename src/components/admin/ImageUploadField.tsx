'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import type { StorageBucket } from '@/types';

interface Props {
  name: string;
  label: string;
  bucket: StorageBucket;
  folder?: string;
  defaultUrl?: string | null;
  /** 'light' (default) for white-card admin forms, 'dark' for the
   *  section editor cards which sit on slate-900. */
  variant?: 'light' | 'dark';
}

export function ImageUploadField({
  name,
  label,
  bucket,
  folder,
  defaultUrl,
  variant = 'light',
}: Props) {
  const [url, setUrl] = useState(defaultUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dark = variant === 'dark';

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('bucket', bucket);
      if (folder) fd.append('folder', folder);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success && json.url) {
        setUrl(json.url);
      } else {
        setError(json.error || 'Upload failed');
      }
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label
        className={`block text-[11px] font-semibold uppercase tracking-widest ${
          dark ? 'text-slate-400' : 'text-slate-700'
        }`}
      >
        {label}
      </label>
      <div className="mt-2 flex items-start gap-4">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className={`h-20 w-20 shrink-0 rounded-md object-cover ${
              dark ? 'ring-1 ring-slate-700' : 'border border-slate-200'
            }`}
          />
        ) : (
          <div
            className={`grid h-20 w-20 shrink-0 place-items-center rounded-md border-2 border-dashed text-xs ${
              dark
                ? 'border-slate-700 bg-slate-900/50 text-slate-500'
                : 'border-slate-300 text-slate-400'
            }`}
          >
            None
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input type="hidden" name={name} value={url} />
          <input
            type="text"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={
              dark
                ? 'admin-input w-full'
                : 'input-field'
            }
          />
          <label
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed px-3 py-2 text-xs font-medium transition ${
              dark
                ? 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10'
                : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
            }`}
          >
            <Upload size={14} strokeWidth={1.8} />
            <span>
              {uploading ? 'Yükleniyor...' : 'Dosya seç (veya buraya tıkla)'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={onChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
