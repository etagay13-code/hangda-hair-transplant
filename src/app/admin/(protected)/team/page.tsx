import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NewButton, PageHeader } from '@/components/admin/Toolbar';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteMember } from './actions';
import type { TeamMember } from '@/types';

export const dynamic = 'force-dynamic';

export default async function TeamAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .order('order_index', { ascending: true });
  const rows = (data ?? []) as TeamMember[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Doctors, technicians and patient coordinators."
        actions={<NewButton href="/admin/team/new" />}
      />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
          No team members yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((m) => {
            const del = async () => {
              'use server';
              await deleteMember(m.id);
            };
            return (
              <div key={m.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="aspect-[4/3] bg-slate-100">
                  {m.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.image_url} alt={m.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center text-xs text-slate-400">No photo</div>
                  )}
                </div>
                <div className="space-y-1 p-4">
                  <p className="text-sm font-semibold text-[var(--color-primary-darker)]">{m.name}</p>
                  {m.title && <p className="text-xs text-slate-500">{m.title}</p>}
                  {m.specialization && <p className="text-xs text-slate-500">{m.specialization}</p>}
                  <div className="flex items-center justify-between pt-3 text-xs">
                    <span className="text-slate-400 uppercase">{m.locale}</span>
                    <div className="inline-flex items-center gap-3">
                      <Link
                        href={`/admin/team/${m.id}`}
                        className="font-medium text-[var(--color-primary-dark)] hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton action={del} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
