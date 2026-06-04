import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { BlockForm } from '../BlockForm';
import { updateBlock } from '../actions';
import type { PageBlock } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlockPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('page_blocks').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const block = data as PageBlock;

  const action = updateBlock.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${block.page_key} · ${block.section_key}`}
        description={`Locale: ${block.locale}`}
        actions={
          <Link
            href="/admin/page-blocks"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            ← Back
          </Link>
        }
      />
      <BlockForm action={action} defaults={block} lockIdentity submitLabel="Save changes" />
    </div>
  );
}
