import { PageHeader } from '@/components/admin/Toolbar';
import { FaqForm } from '../FaqForm';
import { createFaq } from '../actions';

interface Props {
  searchParams: Promise<{ locale?: string }>;
}

export default async function NewFaqPage({ searchParams }: Props) {
  const { locale } = await searchParams;
  return (
    <div className="space-y-6">
      <PageHeader title="New FAQ" description="Add a question and answer." />
      <FaqForm
        action={createFaq}
        defaults={{ locale: locale ?? 'en', is_active: true, order_index: 0, category: 'general' }}
        submitLabel="Create"
      />
    </div>
  );
}
