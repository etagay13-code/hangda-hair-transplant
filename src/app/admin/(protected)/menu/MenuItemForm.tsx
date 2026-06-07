import { routing } from '@/i18n/routing';
import type { NavItem } from '@/types';

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<NavItem>;
  submitLabel?: string;
}

export function MenuItemForm({ action, defaults = {}, submitLabel = 'Save' }: Props) {
  return (
    <form action={action} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label-field">Label <span className="text-red-500">*</span></span>
          <input
            type="text"
            name="label"
            required
            defaultValue={defaults.label ?? ''}
            placeholder="About Us"
            className="input-field mt-1.5"
          />
        </label>
        <label className="block">
          <span className="label-field">URL / Anchor <span className="text-red-500">*</span></span>
          <input
            type="text"
            name="href"
            required
            defaultValue={defaults.href ?? ''}
            placeholder="/about or #contact"
            className="input-field mt-1.5"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        <label className="block">
          <span className="label-field">Group</span>
          <select
            name="group_key"
            defaultValue={defaults.group_key ?? 'primary'}
            className="input-field mt-1.5"
          >
            <option value="primary">Primary (navbar)</option>
            <option value="footer">Footer</option>
          </select>
        </label>
        <label className="block">
          <span className="label-field">Open in</span>
          <select
            name="target"
            defaultValue={defaults.target ?? '_self'}
            className="input-field mt-1.5"
          >
            <option value="_self">Same tab</option>
            <option value="_blank">New tab</option>
          </select>
        </label>
        <label className="block">
          <span className="label-field">Locale</span>
          <select name="locale" defaultValue={defaults.locale ?? 'all'} className="input-field mt-1.5">
            <option value="all">All locales</option>
            {routing.locales.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label-field">Order</span>
          <input
            type="number"
            name="order_index"
            defaultValue={(defaults.order_index ?? 0).toString()}
            className="input-field mt-1.5"
          />
        </label>
      </div>

      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={defaults.is_active ?? true}
          className="h-4 w-4 rounded border-slate-300"
        />
        Show this item
      </label>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">{submitLabel}</button>
      </div>
    </form>
  );
}
