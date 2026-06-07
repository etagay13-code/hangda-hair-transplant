import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { BlockForm } from '../BlockForm';
import { updateBlock } from '../actions';
import { getRenderedField } from '@/lib/section-defaults';
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

  // Pre-fill the form with whatever the public site is currently rendering for
  // this block. When the DB row has an explicit override the override wins;
  // otherwise we surface the translation / hardcoded fallback so the editor
  // sees the live copy and can tweak it in place (WordPress / WPBakery style).
  const merged: Partial<PageBlock> = {
    ...block,
    eyebrow: block.eyebrow ?? getRenderedField(block.page_key, block.section_key, block.locale, 'eyebrow') ?? null,
    title: block.title ?? getRenderedField(block.page_key, block.section_key, block.locale, 'title') ?? null,
    subtitle: block.subtitle ?? getRenderedField(block.page_key, block.section_key, block.locale, 'subtitle') ?? null,
    body: block.body ?? getRenderedField(block.page_key, block.section_key, block.locale, 'body') ?? null,
    cta_label: block.cta_label ?? getRenderedField(block.page_key, block.section_key, block.locale, 'cta_label') ?? null,
  };

  // Saving an 'all' row should ripple to every locale-specific row that
  // already exists, so editing the master block always updates every
  // language in one shot (the user's main ask). For locale-specific rows
  // we only update that locale.
  const action = updateBlock.bind(null, id);

  const pageBack = `/admin/pages/${block.page_key}?locale=${block.locale}`;

  return (
    <div className="space-y-6 px-8 py-8">
      <PageHeader
        title={`${block.page_key} · ${block.section_key}`}
        description={
          block.locale === 'all'
            ? '"Tüm diller" satırı — kaydettiğinizde değişiklikler 3 dilde de yansır.'
            : `Sadece "${block.locale.toUpperCase()}" dilinde geçerli. Tüm dillerde aynı olmasını isterseniz "Tüm diller" satırını düzenleyin.`
        }
        actions={
          <Link
            href={pageBack}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            ← Bölüm listesine dön
          </Link>
        }
      />

      <BlockForm action={action} defaults={merged} lockIdentity submitLabel="Değişiklikleri Kaydet" />
    </div>
  );
}
