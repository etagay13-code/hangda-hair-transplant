import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { ServiceForm } from '../ServiceForm';
import { updateService } from '../actions';
import type { Service } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('services').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const service = data as Service;

  const action = updateService.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={service.title}
        description="Edit this service entry."
        actions={
          <Link
            href="/admin/services"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            ← Back
          </Link>
        }
      />
      <ServiceForm action={action} defaults={service} submitLabel="Save changes" />
    </div>
  );
}
