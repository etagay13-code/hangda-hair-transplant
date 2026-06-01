import { routing } from '@/i18n/routing';
import type { Faq } from '@/types';

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaults?: Partial<Faq>;
  submitLabel?: string;
}

export function FaqForm({ action, defaults = {}, submitLabel = 'Save' }: Props) {
  return (
    <form action={action} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <label className="block">
        <span className="label-field">Question <span className="text-red-500">*</span></span>
        <input
          type="text"
          name="question"
          required
          defaultValue={defaults.question ?? ''}
          className="input-field mt-1.5"
        />
      </label>
      <label className="block">
        <span className="label-field">Answer <span className="text-red-500">*</span></span>
        <textarea
          name="answer"
          rows={5}
          required
          defaultValue={defaults.answer ?? ''}
          className="input-field mt-1.5"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="label-field">Category</span>
          <input
            type="text"
            name="category"
            defaultValue={defaults.category ?? 'general'}
            className="input-field mt-1.5"
          />
        </label>
        <label className="block">
          <span className="label-field">Locale</span>
          <select name="locale" defaultValue={defaults.locale ?? 'en'} className="input-field mt-1.5">
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
        Active
      </label>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary">{submitLabel}</button>
      </div>
    </form>
  );
}
