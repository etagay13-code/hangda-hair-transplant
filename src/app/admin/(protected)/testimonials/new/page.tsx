import { PageHeader } from '@/components/admin/Toolbar';
import { TestimonialForm } from '../TestimonialForm';
import { createTestimonial } from '../actions';

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New testimonial" description="Add a patient story." />
      <TestimonialForm
        action={createTestimonial}
        defaults={{ rating: 5, is_active: true, is_featured: false, locale: 'en' }}
        submitLabel="Create"
      />
    </div>
  );
}
