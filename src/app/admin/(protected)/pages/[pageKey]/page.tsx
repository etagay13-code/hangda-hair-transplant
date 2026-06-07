import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageHeader, NewButton } from '@/components/admin/Toolbar';
import { AdminTopbar, LocaleSwitcherTabs } from '@/components/admin/AdminTopbar';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteBlock, reorderBlock } from '../../page-blocks/actions';
import type { PageBlock } from '@/types';

export const dynamic = 'force-dynamic';

const PAGE_LABELS: Record<string, { title: string; live: string; description: string }> = {
  home:     { title: 'Ana Sayfa',          live: '/',         description: 'Anasayfadaki tüm bölümler. Sürükleme yerine ↑↓ butonları ile sırayı değiştirebilir veya bölümlere tıklayıp içeriğini düzenleyebilirsiniz.' },
  about:    { title: 'Hakkımızda',         live: '/about',    description: 'Hakkımızda sayfasının bölümleri.' },
  services: { title: 'Hizmetler',          live: '/services', description: 'Hizmetler sayfası hero ve giriş.' },
  gallery:  { title: 'Öncesi & Sonrası',   live: '/gallery',  description: 'Galeri sayfası hero.' },
  blog:     { title: 'Blog',               live: '/blog',     description: 'Blog ana sayfası hero.' },
  contact:  { title: 'İletişim',           live: '/contact',  description: 'İletişim sayfası hero ve form girişi.' },
};

interface Props {
  params: Promise<{ pageKey: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export default async function PageDetail({ params, searchParams }: Props) {
  const { pageKey } = await params;
  const { locale: rawLocale } = await searchParams;
  const locale = rawLocale && ['all', 'en', 'nl', 'tr'].includes(rawLocale) ? rawLocale : 'all';
  const meta = PAGE_LABELS[pageKey];
  if (!meta) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_key', pageKey)
    .eq('locale', locale)
    .order('order_index', { ascending: true });
  const blocks = (data ?? []) as PageBlock[];

  return (
    <>
      <AdminTopbar
        crumb={`Sayfalar · ${meta.title}`}
        preview={meta.live}
        locale={locale}
      />
      <div className="px-8 py-8">
        <PageHeader
          title={meta.title}
          description={meta.description}
          actions={
            <>
              <Link
                href="/admin/pages"
                className="admin-btn admin-btn-ghost"
              >
                ← Sayfalara dön
              </Link>
              <NewButton
                href={`/admin/page-blocks/new?page=${pageKey}&locale=${locale}`}
                label="Bölüm ekle"
              />
            </>
          }
        />

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Dil seçimi
          </p>
          <LocaleSwitcherTabs
            current={locale}
            buildHref={(l) => `/admin/pages/${pageKey}?locale=${l}`}
          />
        </div>

        {blocks.length === 0 ? (
          <div className="admin-card mt-8 p-10 text-center">
            <p className="text-sm text-slate-400">
              Bu sayfada {locale === 'all' ? 'henüz tanımlanmış' : `${locale.toUpperCase()} diline özel`} bölüm yok.
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {locale === 'all'
                ? 'Migration 007_page_blocks.sql çalıştırıldığından emin olun.'
                : 'Master bölümler "All locales" sekmesinde görünür. Bu dili özelleştirmek için bir bölüm açın ve dilini değiştirip kaydedin.'}
            </p>
          </div>
        ) : (
          <ol className="mt-6 space-y-3">
            {blocks.map((b, i) => {
              const del = async () => {
                'use server';
                await deleteBlock(b.id, b.page_key);
              };
              const moveUp = async () => {
                'use server';
                await reorderBlock(b.id, 'up');
              };
              const moveDown = async () => {
                'use server';
                await reorderBlock(b.id, 'down');
              };
              return (
                <li
                  key={b.id}
                  className="admin-card admin-card-hover flex items-center gap-4 p-4"
                >
                  <div className="flex flex-col gap-0.5">
                    <form action={moveUp}>
                      <button
                        type="submit"
                        disabled={i === 0}
                        aria-label="Yukarı"
                        className="grid h-7 w-7 place-items-center rounded text-slate-500 hover:bg-slate-800 hover:text-white disabled:opacity-30"
                      >
                        ↑
                      </button>
                    </form>
                    <form action={moveDown}>
                      <button
                        type="submit"
                        disabled={i === blocks.length - 1}
                        aria-label="Aşağı"
                        className="grid h-7 w-7 place-items-center rounded text-slate-500 hover:bg-slate-800 hover:text-white disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </form>
                  </div>

                  <Link
                    href={`/admin/page-blocks/${b.id}`}
                    className="flex flex-1 items-center gap-4"
                  >
                    {b.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.image_url}
                        alt=""
                        className="h-14 w-20 shrink-0 rounded-lg object-cover ring-1 ring-slate-700"
                      />
                    ) : (
                      <div className="grid h-14 w-20 shrink-0 place-items-center rounded-lg bg-slate-800 text-2xl text-slate-600">
                        {sectionIcon(b.section_key)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                        {b.section_key}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-white">
                        {b.title || (
                          <span className="text-slate-500 italic">
                            (Çeviri dosyası kullanılıyor)
                          </span>
                        )}
                      </p>
                      {b.subtitle && (
                        <p className="mt-1 line-clamp-1 text-xs text-slate-400">{b.subtitle}</p>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center gap-3">
                    {!b.is_active && (
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-widest text-slate-400">
                        Gizli
                      </span>
                    )}
                    <Link
                      href={`/admin/page-blocks/${b.id}`}
                      className="admin-btn admin-btn-ghost !py-1.5 !px-3 !text-xs"
                    >
                      Düzenle
                    </Link>
                    <DeleteButton action={del} confirm={`${b.section_key} silinsin mi?`} />
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </>
  );
}

function sectionIcon(key: string): string {
  const icons: Record<string, string> = {
    hero: '🎯',
    why_us: '✨',
    techniques: '🔬',
    services: '⚕️',
    process: '🛤',
    gallery: '🖼',
    included: '📦',
    recovery: '⏳',
    testimonials: '⭐',
    faq: '❓',
    contact: '✉️',
    story: '📖',
    mission: '🎯',
  };
  return icons[key] ?? '📄';
}
