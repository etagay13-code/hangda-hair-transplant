import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ApiResponse, ContactFormPayload } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(40).optional().or(z.literal('')),
  country: z.string().max(80).optional().or(z.literal('')),
  message: z.string().max(4000).optional().or(z.literal('')),
  service_interest: z.string().max(120).optional().or(z.literal('')),
  hair_loss_type: z.string().max(80).optional().or(z.literal('')),
  source_page: z.string().max(500).optional().or(z.literal('')),
  utm_source: z.string().max(120).optional().or(z.literal('')),
  utm_medium: z.string().max(120).optional().or(z.literal('')),
  utm_campaign: z.string().max(120).optional().or(z.literal('')),
  locale: z.enum(['en', 'nl', 'tr']).optional(),
  form_name: z.string().max(60).optional(),
  // honeypot
  website: z.string().max(0).optional(),
});

function nullable(value?: string) {
  return value && value.length > 0 ? value : null;
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => null);
    if (!json) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const parsed = contactSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Validation failed' },
        { status: 422 }
      );
    }

    const payload = parsed.data as ContactFormPayload & { form_name?: string };
    const formName = (json.form_name as string) || 'contact';

    const supabase = createAdminClient();

    const { data: inserted, error: insertError } = await supabase
      .from('contacts')
      .insert({
        name: payload.name,
        email: nullable(payload.email),
        phone: nullable(payload.phone),
        country: nullable(payload.country),
        message: nullable(payload.message),
        service_interest: nullable(payload.service_interest),
        hair_loss_type: nullable(payload.hair_loss_type),
        source_page: nullable(payload.source_page),
        utm_source: nullable(payload.utm_source),
        utm_medium: nullable(payload.utm_medium),
        utm_campaign: nullable(payload.utm_campaign),
        locale: payload.locale ?? 'en',
        status: 'new',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Contact insert error:', insertError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Could not save submission' },
        { status: 500 }
      );
    }

    // Look up form redirect config (webhook + success URL)
    const { data: redirect } = await supabase
      .from('form_redirects')
      .select('*')
      .eq('form_name', formName)
      .eq('is_active', true)
      .maybeSingle();

    // Fire webhook (best-effort, do not block response)
    if (redirect?.webhook_url) {
      void fetch(redirect.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formName, submission: inserted }),
      }).catch((err) => console.error('Webhook error:', err));
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        id: inserted?.id,
        success_url: redirect?.success_url ?? null,
      },
      message: 'Submission received',
    });
  } catch (err) {
    console.error('Contact route error:', err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
