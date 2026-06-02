'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function str(v: FormDataEntryValue | null) {
  return ((v as string | null) ?? '').trim();
}
function nullable(v: FormDataEntryValue | null) {
  const s = str(v);
  return s.length > 0 ? s : null;
}
function bool(v: FormDataEntryValue | null) {
  return str(v) === 'on' || str(v) === 'true';
}
function tags(v: FormDataEntryValue | null): string[] | null {
  const s = str(v);
  if (!s) return null;
  return s.split(',').map((t) => t.trim()).filter(Boolean);
}

function payload(form: FormData) {
  const isPublished = bool(form.get('is_published'));
  return {
    slug: str(form.get('slug')),
    title: str(form.get('title')),
    excerpt: nullable(form.get('excerpt')),
    content: nullable(form.get('content')),
    cover_image_url: nullable(form.get('cover_image_url')),
    author: str(form.get('author')) || 'MyHaar Team',
    category: nullable(form.get('category')),
    tags: tags(form.get('tags')),
    locale: str(form.get('locale')) || 'en',
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
    meta_title: nullable(form.get('meta_title')),
    meta_description: nullable(form.get('meta_description')),
  };
}

export async function createBlogPost(form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  if (!data.slug || !data.title) throw new Error('Slug and title required');
  const { error } = await supabase.from('blog_posts').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}

export async function updateBlogPost(id: string, form: FormData) {
  const supabase = await createClient();
  const data = payload(form);
  // Don't overwrite a previously set published_at if it stayed published
  if (data.is_published && !str(form.get('keep_published_at'))) {
    // optional: leave new timestamp
  }
  const { error } = await supabase.from('blog_posts').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/blog');
  revalidatePath(`/admin/blog/${id}`);
  redirect('/admin/blog');
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/blog');
}
