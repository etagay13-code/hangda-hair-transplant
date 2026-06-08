'use client';

import { useState } from 'react';

interface Props {
  url: string;
  name: string;
  size?: string;
  bucket: string;
  path: string;
  onDelete: (bucket: string, path: string) => Promise<void>;
}

export function MediaCard({ url, name, size, bucket, path, onDelete }: Props) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt('Copy this URL:', url);
    }
  }

  async function handleDelete() {
    if (!confirm(`"${name}" dosyasını silmek istiyor musunuz? Bu işlem geri alınamaz.`)) {
      return;
    }
    setDeleting(true);
    try {
      await onDelete(bucket, path);
    } catch (err) {
      alert(`Silinemedi: ${(err as Error).message}`);
      setDeleting(false);
    }
  }

  return (
    <div className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={copy}
        className="relative block aspect-square w-full bg-slate-100"
        title="URL'i kopyala"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={name} className="absolute inset-0 h-full w-full object-cover" />
        <span className="absolute right-2 top-2 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">
          {copied ? '✓ kopyalandı' : 'URL kopyala'}
        </span>
      </button>
      <div className="space-y-1.5 p-3">
        <p className="truncate text-xs font-semibold text-slate-700" title={name}>
          {name}
        </p>
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{size ?? ''}</span>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? '...' : 'Sil'}
          </button>
        </div>
      </div>
    </div>
  );
}
