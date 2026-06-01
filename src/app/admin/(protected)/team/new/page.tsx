import { PageHeader } from '@/components/admin/Toolbar';
import { TeamForm } from '../TeamForm';
import { createMember } from '../actions';

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New team member" description="Add a doctor, technician or coordinator." />
      <TeamForm
        action={createMember}
        defaults={{ is_active: true, locale: 'en', order_index: 0 }}
        submitLabel="Create"
      />
    </div>
  );
}
