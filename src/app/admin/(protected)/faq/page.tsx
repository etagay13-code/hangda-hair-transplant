import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NewButton, PageHeader } from '@/components/admin/Toolbar';
import { LocaleTabs } from '@/components/admin/LocaleTabs';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteFaq } from './actions';
import { routing } from '@/i18n/routing';
import type { Faq } from '@/types';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ locale?: string }>;
}

export default async function FaqAdminPage({ searchParams }: Props) {
  const { locale } = await searchParams;
  const current = (routing.locales as readonly string[]).includes(locale || '') ? locale! : 'en';

  const supabase = await createClient();
  const { data } = await supabase
    .from('faq')
    .select('*')
    .eq('locale', current)
    .order('order_index', { ascending: true });
  const rows = (data ?? []) as Faq[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQ"
        description="Manage frequently asked questions shown on the homepage."
        actions={<NewButton href={`/admin/faq/new?locale=${current}`} />}
      />
      <LocaleTabs current={current} />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
          No FAQs for this locale yet.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((q) => {
            const del = async () => {
              'use server';
              await deleteFaq(q.id);
            };
            return (
              <div
                key={q.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--color-primary-darker)]">
                    {q.question}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{q.answer}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>order: {q.order_index}</span>
                    <span>·</span>
                    <span>{q.category}</span>
                    <span>·</span>
                    <span className={q.is_active ? 'text-emerald-700' : 'text-slate-400'}>
                      {q.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/faq/${q.id}`}
                    className="text-xs font-medium text-[var(--color-primary-dark)] hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton action={del} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
