import type { ReactNode } from 'react'

export const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800'

export function Field({ label, children }: { label: string; children: ReactNode }): JSX.Element {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-gray-600 dark:text-gray-300">{label}</span>
      {children}
    </label>
  )
}
