import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { FaqForm } from '../FaqForm';
import { updateFaq } from '../actions';
import type { Faq } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('faq').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const q = data as Faq;

  const action = updateFaq.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit FAQ"
        description={q.question}
        actions={
          <Link
            href="/admin/faq"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            ← Back
          </Link>
        }
      />
      <FaqForm action={action} defaults={q} submitLabel="Save changes" />
    </div>
  );
}
