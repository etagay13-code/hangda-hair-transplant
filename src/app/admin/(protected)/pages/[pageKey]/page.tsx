import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { AdminTopbar, LocaleSwitcherTabs } from '@/components/admin/AdminTopbar';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { updateBlock } from '../../page-blocks/actions';
import {
  deleteCollectionItem,
  toggleCollectionItemActive,
  reorderCollectionItem,
  createMissingBlock,
} from './actions';
import { getRenderedField } from '@/lib/section-defaults';
import { PAGE_SECTIONS, type PageKey, type SectionDef } from '@/lib/admin/page-sections';
import type { PageBlock } from '@/types';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ pageKey: string }>;
  searchParams: Promise<{ locale?: string }>;
}

interface HeroStat {
  label?: string;
  value?: string;
  visible?: boolean;
}
interface HeroBadge {
  label?: string;
  value?: string;
  visible?: boolean;
}
interface HeroExtraShape {
  stats?: HeroStat[];
  badgeTopLeft?: HeroBadge;
  badgeBottomRight?: HeroBadge;
  resultCard?: { eyebrow?: string; title?: string; visible?: boolean };
}

interface CollectionRow {
  id: string;
  is_active?: boolean | null;
  order_index?: number | null;
  locale?: string | null;
  [key: string]: unknown;
}

