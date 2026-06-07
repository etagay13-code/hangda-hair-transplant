import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { BlockForm } from '../BlockForm';
import { updateBlock, syncBlockToAllLocales } from '../actions';
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
  const sync = async () => {
    'use server';
    await syncBlockToAllLocales(id);
  };

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

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-primary-darker)]">
          Copy this content to other locales
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Push the current eyebrow, title, subtitle, body, image and CTA values from
          this <strong>{block.locale}</strong> row into the matching{' '}
          {block.locale === 'all'
            ? 'EN, NL and TR rows'
            : 'rows for the other locales'}{' '}
          for <code className="rounded bg-slate-100 px-1 py-0.5 text-xs font-mono">{block.page_key}/{block.section_key}</code>.
          Existing locale rows are overwritten — make sure this row is the version you want everywhere first.
        </p>
        <form action={sync} className="mt-5">
          <button
            type="submit"
            className="rounded-md border border-[var(--color-primary)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-primary-darker)] transition hover:bg-[var(--color-primary)]/10"
          >
            Sync to other locales
          </button>
        </form>
      </div>
    </div>
  );
}
