'use client';

import { useTransition } from 'react';

export function DeleteButton({
  action,
  label = 'Delete',
  confirm = 'Are you sure you want to delete this?',
}: {
  action: () => Promise<void>;
  label?: string;
  confirm?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirm)) return;
        start(async () => {
          await action();
        });
      }}
      className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-60"
    >
      {pending ? '…' : label}
    </button>
  );
}
