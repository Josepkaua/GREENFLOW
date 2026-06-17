import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/salas', label: 'Salas', icon: '🏫' },
  { to: '/ares-condicionados', label: 'Ares-Condicionados', icon: '❄️' },
  { to: '/calculadora', label: 'Calculadora BTU', icon: '🧮' },
  { to: '/gastos', label: 'Gastos', icon: '💰' },
  { to: '/agua', label: 'Água / Drenos', icon: '💧' },
  { to: '/graficos', label: 'Gráficos', icon: '📊' },
  { to: '/relatorio', label: 'Relatório PDF', icon: '📄' },
  { to: '/configuracoes', label: 'Configurações', icon: '⚙️' }
]

export function Sidebar(): JSX.Element {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="text-2xl">🌱</span>
        <span className="text-lg font-semibold text-brand-700 dark:text-brand-400">Green Flow</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 text-xs text-gray-400 dark:text-gray-500">Gestão inteligente de A/C</div>
    </aside>
  )
}
