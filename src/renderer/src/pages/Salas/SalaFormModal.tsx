import { useState } from 'react'
import { Modal } from '../../components/Modal'
import { Field, inputClass } from '../../components/Field'
import { calcularDetalhamentoBtu } from '@shared/calculations'
import type { Sala, SalaInput } from '@shared/types'

const VAZIO: SalaInput = {
  nome: '',
  comprimento: 5,
  largura: 4,
  altura: 2.8,
  num_pessoas: 2,
  num_eletronicos: 1,
  sol_direto: false,
  tipo_ambiente: 'padrao',
  observacoes: ''
}

interface SalaFormModalProps {
  sala: Sala | null
  onClose: () => void
  onSaved: () => void
}

export function SalaFormModal({ sala, onClose, onSaved }: SalaFormModalProps): JSX.Element {
  const [form, setForm] = useState<SalaInput>(
    sala
      ? {
          nome: sala.nome,
          comprimento: sala.comprimento,
          largura: sala.largura,
          altura: sala.altura,
          num_pessoas: sala.num_pessoas,
          num_eletronicos: sala.num_eletronicos,
          sol_direto: sala.sol_direto,
          tipo_ambiente: sala.tipo_ambiente,
          observacoes: sala.observacoes ?? ''
        }
      : VAZIO
  )
  const [salvando, setSalvando] = useState(false)

  const detalhamento = calcularDetalhamentoBtu(form)

  function update<K extends keyof SalaInput>(key: K, value: SalaInput[K]): void {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setSalvando(true)
    try {
      if (sala) await window.api.salas.update(sala.id, form)
      else await window.api.salas.create(form)
      onSaved()
      onClose()
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal title={sala ? 'Editar sala' : 'Nova sala'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nome da sala">
          <input
            required
            data-testid="sala-nome"
            className={inputClass}
            value={form.nome}
            onChange={(e) => update('nome', e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Comprimento (m)">
            <input
              required
              type="number"
              step="0.1"
              min="0"
              data-testid="sala-comprimento"
              className={inputClass}
              value={form.comprimento}
              onChange={(e) => update('comprimento', Number(e.target.value))}
            />
          </Field>
          <Field label="Largura (m)">
            <input
              required
              type="number"
              step="0.1"
              min="0"
              data-testid="sala-largura"
              className={inputClass}
              value={form.largura}
              onChange={(e) => update('largura', Number(e.target.value))}
            />
          </Field>
          <Field label="Pé-direito (m)">
            <input
              required
              type="number"
              step="0.1"
              min="0"
              data-testid="sala-altura"
              className={inputClass}
              value={form.altura}
              onChange={(e) => update('altura', Number(e.target.value))}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Nº de pessoas">
            <input
              type="number"
              min="0"
              data-testid="sala-pessoas"
              className={inputClass}
              value={form.num_pessoas}
              onChange={(e) => update('num_pessoas', Number(e.target.value))}
            />
          </Field>
          <Field label="Nº de eletrônicos">
            <input
              type="number"
              min="0"
              data-testid="sala-eletronicos"
              className={inputClass}
              value={form.num_eletronicos}
              onChange={(e) => update('num_eletronicos', Number(e.target.value))}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo de ambiente">
            <select
              className={inputClass}
              value={form.tipo_ambiente}
              onChange={(e) => update('tipo_ambiente', e.target.value as SalaInput['tipo_ambiente'])}
            >
              <option value="padrao">Padrão</option>
              <option value="cozinha">Cozinha</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 pt-6 text-sm">
            <input
              type="checkbox"
              checked={form.sol_direto}
              onChange={(e) => update('sol_direto', e.target.checked)}
            />
            Sol direto (mais de 4h/dia)
          </label>
        </div>

        <Field label="Observações">
          <textarea
            className={inputClass}
            rows={2}
            value={form.observacoes ?? ''}
            onChange={(e) => update('observacoes', e.target.value)}
          />
        </Field>

        <div className="rounded-lg bg-brand-50 p-4 text-sm dark:bg-brand-900/20">
          <p className="font-medium text-brand-800 dark:text-brand-300">
            BTU necessário estimado: {detalhamento.btuNecessarioComercial.toLocaleString('pt-BR')} BTU
          </p>
          <p className="mt-1 text-xs text-brand-700/80 dark:text-brand-400/80">
            Base: {Math.round(detalhamento.btuBase).toLocaleString('pt-BR')} BTU · Correções:{' '}
            {Math.round((detalhamento.percentualPeDireito + detalhamento.percentualSolDireto + detalhamento.percentualCozinha) * 100)}% ·
            Fixos: {detalhamento.btuFixoPessoas + detalhamento.btuFixoEletronicos} BTU
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
