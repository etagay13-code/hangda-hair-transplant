import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NewButton, PageHeader } from '@/components/admin/Toolbar';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteGallery } from './actions';
import type { GalleryItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function GalleryAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('gallery')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false });
  const rows = (data ?? []) as GalleryItem[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        description="Manage before & after results."
        actions={<NewButton href="/admin/gallery/new" />}
      />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
          No gallery items yet.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((g) => {
            const del = async () => {
              'use server';
              await deleteGallery(g.id);
            };
            return (
              <div key={g.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-slate-100">
                  {g.before_image_url || g.after_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={(g.before_image_url || g.after_image_url) as string}
                      alt={g.patient_code ?? ''}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-slate-400">
                      Görsel yok
                    </div>
                  )}
                </div>
                <div className="space-y-1 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--color-primary-darker)]">
                      {g.patient_code || 'Untitled'}
                    </span>
                    <span className="text-xs uppercase text-slate-500">{g.locale}</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    {[g.technique, g.grafts ? `${g.grafts} grafts` : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <Link
                      href={`/admin/gallery/${g.id}`}
                      className="text-xs font-medium text-[var(--color-primary-dark)] hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={del} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
