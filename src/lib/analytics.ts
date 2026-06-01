/**
 * Unified analytics utilities for Google Analytics 4, GTM dataLayer, and Meta Pixel.
 * All tracking IDs come from site_settings at runtime via providers; these helpers
 * are safe to call from anywhere in the client and noop on the server.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const isBrowser = () => typeof window !== 'undefined';

export function pushDataLayer(event: Record<string, unknown>) {
  if (!isBrowser()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

export function gaEvent(name: string, params: Record<string, unknown> = {}) {
  if (!isBrowser()) return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}

export function fbEvent(name: string, params: Record<string, unknown> = {}) {
  if (!isBrowser()) return;
  if (typeof window.fbq === 'function') {
    window.fbq('track', name, params);
  }
}

export function trackPageView(url: string, locale?: string) {
  pushDataLayer({ event: 'page_view', page_location: url, locale });
  gaEvent('page_view', { page_location: url, locale });
  fbEvent('PageView');
}

export function trackFormSubmit(formName: string, meta: Record<string, unknown> = {}) {
  pushDataLayer({ event: 'form_submit', form_name: formName, ...meta });
  gaEvent('form_submit', { form_name: formName, ...meta });
  fbEvent('Lead', { content_name: formName, ...meta });
  sendServerEvent({ event_type: 'form_submit', event_data: { form_name: formName, ...meta } });
}

export function trackButtonClick(label: string, meta: Record<string, unknown> = {}) {
  pushDataLayer({ event: 'button_click', button_label: label, ...meta });
  gaEvent('button_click', { button_label: label, ...meta });
}

export function trackWhatsAppClick(meta: Record<string, unknown> = {}) {
  pushDataLayer({ event: 'whatsapp_click', ...meta });
  gaEvent('whatsapp_click', meta);
  fbEvent('Contact', { method: 'whatsapp', ...meta });
  sendServerEvent({ event_type: 'whatsapp_click', event_data: meta });
}

export function trackPhoneClick(meta: Record<string, unknown> = {}) {
  pushDataLayer({ event: 'phone_click', ...meta });
  gaEvent('phone_click', meta);
  fbEvent('Contact', { method: 'phone', ...meta });
}

export function trackConsultationRequest(meta: Record<string, unknown> = {}) {
  pushDataLayer({ event: 'consultation_request', ...meta });
  gaEvent('generate_lead', { value: 1, currency: 'EUR', ...meta });
  fbEvent('CompleteRegistration', meta);
  sendServerEvent({ event_type: 'consultation_request', event_data: meta });
}

function sendServerEvent(payload: Record<string, unknown>) {
  if (!isBrowser()) return;
  try {
    void fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        page_url: window.location.href,
        locale: document.documentElement.lang,
      }),
      keepalive: true,
    });
  } catch {
    // best-effort, never throw from analytics
  }
}
