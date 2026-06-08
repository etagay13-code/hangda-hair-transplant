import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { ServiceForm } from '../ServiceForm';
import { updateService } from '../actions';
import { unlinkCaseFromService } from './actions';
import type { Service, GalleryItem } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('services').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const service = data as Service;

  // All gallery cases tagged with this service slug — regardless of locale,
  // since cases are typically created in 'en' and shown on every locale.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: galleryData } = await (supabase
    .from('gallery')
    .select('*') as any)
    .eq('service_slug', service.slug)
    .order('order_index', { ascending: true });
  const cases = (galleryData ?? []) as GalleryItem[];

  const action = updateService.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={service.title}
        description="Edit this service entry."
        actions={
          <Link
            href="/admin/services"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            ← Back
          </Link>
        }
      />

      <ServiceForm action={action} defaults={service} submitLabel="Save changes" />

      {/* Before/After cases assigned to this service */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              🖼 Bu hizmetin Öncesi / Sonrası vakaları
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Yalnızca <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{service.slug}</code>{' '}
              hizmetine atanan vakalar burada listelenir ve servis detay sayfasında
              &quot;Real results&quot; bölümünde görünür.
            </p>
          </div>
          <Link
            href={`/admin/gallery/new?service_slug=${encodeURIComponent(service.slug)}`}
            className="rounded-md bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
          >
            + Yeni vaka ekle
          </Link>
        </div>

        {cases.length === 0 ? (
          <div className="mt-5 rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Henüz bu hizmete atanmış vaka yok.{' '}
            <Link
              href={`/admin/gallery/new?service_slug=${encodeURIComponent(service.slug)}`}
              className="text-[var(--color-primary)] underline"
            >
              İlk vakayı ekleyin
            </Link>{' '}
            veya{' '}
            <Link href="/admin/gallery" className="text-[var(--color-primary)] underline">
              mevcut bir vakayı düzenleyip
            </Link>{' '}
            bu hizmete atayın.
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-slate-200 rounded-lg border border-slate-200">
            {cases.map((g) => {
              const detach = async () => {
                'use server';
                await unlinkCaseFromService(g.id, service.slug);
              };
              return (
                <li key={g.id} className="flex items-center gap-4 p-3">
                  {g.after_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={g.after_image_url}
                      alt={g.patient_code ?? ''}
                      className="h-14 w-20 shrink-0 rounded-md object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="grid h-14 w-20 shrink-0 place-items-center rounded-md bg-slate-100 text-xl text-slate-400">
                      🖼
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {g.patient_code || '(kod yok)'}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {[g.technique, g.grafts ? `${g.grafts.toLocaleString()} greft` : null, g.months_after ? `${g.months_after} ay sonra` : null]
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </p>
                  </div>
                  <Link
                    href={`/admin/gallery/${g.id}`}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Düzenle
                  </Link>
                  <form action={detach}>
                    <button
                      type="submit"
                      className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100"
                      title="Bu hizmetten kaldır (vaka silinmez)"
                    >
                      Hizmetten kaldır
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
