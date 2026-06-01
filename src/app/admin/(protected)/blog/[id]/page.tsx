import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/Toolbar';
import { BlogForm } from '../BlogForm';
import { updateBlogPost } from '../actions';
import type { BlogPost } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('blog_posts').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();
  const post = data as BlogPost;

  const action = updateBlogPost.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={post.title}
        description="Edit this article."
        actions={
          <Link
            href="/admin/blog"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            ← Back
          </Link>
        }
      />
      <BlogForm action={action} defaults={post} submitLabel="Save changes" />
    </div>
  );
}
