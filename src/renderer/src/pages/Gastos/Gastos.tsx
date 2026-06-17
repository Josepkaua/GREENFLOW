import { useEffect, useState } from 'react'
import { useConfig } from '../../context/ConfigContext'
import { calcularConsumoEnergia } from '@shared/calculations'
import { formatCurrency, formatNumber } from '../../lib/format'
import type { SalaComDimensionamento } from '@shared/types'

export default function Gastos(): JSX.Element {
  const [salas, setSalas] = useState<SalaComDimensionamento[]>([])
  const { config } = useConfig()

  useEffect(() => {
    window.api.salas.listComDimensionamento().then(setSalas)
  }, [])

  const linhas = salas.flatMap((sala) =>
    sala.ares.map((ac) => ({
      sala,
      ac,
      ...calcularConsumoEnergia(ac.potencia_w, ac.horas_dia, ac.dias_mes, config.tarifa_kwh)
    }))
  )

  const totalMes = linhas.reduce((sum, l) => sum + l.custoMes, 0)
  const totalAno = linhas.reduce((sum, l) => sum + l.custoAno, 0)

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Tarifa configurada: {formatCurrency(config.tarifa_kwh)}/kWh — ajuste em Configurações.
      </p>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Sala</th>
              <th className="px-4 py-3">Aparelho</th>
              <th className="px-4 py-3">kWh/mês</th>
              <th className="px-4 py-3">Custo/mês</th>
              <th className="px-4 py-3">Custo/ano</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {linhas.map(({ sala, ac, kWhMes, custoMes, custoAno }) => (
              <tr key={ac.id} className="bg-white dark:bg-gray-900">
                <td className="px-4 py-3 font-medium">{sala.nome}</td>
                <td className="px-4 py-3">
                  {ac.marca} {ac.modelo}
                </td>
                <td className="px-4 py-3">{formatNumber(kWhMes)} kWh</td>
                <td className="px-4 py-3">{formatCurrency(custoMes)}</td>
                <td className="px-4 py-3">{formatCurrency(custoAno)}</td>
              </tr>
            ))}
            {linhas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nenhum ar-condicionado cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
          {linhas.length > 0 && (
            <tfoot className="bg-gray-50 font-medium dark:bg-gray-800">
              <tr>
                <td className="px-4 py-3" colSpan={3}>
                  Total
                </td>
                <td className="px-4 py-3">{formatCurrency(totalMes)}</td>
                <td className="px-4 py-3">{formatCurrency(totalAno)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
