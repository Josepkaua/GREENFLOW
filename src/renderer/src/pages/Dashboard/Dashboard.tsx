import { useEffect, useState } from 'react'
import { Card } from '../../components/Card'
import { formatCurrency, formatNumber } from '../../lib/format'
import type { DashboardSummary } from '@shared/types'

export default function Dashboard(): JSX.Element {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  useEffect(() => {
    window.api.dashboard.summary().then(setSummary)
  }, [])

  if (!summary) return <p className="text-sm text-gray-500">Carregando...</p>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card title="Salas cadastradas" value={summary.numSalas} icon="🏫" />
        <Card title="Ares-condicionados" value={summary.numAres} icon="❄️" />
        <Card title="Gasto mensal total" value={formatCurrency(summary.gastoMensalTotal)} icon="💰" />
        <Card title="Água condensada/dia" value={`${formatNumber(summary.litrosDiaTotal)} L`} icon="💧" />
        <Card
          title="Status geral"
          icon="📐"
          value={`${summary.adequadas}/${summary.numSalas}`}
          subtitle={`${summary.subdimensionadas} sub · ${summary.superdimensionadas} super`}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-base font-semibold">Sugestões de troca entre salas</h2>
        {summary.sugestoesTroca.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nenhuma sugestão no momento — não há pares de salas super/subdimensionadas que se resolveriam com uma troca.
          </p>
        ) : (
          <ul className="space-y-2">
            {summary.sugestoesTroca.map((s, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              >
                <span>🔄</span>
                Trocar o(s) aparelho(s) de <strong>{s.salaSuperNome}</strong> (superdimensionada) com{' '}
                <strong>{s.salaSubNome}</strong> (subdimensionada) deixaria ambas adequadas.
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
