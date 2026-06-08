import { getTranslations } from 'next-intl/server';
import { getSetting, getSiteSettings } from '@/lib/settings';
import { CampaignPopup, type PopupCopy } from './CampaignPopup';

function bool(value: string | null | undefined, fallback = true): boolean {
  if (value == null) return fallback;
  const v = value.trim().toLowerCase();
  if (v === 'false' || v === '0' || v === 'no' || v === 'off') return false;
  if (v === 'true' || v === '1' || v === 'yes' || v === 'on') return true;
  return fallback;
}

function num(value: string | null | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Resolves the popup content from site_settings (admin-edited overrides)
 * and falls back to the Popup translation namespace for any key the admin
 * has left blank. This way editors can tweak just the headline without
 * losing the other strings.
 */
export async function CampaignPopupServer({ locale }: { locale: string }) {
  const [settings, t] = await Promise.all([
    getSiteSettings(locale),
    getTranslations({ locale, namespace: 'Popup' }),
  ]);

  if (!bool(getSetting(settings, 'popup_enabled'), true)) return null;

  const whatsapp = getSetting(settings, 'contact_whatsapp');
  const delaySeconds = num(getSetting(settings, 'popup_delay_seconds'), 6);
  const dismissHours = num(getSetting(settings, 'popup_dismiss_hours'), 24);

  // Resolve each editable string. Empty/null DB value → translation.
  const pick = (key: string, fallback: string) => {
    const v = getSetting(settings, key);
    return v && v.trim().length > 0 ? v : fallback;
  };

  const copy: PopupCopy = {
    lineOne: pick('popup_line_one', t('lineOne')),
    lineTwo: pick('popup_line_two', t('lineTwo')),
    lineThree: pick('popup_line_three', t('lineThree')),
    check1: pick('popup_check_1', t('checks.summer')),
    check2: pick('popup_check_2', t('checks.slots')),
    cta: pick('popup_cta', t('cta')),
    disclaimer: pick('popup_disclaimer', t('disclaimer')),
    rightTitle: pick('popup_right_title', t('rightTitle')),
    card1: pick('popup_card_1', t('cards.plan')),
    card2: pick('popup_card_2', t('cards.clinic')),
    card3: pick('popup_card_3', t('cards.consult')),
    card4: pick('popup_card_4', t('cards.guarantee')),
    whatsappMessage: pick('popup_whatsapp_message', t('whatsappMessage')),
    closeLabel: t('close'),
  };

  return (
    <CampaignPopup
      whatsapp={whatsapp || undefined}
      delayMs={delaySeconds * 1000}
      dismissHours={dismissHours}
      copy={copy}
    />
  );
}
