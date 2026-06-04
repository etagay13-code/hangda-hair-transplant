import { PageHeader } from '@/components/admin/Toolbar';
import { BlockForm } from '../BlockForm';
import { createBlock } from '../actions';

export default function NewBlockPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New block" description="Add a new section block for any page and locale." />
      <BlockForm
        action={createBlock}
        defaults={{ is_active: true, locale: 'all', order_index: 0 }}
        submitLabel="Create"
      />
    </div>
  );
}
