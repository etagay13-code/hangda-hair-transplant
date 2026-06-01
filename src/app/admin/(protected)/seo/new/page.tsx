import { PageHeader } from '@/components/admin/Toolbar';
import { SeoForm } from '../SeoForm';
import { upsertPageSeo } from '../actions';

export default function NewSeoPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New SEO entry" description="Add metadata for a new page/locale pair." />
      <SeoForm action={upsertPageSeo} defaults={{ locale: 'en' }} submitLabel="Create" />
    </div>
  );
}
