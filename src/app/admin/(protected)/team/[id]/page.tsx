import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { TeamForm } from '../TeamForm';
import { updateMember } from '../actions';
import type { TeamMember } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTeamPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('team_members').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const member = data as TeamMember;

  const action = updateMember.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={member.name}
        description="Edit profile."
        actions={
          <Link
            href="/admin/team"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            ← Back
          </Link>
        }
      />
      <TeamForm action={action} defaults={member} submitLabel="Save changes" />
    </div>
  );
}
