import { useState } from 'react'
import { useConfig } from '../../context/ConfigContext'
import { Field, inputClass } from '../../components/Field'
import type { Tema } from '@shared/types'

export default function Configuracoes(): JSX.Element {
  const { config, updateConfig } = useConfig()
  const [tarifa, setTarifa] = useState(config.tarifa_kwh)
  const [umidade, setUmidade] = useState(config.umidade_relativa)
  const [salvo, setSalvo] = useState(false)

  async function salvar(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    await updateConfig({ tarifa_kwh: tarifa, umidade_relativa: umidade, tema: config.tema })
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  async function trocarTema(tema: Tema): Promise<void> {
    await updateConfig({ tarifa_kwh: tarifa, umidade_relativa: umidade, tema })
  }

  return (
    <div className="max-w-lg space-y-6">
      <form onSubmit={salvar} className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-base font-semibold">Parâmetros globais</h2>

        <Field label="Tarifa de energia (R$/kWh)">
          <input
            type="number"
            step="0.01"
            min="0"
            className={inputClass}
            value={tarifa}
            onChange={(e) => setTarifa(Number(e.target.value))}
          />
        </Field>

        <Field label="Umidade relativa do ar local (%)">
          <input
            type="number"
            step="1"
            min="0"
            max="100"
            className={inputClass}
            value={umidade}
            onChange={(e) => setUmidade(Number(e.target.value))}
          />
        </Field>

        <button type="submit" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Salvar
        </button>
        {salvo && <span className="ml-3 text-sm text-green-600">Salvo!</span>}
      </form>

      <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-base font-semibold">Tema</h2>
        <div className="flex gap-2">
          {(
            [
              { tema: 'light' as Tema, label: 'Claro', icone: '☀️' },
              { tema: 'dark' as Tema, label: 'Escuro', icone: '🌙' },
              { tema: 'system' as Tema, label: 'Sistema', icone: '🖥️' }
            ]
          ).map((opcao) => (
            <button
              key={opcao.tema}
              onClick={() => trocarTema(opcao.tema)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                config.tema === opcao.tema
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {opcao.icone} {opcao.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
