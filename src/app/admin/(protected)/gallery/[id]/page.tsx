import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { GalleryForm } from '../GalleryForm';
import { updateGallery } from '../actions';
import type { GalleryItem } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditGalleryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('gallery').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const item = data as GalleryItem;

  const action = updateGallery.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${item.patient_code || 'gallery item'}`}
        description="Update images and metadata."
        actions={
          <Link
            href="/admin/gallery"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            ← Back
          </Link>
        }
      />
      <GalleryForm action={action} defaults={item} submitLabel="Save changes" />
    </div>
  );
}
