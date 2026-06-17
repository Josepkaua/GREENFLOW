import { useEffect, useState } from 'react'
import { useConfig } from '../../context/ConfigContext'
import { calcularAguaCondensada } from '@shared/calculations'
import { formatNumber } from '../../lib/format'
import type { SalaComDimensionamento } from '@shared/types'

export default function AguaDrenos(): JSX.Element {
  const [salas, setSalas] = useState<SalaComDimensionamento[]>([])
  const { config } = useConfig()

  useEffect(() => {
    window.api.salas.listComDimensionamento().then(setSalas)
  }, [])

  const linhas = salas.flatMap((sala) =>
    sala.ares.map((ac) => ({
      sala,
      ac,
      ...calcularAguaCondensada(ac.btu_instalado, config.umidade_relativa, ac.horas_dia, ac.dias_mes)
    }))
  )

  const totalDia = linhas.reduce((sum, l) => sum + l.litrosDia, 0)

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Umidade relativa configurada: {config.umidade_relativa}% — ajuste em Configurações. Fórmula: Marinho et al. (2021),
        Research, Society and Development v.10 n.13 — Q(L/h) = P·1,130×10⁻⁴ + H·2,275×10⁻² − 1,944.
      </p>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Sala</th>
              <th className="px-4 py-3">Aparelho</th>
              <th className="px-4 py-3">L/h</th>
              <th className="px-4 py-3">L/dia</th>
              <th className="px-4 py-3">L/mês</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {linhas.map(({ sala, ac, litrosHora, litrosDia, litrosMes }) => (
              <tr key={ac.id} className="bg-white dark:bg-gray-900">
                <td className="px-4 py-3 font-medium">{sala.nome}</td>
                <td className="px-4 py-3">
                  {ac.marca} {ac.modelo}
                </td>
                <td className="px-4 py-3">{formatNumber(litrosHora, 2)} L</td>
                <td className="px-4 py-3">{formatNumber(litrosDia)} L</td>
                <td className="px-4 py-3">{formatNumber(litrosMes)} L</td>
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
                <td className="px-4 py-3" colSpan={4}>
                  Total estimado por dia
                </td>
                <td className="px-4 py-3">{formatNumber(totalDia)} L/dia</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
