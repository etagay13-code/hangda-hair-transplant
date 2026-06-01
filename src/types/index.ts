export * from './database';

export type Locale = 'en' | 'nl' | 'tr';

export const LOCALES: Locale[] = ['en', 'nl', 'tr'];
export const DEFAULT_LOCALE: Locale = 'en';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ContactFormPayload {
  name: string;
  email?: string;
  phone?: string;
  country?: string;
  message?: string;
  service_interest?: string;
  hair_loss_type?: string;
  source_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  locale?: Locale;
}

export interface AnalyticsEventPayload {
  event_type: string;
  event_data?: Record<string, unknown>;
  page_url?: string;
  locale?: Locale;
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export type FormName =
  | 'contact'
  | 'consultation'
  | 'quote'
  | 'callback'
  | 'newsletter';

export type StorageBucket = 'gallery' | 'blog' | 'team' | 'general';
