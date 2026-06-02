import { PageHeader } from '@/components/admin/Toolbar';
import { BlogForm } from '../BlogForm';
import { createBlogPost } from '../actions';

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New post" description="Draft a new blog article." />
      <BlogForm
        action={createBlogPost}
        defaults={{ locale: 'en', is_published: false, author: 'MyHaar Team' }}
        submitLabel="Create"
      />
    </div>
  );
}
