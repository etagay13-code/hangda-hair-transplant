import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';

export const dynamic = 'force-dynamic';

interface PageCard {
  key: string;
  title: string;
  description: string;
  liveHref: string;
  icon: string;
  accent: string;
}

const PAGES: PageCard[] = [
  {
    key: 'home',
    title: 'Homepage',
    description: 'Hero, technique comparison, services, process, gallery, included, recovery, testimonials, FAQ, contact.',
    liveHref: '/',
    icon: '🏠',
    accent: 'from-emerald-100 to-emerald-50',
  },
  {
    key: 'about',
    title: 'About Us',
    description: 'Story, mission, values, timeline, certifications, team, equipment.',
    liveHref: '/about',
    icon: '👥',
    accent: 'from-sky-100 to-sky-50',
  },
  {
    key: 'services',
    title: 'Services',
    description: 'Treatment menu hero and intro copy. Treatments themselves live under Services in the sidebar.',
    liveHref: '/services',
    icon: '⚕️',
    accent: 'from-violet-100 to-violet-50',
  },
  {
    key: 'gallery',
    title: 'Before & After',
    description: 'Gallery hero text. Photos themselves live under Gallery in the sidebar.',
    liveHref: '/gallery',
    icon: '🖼️',
    accent: 'from-amber-100 to-amber-50',
  },
  {
    key: 'blog',
    title: 'Blog',
    description: 'Blog index hero text. Articles live under Blog Posts in the sidebar.',
    liveHref: '/blog',
    icon: '✍️',
    accent: 'from-rose-100 to-rose-50',
  },
  {
    key: 'contact',
    title: 'Contact',
    description: 'Contact page hero text, form intro, location card.',
    liveHref: '/contact',
    icon: '✉️',
    accent: 'from-slate-200 to-slate-100',
  },
];

export default async function PagesIndex() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('page_blocks')
    .select('page_key, is_active');
  const counts = (data ?? []).reduce<Record<string, { total: number; active: number }>>(
    (acc, row) => {
      acc[row.page_key] ||= { total: 0, active: 0 };
      acc[row.page_key].total += 1;
      if (row.is_active) acc[row.page_key].active += 1;
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pages"
        description="Pick a page to edit its sections. Each section can be customised per language. Changes go live on save."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map((page) => {
          const c = counts[page.key] ?? { total: 0, active: 0 };
          return (
            <Link
              key={page.key}
              href={`/admin/pages/${page.key}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[var(--color-primary)] hover:shadow-md"
            >
              <div className={`bg-gradient-to-br ${page.accent} px-6 py-7`}>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white text-2xl shadow-sm">
                  {page.icon}
                </span>
                <h2 className="mt-4 text-xl font-semibold text-[var(--color-primary-darker)]">
                  {page.title}
                </h2>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm leading-relaxed text-slate-600">{page.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <span>
                    <strong className="text-[var(--color-primary-darker)]">{c.total}</strong> section{c.total === 1 ? '' : 's'}
                    {c.total > 0 && (
                      <>
                        {' · '}
                        <span className="text-emerald-700">{c.active} active</span>
                      </>
                    )}
                  </span>
                  <span className="font-semibold text-[var(--color-primary-dark)] transition group-hover:translate-x-1">
                    Edit →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-sm text-slate-600">
        Need a raw table of every block across every page?{' '}
        <Link
          href="/admin/page-blocks"
          className="font-semibold text-[var(--color-primary-dark)] hover:underline"
        >
          Open advanced Page Blocks view →
        </Link>
      </p>
    </div>
  );
}
