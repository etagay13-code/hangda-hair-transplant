import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { SeoForm } from '../SeoForm';
import { upsertPageSeo } from '../actions';
import type { PageSeo } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSeoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('page_seo').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const entry = data as PageSeo;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`/${entry.page_key} (${entry.locale})`}
        description="Edit SEO metadata for this page/locale."
        actions={
          <Link
            href="/admin/seo"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            ← Back
          </Link>
        }
      />
      <SeoForm action={upsertPageSeo} defaults={entry} lockKey submitLabel="Save changes" />
    </div>
  );
}