export default async function PageDetail({ params, searchParams }: Props) {
  const { pageKey } = await params;
  const { locale: rawLocale } = await searchParams;
  const locale =
    rawLocale && ['all', 'en', 'nl', 'tr'].includes(rawLocale) ? rawLocale : 'all';
  const config = PAGE_SECTIONS[pageKey as PageKey];
  if (!config) notFound();

  const supabase = await createClient();

  // Page blocks for every section on this page in the chosen locale
  const sectionKeys = config.sections.map((s) => s.key);
  const { data: blocksData } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_key', pageKey)
    .eq('locale', locale)
    .in('section_key', sectionKeys);
  const blocksBySection = new Map<string, PageBlock>(
    ((blocksData ?? []) as PageBlock[]).map((b) => [b.section_key, b])
  );

  // Pre-load every collection table this page references
  const collectionTables = new Set<string>();
  for (const sec of config.sections) {
    if (sec.type === 'collection') collectionTables.add(sec.collection.table);
  }
  const collectionByTable: Record<string, CollectionRow[]> = {};
  await Promise.all(
    Array.from(collectionTables).map(async (table) => {
      // For 'all' locale view, surface every row so editors can find them
      // regardless of language; otherwise scope to that locale.
      const query =
        locale === 'all'
          ? supabase.from(table).select('*').order('order_index', { ascending: true })
          : supabase
              .from(table)
              .select('*')
              .eq('locale', locale)
              .order('order_index', { ascending: true });
      const { data } = await query;
      collectionByTable[table] = (data ?? []) as CollectionRow[];
    })
  );

  return (
    <>
      <AdminTopbar
        crumb={`Sayfalar · ${config.title}`}
        preview={config.live}
        locale={locale}
      />
      <div className="px-8 py-8">
        <PageHeader
          title={config.title}
          description={config.description}
          actions={
            <Link href="/admin/pages" className="admin-btn admin-btn-ghost">
              ← Sayfalara dön
            </Link>
          }
        />

        <div className="mt-6 flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/60 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Düzenlenen dil</p>
            <p className="mt-1 text-xs text-slate-400">
              {locale === 'all'
                ? '"Tüm diller" — kaydettiğiniz değişiklik EN / NL / TR satırlarına otomatik yansır.'
                : `Sadece "${locale.toUpperCase()}" sürümünü düzenliyorsunuz. Master satır için "Tüm diller" sekmesini seçin.`}
            </p>
          </div>
          <LocaleSwitcherTabs
            current={locale}
            buildHref={(l) => `/admin/pages/${pageKey}?locale=${l}`}
          />
        </div>

        <div className="mt-6 space-y-6">
          {config.sections.map((section) => (
            <SectionCard
              key={section.key}
              section={section}
              block={blocksBySection.get(section.key)}
              pageKey={pageKey}
              locale={locale}
              items={
                section.type === 'collection'
                  ? collectionByTable[section.collection.table] ?? []
                  : []
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section card — header + inline text form + (optional) collection list     */
/* -------------------------------------------------------------------------- */

async function SectionCard({
  section,
  block,
  pageKey,
  locale,
  items,
}: {
  section: SectionDef;
  block?: PageBlock;
  pageKey: string;
  locale: string;
  items: CollectionRow[];
}) {
  return (
    <section className="admin-card overflow-hidden">
      <header className="border-b border-slate-800 bg-slate-900/40 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500">
              {pageKey} · {section.key}
            </p>
            <h2 className="mt-1 flex items-center gap-2 text-lg font-semibold text-white">
              <span>{section.icon}</span>
              <span>{section.title}</span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">{section.description}</p>
          </div>
          {section.type === 'collection' && (
            <Link
              href={`${section.collection.adminBase}/new`}
              className="admin-btn admin-btn-primary !py-1.5 !px-3 !text-xs whitespace-nowrap"
            >
              + Yeni {collectionLabel(section.collection.table)}
            </Link>
          )}
        </div>
        {section.note && (
          <p className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[11px] leading-relaxed text-amber-200/90">
            ℹ️ {section.note}
          </p>
        )}
      </header>

      <div className="space-y-6 p-6">
        {block ? (
          <InlineBlockForm
            block={block}
            pageKey={pageKey}
            locale={locale}
            withExtras={section.type === 'block-with-extra'}
          />
        ) : (
          <MissingBlockNotice
            pageKey={pageKey}
            sectionKey={section.key}
            locale={locale}
          />
        )}

        {section.type === 'collection' && (
          <CollectionList
            section={section}
            items={items}
            pageKey={pageKey}
          />
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inline page_blocks edit form (text fields + image + hero JSON extras)     */
/* -------------------------------------------------------------------------- */

function InlineBlockForm({
  block,
  pageKey,
  locale,
  withExtras,
}: {
  block: PageBlock;
  pageKey: string;
  locale: string;
  withExtras: boolean;
}) {
  // Pre-fill defaults from the current rendered text. smartNullable on the
  // server keeps the override clean when the user doesn't change anything.
  const ren = (field: 'eyebrow' | 'title' | 'subtitle' | 'body' | 'cta_label') =>
    block[field] ?? getRenderedField(pageKey, block.section_key, locale, field);

  const extra = (block.extra ?? {}) as HeroExtraShape;
  const action = updateBlock.bind(null, block.id);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="page_key" value={block.page_key} />
      <input type="hidden" name="section_key" value={block.section_key} />
      <input type="hidden" name="locale" value={block.locale} />
      <input type="hidden" name="order_index" value={block.order_index ?? 0} />
      <input type="hidden" name="is_active" value={block.is_active ? 'on' : ''} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Üst etiket (eyebrow)"
          name="eyebrow"
          defaultValue={ren('eyebrow') ?? ''}
        />
        <Field
          label="CTA buton metni"
          name="cta_label"
          defaultValue={ren('cta_label') ?? ''}
        />
      </div>

      <Field label="Başlık" name="title" defaultValue={ren('title') ?? ''} />
      <Field
        label="Alt başlık / kısa açıklama"
        name="subtitle"
        defaultValue={ren('subtitle') ?? ''}
        multiline
        rows={2}
      />
      <Field
        label="Uzun açıklama (body)"
        name="body"
        defaultValue={ren('body') ?? ''}
        multiline
        rows={3}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <ImageUploadField
          name="image_url"
          label="Görsel (yükle veya URL yapıştır)"
          bucket="general"
          folder={`page-blocks/${pageKey}/${block.section_key}`}
          defaultUrl={block.image_url}
        />
        <Field
          label="CTA buton bağlantısı"
          name="cta_href"
          defaultValue={block.cta_href ?? ''}
          placeholder="/contact veya https://..."
        />
      </div>

      {withExtras && <HeroExtraFields extra={extra} />}

      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <p className="text-[11px] text-slate-500">
          Pre-fill metinleri değiştirmezseniz çeviri dosyası kullanılmaya devam eder.
        </p>
        <button type="submit" className="admin-btn admin-btn-primary">
          Bölümü Kaydet
        </button>
      </div>
    </form>
  );
}

function HeroExtraFields({ extra }: { extra: HeroExtraShape }) {
  const stats = (extra.stats ?? []).slice(0, 4);
  while (stats.length < 4) stats.push({ label: '', value: '', visible: true });
  const tl = extra.badgeTopLeft ?? { label: '', value: '', visible: false };
  const br = extra.badgeBottomRight ?? { label: '', value: '', visible: false };
  const rc = extra.resultCard ?? { eyebrow: '', title: '', visible: false };
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        Hero Ekstraları
      </h3>
      <p className="mt-1 text-[11px] text-slate-500">
        Hero görselinin üstündeki istatistikler ve rozetler. Görünmeyenler boş alan
        bırakır.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {stats.map((s, i) => (
          <div
            key={i}
            className="rounded-md border border-slate-800 bg-slate-950/40 p-3"
          >
            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              İstatistik {i + 1}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                name={`stat_${i}_value`}
                defaultValue={s.value ?? ''}
                placeholder="98%"
                className="admin-input"
              />
              <input
                name={`stat_${i}_label`}
                defaultValue={s.label ?? ''}
                placeholder="Başarı oranı"
                className="admin-input"
              />
            </div>
            <label className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <input
                type="checkbox"
                name={`stat_${i}_visible`}
                defaultChecked={s.visible !== false}
              />
              Aktif (sayfada göster)
            </label>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <BadgeFields prefix="badgeTopLeft" label="Sol üst rozet" data={tl} />
        <BadgeFields prefix="badgeBottomRight" label="Sağ alt rozet" data={br} />
      </div>

      <div className="mt-4 rounded-md border border-slate-800 bg-slate-950/40 p-3">
        <p className="text-[10px] uppercase tracking-widest text-slate-500">Sonuç kartı</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            name="resultCard_eyebrow"
            defaultValue={rc.eyebrow ?? ''}
            placeholder="Sonuç"
            className="admin-input"
          />
          <input
            name="resultCard_title"
            defaultValue={rc.title ?? ''}
            placeholder="12. ay sonrası"
            className="admin-input"
          />
        </div>
        <label className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
          <input
            type="checkbox"
            name="resultCard_visible"
            defaultChecked={rc.visible !== false}
          />
          Aktif (sayfada göster)
        </label>
      </div>
    </div>
  );
}

function BadgeFields({
  prefix,
  label,
  data,
}: {
  prefix: string;
  label: string;
  data: HeroBadge;
}) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-950/40 p-3">
      <p className="text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <input
          name={`${prefix}_value`}
          defaultValue={data.value ?? ''}
          placeholder="Değer"
          className="admin-input"
        />
        <input
          name={`${prefix}_label`}
          defaultValue={data.label ?? ''}
          placeholder="Etiket"
          className="admin-input"
        />
      </div>
      <label className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
        <input
          type="checkbox"
          name={`${prefix}_visible`}
          defaultChecked={data.visible !== false}
        />
        Aktif
      </label>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Collection list — inline thumbnails with edit/delete/reorder/visibility   */
/* -------------------------------------------------------------------------- */

function CollectionList({
  section,
  items,
  pageKey,
}: {
  section: Extract<SectionDef, { type: 'collection' }>;
  items: CollectionRow[];
  pageKey: string;
}) {
  const c = section.collection;
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/30">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {collectionLabel(c.table)} listesi
        </h3>
        <span className="text-[11px] text-slate-500">
          {items.length} kayıt
        </span>
      </div>

      {items.length === 0 ? (
        <div className="px-4 py-10 text-center text-xs text-slate-500">
          Henüz {collectionLabel(c.table).toLowerCase()} eklenmemiş.{' '}
          <Link
            href={`${c.adminBase}/new`}
            className="text-[var(--color-primary)] underline"
          >
            İlkini ekleyin →
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-slate-800">
          {items.map((item, i) => (
            <CollectionRowItem
              key={item.id}
              item={item}
              section={section}
              pageKey={pageKey}
              isFirst={i === 0}
              isLast={i === items.length - 1}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function CollectionRowItem({
  item,
  section,
  pageKey,
  isFirst,
  isLast,
}: {
  item: CollectionRow;
  section: Extract<SectionDef, { type: 'collection' }>;
  pageKey: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const c = section.collection;
  const primary = (item[c.primaryField] as string | null) ?? '(başlık yok)';
  const secondary = c.secondaryField
    ? ((item[c.secondaryField] as string | null) ?? '')
    : '';
  const image = c.imageField
    ? ((item[c.imageField] as string | null) ?? null)
    : null;

  const del = async () => {
    'use server';
    await deleteCollectionItem(c.table, item.id, pageKey);
  };
  const toggle = async () => {
    'use server';
    await toggleCollectionItemActive(c.table, item.id, pageKey);
  };
  const moveUp = async () => {
    'use server';
    await reorderCollectionItem(c.table, item.id, 'up', pageKey);
  };
  const moveDown = async () => {
    'use server';
    await reorderCollectionItem(c.table, item.id, 'down', pageKey);
  };

  return (
    <li className="flex items-center gap-4 px-4 py-3">
      <div className="flex flex-col gap-0.5">
        <form action={moveUp}>
          <button
            type="submit"
            disabled={isFirst}
            aria-label="Yukarı"
            className="grid h-6 w-6 place-items-center rounded text-slate-500 hover:bg-slate-800 hover:text-white disabled:opacity-30"
          >
            ↑
          </button>
        </form>
        <form action={moveDown}>
          <button
            type="submit"
            disabled={isLast}
            aria-label="Aşağı"
            className="grid h-6 w-6 place-items-center rounded text-slate-500 hover:bg-slate-800 hover:text-white disabled:opacity-30"
          >
            ↓
          </button>
        </form>
      </div>

      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="h-12 w-16 shrink-0 rounded-md object-cover ring-1 ring-slate-700"
        />
      ) : (
        <div className="grid h-12 w-16 shrink-0 place-items-center rounded-md bg-slate-800 text-xl text-slate-600">
          {section.icon}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{primary}</p>
        {secondary && (
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{secondary}</p>
        )}
        {item.locale && (
          <p className="mt-1 inline-block rounded-sm bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-400">
            {item.locale}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <form action={toggle}>
          <button
            type="submit"
            className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest transition ${
              item.is_active
                ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
            }`}
            title="Görünürlüğü değiştir"
          >
            {item.is_active ? '● Aktif' : '○ Gizli'}
          </button>
        </form>
        <Link
          href={`${c.adminBase}/${item.id}`}
          className="admin-btn admin-btn-ghost !py-1 !px-2.5 !text-[11px]"
        >
          Düzenle
        </Link>
        <DeleteButton action={del} confirm={`"${primary}" silinsin mi?`} />
      </div>
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function MissingBlockNotice({
  pageKey,
  sectionKey,
  locale,
}: {
  pageKey: string;
  sectionKey: string;
  locale: string;
}) {
  const create = async () => {
    'use server';
    await createMissingBlock(pageKey, sectionKey, locale);
  };
  return (
    <div className="rounded-md border border-dashed border-slate-700 bg-slate-900/30 px-4 py-6 text-center">
      <p className="text-xs text-slate-400">
        Bu bölüm için <strong>{locale}</strong> dilinde page_blocks satırı yok.
      </p>
      <p className="mt-1 text-[11px] text-slate-500">
        Site şu an çeviri dosyasından yayın yapıyor. Override eklemek için aşağıdaki
        butonla satır oluşturabilirsiniz.
      </p>
      <form action={create} className="mt-3">
        <button type="submit" className="admin-btn admin-btn-ghost">
          Bu bölüm için satır oluştur
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue = '',
  placeholder,
  multiline,
  rows = 2,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      {multiline ? (
        <textarea
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="admin-input mt-1.5 w-full resize-y"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="admin-input mt-1.5 w-full"
        />
      )}
    </label>
  );
}

function collectionLabel(table: string): string {
  switch (table) {
    case 'gallery':
      return 'vaka';
    case 'services':
      return 'hizmet';
    case 'testimonials':
      return 'yorum';
    case 'faq':
      return 'SSS';
    case 'team_members':
      return 'ekip üyesi';
    case 'blog_posts':
      return 'yazı';
    default:
      return 'kayıt';
  }
}
