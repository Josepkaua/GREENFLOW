import { useEffect, useState } from 'react'
import { StatusBadge } from '../../components/StatusBadge'
import { ArCondicionadoFormModal } from './ArCondicionadoFormModal'
import { calcularStatusDimensionamento } from '@shared/calculations'
import type { ArCondicionado, SalaComDimensionamento } from '@shared/types'

export default function ArCondicionados(): JSX.Element {
  const [salas, setSalas] = useState<SalaComDimensionamento[]>([])
  const [modal, setModal] = useState<'create' | ArCondicionado | null>(null)

  async function carregar(): Promise<void> {
    setSalas(await window.api.salas.listComDimensionamento())
  }

  useEffect(() => {
    carregar()
  }, [])

  async function excluir(id: number): Promise<void> {
    if (!confirm('Excluir este ar-condicionado?')) return
    try {
      await window.api.ac.remove(id)
      carregar()
    } catch (err) {
      alert(`Não foi possível excluir o ar-condicionado: ${err instanceof Error ? err.message : err}`)
    }
  }

  const linhas = salas.flatMap((sala) => sala.ares.map((ac) => ({ ac, sala })))

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setModal('create')}
          disabled={salas.length === 0}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          title={salas.length === 0 ? 'Cadastre uma sala primeiro' : ''}
        >
          + Novo ar-condicionado
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Sala</th>
              <th className="px-4 py-3">Marca / Modelo</th>
              <th className="px-4 py-3">BTU instalado</th>
              <th className="px-4 py-3">Uso</th>
              <th className="px-4 py-3">Status da sala</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {linhas.map(({ ac, sala }) => {
              const { status } = calcularStatusDimensionamento(sala.btuInstaladoTotal, sala.btu_necessario)
              return (
                <tr key={ac.id} className="bg-white dark:bg-gray-900">
                  <td className="px-4 py-3 font-medium">{sala.nome}</td>
                  <td className="px-4 py-3">
                    {ac.marca} {ac.modelo}
                  </td>
                  <td className="px-4 py-3">{ac.btu_instalado.toLocaleString('pt-BR')} BTU</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {ac.horas_dia}h/dia · {ac.dias_mes}d/mês
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal(ac)} className="mr-3 text-brand-600 hover:underline">
                      Editar
                    </button>
                    <button onClick={() => excluir(ac.id)} className="text-red-500 hover:underline">
                      Excluir
                    </button>
                  </td>
                </tr>
              )
            })}
            {linhas.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Nenhum ar-condicionado cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <ArCondicionadoFormModal
          ac={modal === 'create' ? null : modal}
          salas={salas}
          onClose={() => setModal(null)}
          onSaved={carregar}
        />
      )}
    </div>
  )
}
