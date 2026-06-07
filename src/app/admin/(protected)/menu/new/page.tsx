import { PageHeader } from '@/components/admin/Toolbar';
import { MenuItemForm } from '../MenuItemForm';
import { createNavItem } from '../actions';

export default function NewMenuItemPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New menu item" description="Add a link to the navbar or footer." />
      <MenuItemForm
        action={createNavItem}
        defaults={{ is_active: true, locale: 'all', group_key: 'primary', target: '_self', order_index: 100 }}
        submitLabel="Create"
      />
    </div>
  );
}
