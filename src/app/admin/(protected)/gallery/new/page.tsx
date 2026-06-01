import { PageHeader } from '@/components/admin/Toolbar';
import { GalleryForm } from '../GalleryForm';
import { createGallery } from '../actions';

export default function NewGalleryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New gallery item" description="Add a before/after result pair." />
      <GalleryForm
        action={createGallery}
        defaults={{ is_active: true, locale: 'en', order_index: 0, category: 'hair' }}
        submitLabel="Create"
      />
    </div>
  );
}
