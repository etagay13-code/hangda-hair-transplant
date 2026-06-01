import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ApiResponse, Json } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const eventSchema = z.object({
  event_type: z.string().min(1).max(80),
  event_data: z.record(z.string(), z.unknown()).optional(),
  page_url: z.string().max(2000).optional(),
  locale: z.string().max(8).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => null);
    if (!json) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    const parsed = eventSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Validation failed' },
        { status: 422 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('analytics_events').insert({
      event_type: parsed.data.event_type,
      event_data: (parsed.data.event_data as Json | undefined) ?? null,
      page_url: parsed.data.page_url ?? null,
      locale: parsed.data.locale ?? null,
    });

    if (error) {
      console.error('Analytics insert error:', error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Could not log event' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true });
  } catch (err) {
    console.error('Analytics route error:', err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
