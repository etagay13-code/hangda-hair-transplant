import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { MenuItemForm } from '../MenuItemForm';
import { updateNavItem } from '../actions';
import type { NavItem } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMenuItemPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('nav_items').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const item = data as NavItem;

  const action = updateNavItem.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={item.label}
        description={`${item.group_key} · ${item.locale}`}
        actions={
          <Link
            href="/admin/menu"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            ← Back
          </Link>
        }
      />
      <MenuItemForm action={action} defaults={item} submitLabel="Save changes" />
    </div>
  );
}
