'use client';

import { useState } from 'react';
import type { StorageBucket } from '@/types';

interface Props {
  name: string;
  label: string;
  bucket: StorageBucket;
  folder?: string;
  defaultUrl?: string | null;
}

export function ImageUploadField({ name, label, bucket, folder, defaultUrl }: Props) {
  const [url, setUrl] = useState(defaultUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <label className="label-field">{label}</label>
      <div className="mt-2 flex items-center gap-4">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="h-20 w-20 rounded-md border border-slate-200 object-cover"
          />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-md border border-dashed border-slate-300 text-xs text-slate-400">
            None
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input type="hidden" name={name} value={url} />
          <input
            type="text"
            placeholder="Image URL (or use upload)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-field"
          />
          <input type="file" accept="image/*" onChange={onChange} disabled={uploading} />
          {uploading && <p className="text-xs text-slate-500">Uploading…</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
