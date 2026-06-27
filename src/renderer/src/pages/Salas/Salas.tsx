import { useEffect, useState } from 'react'
import { StatusBadge } from '../../components/StatusBadge'
import { SalaFormModal } from './SalaFormModal'
import type { Sala, SalaComDimensionamento } from '@shared/types'

export default function Salas(): JSX.Element {
  const [salas, setSalas] = useState<SalaComDimensionamento[]>([])
  const [modal, setModal] = useState<'create' | Sala | null>(null)

  async function carregar(): Promise<void> {
    setSalas(await window.api.salas.listComDimensionamento())
  }

  useEffect(() => {
    carregar()
  }, [])

  async function excluir(id: number): Promise<void> {
    if (!confirm('Excluir esta sala e os ares-condicionados vinculados a ela?')) return
    try {
      await window.api.salas.remove(id)
      carregar()
    } catch (err) {
      alert(`Não foi possível excluir a sala: ${err instanceof Error ? err.message : err}`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setModal('create')}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Nova sala
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Dimensões</th>
              <th className="px-4 py-3">BTU necessário</th>
              <th className="px-4 py-3">ACs</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {salas.map((sala) => (
              <tr key={sala.id} className="bg-white dark:bg-gray-900">
                <td className="px-4 py-3 font-medium">{sala.nome}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {sala.comprimento}×{sala.largura}×{sala.altura} m
                </td>
                <td className="px-4 py-3">{sala.btu_necessario.toLocaleString('pt-BR')} BTU</td>
                <td className="px-4 py-3">{sala.ares.length}</td>
                <td className="px-4 py-3">{sala.ares.length > 0 ? <StatusBadge status={sala.status} /> : '—'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setModal(sala)} className="mr-3 text-brand-600 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => excluir(sala.id)} className="text-red-500 hover:underline">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {salas.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma sala cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <SalaFormModal
          sala={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={carregar}
        />
      )}
    </div>
  )
}
