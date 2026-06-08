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
  const [{ data }, { data: services }] = await Promise.all([
    supabase.from('gallery').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('services')
      .select('slug,title')
      .eq('locale', 'en')
      .order('order_index', { ascending: true }),
  ]);
  if (!data) notFound();
  const item = data as GalleryItem & { service_slug?: string | null };
  const serviceOptions = (services ?? []).map((s) => ({ slug: s.slug, title: s.title }));

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
      <GalleryForm
        action={action}
        defaults={item}
        services={serviceOptions}
        submitLabel="Save changes"
      />
    </div>
  );
}
