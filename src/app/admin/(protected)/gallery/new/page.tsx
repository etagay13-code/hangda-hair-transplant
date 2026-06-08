import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { GalleryForm } from '../GalleryForm';
import { createGallery } from '../actions';

export default async function NewGalleryPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from('services')
    .select('slug,title')
    .eq('locale', 'en')
    .order('order_index', { ascending: true });
  const serviceOptions = (services ?? []).map((s) => ({ slug: s.slug, title: s.title }));

  return (
    <div className="space-y-6">
      <PageHeader title="New gallery item" description="Add a before/after result pair." />
      <GalleryForm
        action={createGallery}
        defaults={{ is_active: true, locale: 'en', order_index: 0, category: 'hair' }}
        services={serviceOptions}
        submitLabel="Create"
      />
    </div>
  );
}
