import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { TestimonialForm } from '../TestimonialForm';
import { updateTestimonial } from '../actions';
import type { Testimonial } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('testimonials').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const t = data as Testimonial;

  const action = updateTestimonial.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.name}
        description="Edit testimonial."
        actions={
          <Link
            href="/admin/testimonials"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            ← Back
          </Link>
        }
      />
      <TestimonialForm action={action} defaults={t} submitLabel="Save changes" />
    </div>
  );
}
