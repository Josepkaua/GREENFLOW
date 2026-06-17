import { useState } from 'react'
import { Modal } from '../../components/Modal'
import { Field, inputClass } from '../../components/Field'
import { MODELOS_COMERCIAIS_BTU } from '@shared/calculations'
import type { ArCondicionado, ArCondicionadoInput, Sala } from '@shared/types'

interface ArCondicionadoFormModalProps {
  ac: ArCondicionado | null
  salas: Sala[]
  salaIdPadrao?: number
  onClose: () => void
  onSaved: () => void
}

function valoresIniciais(ac: ArCondicionado | null, salaIdPadrao?: number): ArCondicionadoInput {
  if (ac) {
    return {
      sala_id: ac.sala_id,
      marca: ac.marca,
      modelo: ac.modelo,
      btu_instalado: ac.btu_instalado,
      potencia_w: ac.potencia_w,
      horas_dia: ac.horas_dia,
      dias_mes: ac.dias_mes
    }
  }
  return {
    sala_id: salaIdPadrao ?? 0,
    marca: '',
    modelo: '',
    btu_instalado: 12000,
    potencia_w: 1200,
    horas_dia: 8,
    dias_mes: 22
  }
}

export function ArCondicionadoFormModal({ ac, salas, salaIdPadrao, onClose, onSaved }: ArCondicionadoFormModalProps): JSX.Element {
  const [form, setForm] = useState<ArCondicionadoInput>(valoresIniciais(ac, salaIdPadrao))
  const [salvando, setSalvando] = useState(false)

  function update<K extends keyof ArCondicionadoInput>(key: K, value: ArCondicionadoInput[K]): void {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setSalvando(true)
    try {
      if (ac) await window.api.ac.update(ac.id, form)
      else await window.api.ac.create(form)
      onSaved()
      onClose()
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Modal title={ac ? 'Editar ar-condicionado' : 'Novo ar-condicionado'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Sala">
          <select
            required
            data-testid="ac-sala"
            className={inputClass}
            value={form.sala_id || ''}
            onChange={(e) => update('sala_id', Number(e.target.value))}
          >
            <option value="" disabled>
              Selecione uma sala
            </option>
            {salas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Marca">
            <input
              required
              data-testid="ac-marca"
              className={inputClass}
              value={form.marca}
              onChange={(e) => update('marca', e.target.value)}
            />
          </Field>
          <Field label="Modelo">
            <input
              required
              data-testid="ac-modelo"
              className={inputClass}
              value={form.modelo}
              onChange={(e) => update('modelo', e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="BTU instalado">
            <select
              data-testid="ac-btu"
              className={inputClass}
              value={form.btu_instalado}
              onChange={(e) => update('btu_instalado', Number(e.target.value))}
            >
              {MODELOS_COMERCIAIS_BTU.map((btu) => (
                <option key={btu} value={btu}>
                  {btu.toLocaleString('pt-BR')} BTU
                </option>
              ))}
            </select>
          </Field>
          <Field label="Potência (W)">
            <input
              required
              type="number"
              min="0"
              data-testid="ac-potencia"
              className={inputClass}
              value={form.potencia_w}
              onChange={(e) => update('potencia_w', Number(e.target.value))}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Horas de uso/dia">
            <input
              required
              type="number"
              min="0"
              max="24"
              data-testid="ac-horas"
              className={inputClass}
              value={form.horas_dia}
              onChange={(e) => update('horas_dia', Number(e.target.value))}
            />
          </Field>
          <Field label="Dias de uso/mês">
            <input
              required
              type="number"
              min="0"
              max="31"
              data-testid="ac-dias"
              className={inputClass}
              value={form.dias_mes}
              onChange={(e) => update('dias_mes', Number(e.target.value))}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando || !form.sala_id}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
