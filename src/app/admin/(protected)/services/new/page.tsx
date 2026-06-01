import { PageHeader } from '@/components/admin/Toolbar';
import { ServiceForm } from '../ServiceForm';
import { createService } from '../actions';

interface Props {
  searchParams: Promise<{ locale?: string }>;
}

export default async function NewServicePage({ searchParams }: Props) {
  const { locale } = await searchParams;
  return (
    <div className="space-y-6">
      <PageHeader title="New Service" description="Add a treatment to the public services list." />
      <ServiceForm
        action={createService}
        defaults={{ locale: locale ?? 'en', is_active: true, order_index: 0 }}
        submitLabel="Create"
      />
    </div>
  );
}
