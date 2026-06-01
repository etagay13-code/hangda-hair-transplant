import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/admin');

  const { redirect: redirectPath, error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white border border-slate-200 shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Login</h1>
        <p className="text-slate-600 mt-1 text-sm">
          Sign in to manage site content.
        </p>
        {error && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <LoginForm redirectTo={redirectPath} />
      </div>
    </div>
  );
}
