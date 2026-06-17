import type { ReactNode } from 'react'

interface CardProps {
  title: string
  value: ReactNode
  subtitle?: string
  icon?: string
}

export function Card({ title, value, subtitle, icon }: CardProps): JSX.Element {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {subtitle && <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">{subtitle}</div>}
    </div>
  )
}
