'use client';

import { useState } from 'react';

export interface ContentSection {
  title: string;
  body: string;
}

interface Props {
  name: string; // form field name — value is a JSON-stringified array
  defaultValue?: ContentSection[];
}

/**
 * Client-side repeater for service detail page sections. Replaces the old
 * "Long content (HTML)" textarea with a structured list — each section has
 * its own title + body, rendered as h2 + paragraph on the public site.
 * Outputs the array as JSON in a hidden input so the server action can
 * parse it without a custom form encoding.
 */
export function ContentSectionsEditor({ name, defaultValue = [] }: Props) {
  const [sections, setSections] = useState<ContentSection[]>(
    defaultValue.length > 0 ? defaultValue : []
  );

  const update = (i: number, patch: Partial<ContentSection>) => {
    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  };

  const move = (i: number, dir: -1 | 1) => {
    setSections((prev) => {
      const target = i + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[target]] = [next[target], next[i]];
      return next;
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Sayfa bölümleri</h3>
          <p className="text-xs text-slate-500">
            Hizmet detay sayfasının ana içeriği. Her bölüm sayfada h2 + paragraf
            olarak çıkar. HTML yerine sade metin yazın.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setSections((prev) => [...prev, { title: '', body: '' }])
          }
          className="rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-primary-dark)]"
        >
          + Bölüm ekle
        </button>
      </div>

      {sections.length === 0 && (
        <p className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-xs text-slate-500">
          Henüz bölüm yok. &quot;+ Bölüm ekle&quot; ile ilkini ekleyin
          (örn. başlık: &quot;Bu prosedüre kimlere uygundur?&quot;).
        </p>
      )}

      {sections.map((s, i) => (
        <div
          key={i}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Bölüm #{i + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="grid h-6 w-6 place-items-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30"
                aria-label="Yukarı"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === sections.length - 1}
                className="grid h-6 w-6 place-items-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30"
                aria-label="Aşağı"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() =>
                  setSections((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="ml-2 rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600 hover:bg-red-100"
              >
                Sil
              </button>
            </div>
          </div>
          <label className="mt-3 block">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Bölüm başlığı
            </span>
            <input
              value={s.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="Örn: Bu prosedüre kimlere uygundur?"
              className="input-field mt-1.5 w-full"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Bölüm metni
            </span>
            <textarea
              value={s.body}
              onChange={(e) => update(i, { body: e.target.value })}
              rows={4}
              placeholder="Paragraflarla yazın. Boş satır = yeni paragraf."
              className="input-field mt-1.5 w-full"
            />
          </label>
        </div>
      ))}

      <input type="hidden" name={name} value={JSON.stringify(sections)} />
    </div>
  );
}
