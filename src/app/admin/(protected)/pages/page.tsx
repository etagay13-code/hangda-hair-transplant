import Link from 'next/link';
import { Home, Users, Stethoscope, Image as ImageIcon, PenLine, Mail, type LucideIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export const dynamic = 'force-dynamic';

interface PageCard {
  key: string;
  title: string;
  description: string;
  liveHref: string;
  Icon: LucideIcon;
}

const PAGES: PageCard[] = [
  { key: 'home',     title: 'Ana Sayfa',      description: 'Hero, teknikler, hizmetler, süreç, galeri, paket, iyileşme, yorumlar, SSS, iletişim.', liveHref: '/', Icon: Home },
  { key: 'about',    title: 'Hakkımızda',     description: 'Hikaye, misyon, değerler, zaman çizelgesi, akreditasyon, ekip, ekipman.', liveHref: '/about', Icon: Users },
  { key: 'services', title: 'Hizmetler',      description: 'Tedavi menüsü ana sayfası.', liveHref: '/services', Icon: Stethoscope },
  { key: 'gallery',  title: 'Öncesi & Sonrası', description: 'Galeri sayfasının hero metni.', liveHref: '/gallery', Icon: ImageIcon },
  { key: 'blog',     title: 'Blog',           description: 'Blog ana sayfasının hero metni.', liveHref: '/blog', Icon: PenLine },
  { key: 'contact',  title: 'İletişim',       description: 'İletişim sayfası hero ve form girişi.', liveHref: '/contact', Icon: Mail },
];

export default async function PagesIndex() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('page_blocks')
    .select('page_key, is_active, locale');
  const counts = (data ?? []).reduce<Record<string, { total: number; localised: number }>>(
    (acc, row) => {
      acc[row.page_key] ||= { total: 0, localised: 0 };
      if (row.locale === 'all' && row.is_active) acc[row.page_key].total += 1;
      if (row.locale !== 'all') acc[row.page_key].localised += 1;
      return acc;
    },
    {}
  );

  return (
    <>
      <AdminTopbar crumb="Sayfalar" preview="/" />
      <div className="px-8 py-8">
        <PageHeader
          title="Sayfalar"
          description="Sitenizin sayfaları. Bir sayfayı seçerek o sayfanın bölümlerini düzenleyebilirsiniz. Yapılan değişiklikler kaydeder kaydetmez yayına alınır."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PAGES.map((page) => {
            const c = counts[page.key] ?? { total: 0, localised: 0 };
            return (
              <Link
                key={page.key}
                href={`/admin/pages/${page.key}`}
                className="admin-card admin-card-hover group flex flex-col overflow-hidden transition hover:-translate-y-0.5"
              >
                <div className="border-b border-slate-800 bg-gradient-to-br from-slate-800/60 to-slate-900 px-5 py-5">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-700/60 text-[var(--color-primary)]">
                      <page.Icon size={20} strokeWidth={1.8} />
                    </span>
                    <span className="admin-pill">
                      <span className="dot" /> Yayında
                    </span>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-white">{page.title}</h2>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm leading-relaxed text-slate-400">{page.description}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-500">
                    <span>
                      <strong className="text-white">{c.total}</strong> bölüm
                      {c.localised > 0 && (
                        <span className="ml-2 text-emerald-400">
                          +{c.localised} dil özel
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-[var(--color-primary)] transition group-hover:translate-x-0.5">
                      Düzenle →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
