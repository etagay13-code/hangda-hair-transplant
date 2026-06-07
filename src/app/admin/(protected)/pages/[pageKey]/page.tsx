import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, NewButton } from '@/components/admin/Toolbar';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteBlock } from '../../page-blocks/actions';
import type { PageBlock } from '@/types';

export const dynamic = 'force-dynamic';

const PAGE_LABELS: Record<string, { title: string; live: string; description: string }> = {
  home: {
    title: 'Homepage',
    live: '/',
    description: 'The landing page. Hero, technique comparison, services, process, gallery, included items, recovery timeline, testimonials, FAQ and contact.',
  },
  about: {
    title: 'About Us',
    live: '/about',
    description: 'Clinic story, mission, values, timeline, accreditations, equipment, team.',
  },
  services: {
    title: 'Services',
    live: '/services',
    description: 'Treatment menu hero and intro. Use Services in the sidebar to edit individual treatments.',
  },
  gallery: {
    title: 'Before & After',
    live: '/gallery',
    description: 'Gallery hero. Use Gallery in the sidebar to add or edit before/after results.',
  },
  blog: {
    title: 'Blog',
    live: '/blog',
    description: 'Blog index hero. Use Blog Posts in the sidebar to write articles.',
  },
  contact: {
    title: 'Contact',
    live: '/contact',
    description: 'Contact page hero and intro.',
  },
};

const LOCALE_BADGE: Record<string, string> = {
  all: 'bg-[var(--color-primary)]/15 text-[var(--color-primary-darker)] border-[var(--color-primary)]/30',
  en: 'bg-sky-100 text-sky-800 border-sky-200',
  nl: 'bg-amber-100 text-amber-800 border-amber-200',
  tr: 'bg-rose-100 text-rose-800 border-rose-200',
};

interface Props {
  params: Promise<{ pageKey: string }>;
}

export default async function PageDetail({ params }: Props) {
  const { pageKey } = await params;
  const meta = PAGE_LABELS[pageKey];
  if (!meta) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_key', pageKey)
    .order('section_key', { ascending: true })
    .order('locale', { ascending: true });
  const blocks = (data ?? []) as PageBlock[];

  // Group by section_key so all locales of the same section sit together
  const grouped = blocks.reduce<Record<string, PageBlock[]>>((acc, row) => {
    (acc[row.section_key] ||= []).push(row);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <PageHeader
        title={meta.title}
        description={meta.description}
        actions={
          <div className="flex gap-2">
            <a
              href={meta.live}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              View live →
            </a>
            <NewButton
              href={`/admin/page-blocks/new?page=${pageKey}`}
              label="Add section"
            />
          </div>
        }
      />

      <Link
        href="/admin/pages"
        className="inline-flex items-center text-sm text-slate-600 hover:text-[var(--color-primary-darker)]"
      >
        ← Back to all pages
      </Link>

      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-sm text-slate-600">
            No sections for this page yet. Migration{' '}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">007_page_blocks.sql</code>{' '}
            seeds the defaults — run it in Supabase to populate this page.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([sectionKey, rows]) => {
            const allRow = rows.find((r) => r.locale === 'all');
            const localeRows = rows.filter((r) => r.locale !== 'all');
            const primaryRow = allRow ?? rows[0];
            return (
              <section
                key={sectionKey}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3">
                  <div>
                    <h2 className="font-mono text-sm font-semibold text-[var(--color-primary-darker)]">
                      {sectionKey}
                    </h2>
                    {primaryRow.title && (
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                        {primaryRow.title}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {[allRow ? allRow.locale : null, ...localeRows.map((r) => r.locale)]
                      .filter((l): l is string => !!l)
                      .map((loc) => (
                        <span
                          key={loc}
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                            LOCALE_BADGE[loc] ?? 'border-slate-200 bg-slate-100 text-slate-600'
                          }`}
                        >
                          {loc === 'all' ? 'All' : loc}
                        </span>
                      ))}
                  </div>
                </header>
                <ul className="divide-y divide-slate-100">
                  {rows.map((b) => {
                    const del = async () => {
                      'use server';
                      await deleteBlock(b.id, b.page_key);
                    };
                    return (
                      <li
                        key={b.id}
                        className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50"
                      >
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                              LOCALE_BADGE[b.locale] ?? 'border-slate-200 bg-slate-100 text-slate-600'
                            }`}
                          >
                            {b.locale === 'all' ? 'All locales (master)' : b.locale.toUpperCase()}
                          </span>
                          {b.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={b.image_url}
                              alt=""
                              className="h-8 w-10 rounded object-cover ring-1 ring-slate-200"
                            />
                          ) : null}
                          <span className="text-slate-700">
                            {b.title ?? (
                              <em className="text-slate-400">
                                Uses translation fallback
                              </em>
                            )}
                          </span>
                          {!b.is_active && (
                            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                              Hidden
                            </span>
                          )}
                        </div>
                        <div className="inline-flex items-center gap-4">
                          <Link
                            href={`/admin/page-blocks/${b.id}`}
                            className="text-xs font-medium text-[var(--color-primary-dark)] hover:underline"
                          >
                            Edit
                          </Link>
                          <DeleteButton
                            action={del}
                            confirm={`Delete ${b.section_key} (${b.locale})?`}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
