import { useMemo, useState } from 'react'
import { Field, inputClass } from '../../components/Field'
import { calcularDetalhamentoBtu, calcularStatusDimensionamento, MODELOS_COMERCIAIS_BTU } from '@shared/calculations'
import type { FatoresBtu } from '@shared/calculations'

const INICIAL: FatoresBtu = {
  comprimento: 5,
  largura: 4,
  altura: 2.8,
  num_pessoas: 2,
  num_eletronicos: 1,
  sol_direto: false,
  tipo_ambiente: 'padrao'
}

export default function CalculadoraBTU(): JSX.Element {
  const [form, setForm] = useState<FatoresBtu>(INICIAL)
  const [btuTeste, setBtuTeste] = useState<number | null>(null)

  function update<K extends keyof FatoresBtu>(key: K, value: FatoresBtu[K]): void {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const detalhamento = useMemo(() => calcularDetalhamentoBtu(form), [form])
  const btuParaTestar = btuTeste ?? detalhamento.btuNecessarioComercial
  const { percentual, status } = calcularStatusDimensionamento(btuParaTestar, detalhamento.btuNecessarioComercial)

  const corBarra = status === 'adequado' ? 'bg-green-500' : status === 'subdimensionado' ? 'bg-red-500' : 'bg-orange-500'

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-base font-semibold">Dados da sala</h2>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Comprimento (m)">
            <input type="number" step="0.1" min="0" className={inputClass} value={form.comprimento} onChange={(e) => update('comprimento', Number(e.target.value))} />
          </Field>
          <Field label="Largura (m)">
            <input type="number" step="0.1" min="0" className={inputClass} value={form.largura} onChange={(e) => update('largura', Number(e.target.value))} />
          </Field>
          <Field label="Pé-direito (m)">
            <input type="number" step="0.1" min="0" className={inputClass} value={form.altura} onChange={(e) => update('altura', Number(e.target.value))} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Nº de pessoas">
            <input type="number" min="0" className={inputClass} value={form.num_pessoas} onChange={(e) => update('num_pessoas', Number(e.target.value))} />
          </Field>
          <Field label="Nº de eletrônicos">
            <input type="number" min="0" className={inputClass} value={form.num_eletronicos} onChange={(e) => update('num_eletronicos', Number(e.target.value))} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipo de ambiente">
            <select className={inputClass} value={form.tipo_ambiente} onChange={(e) => update('tipo_ambiente', e.target.value as FatoresBtu['tipo_ambiente'])}>
              <option value="padrao">Padrão</option>
              <option value="cozinha">Cozinha</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 pt-6 text-sm">
            <input type="checkbox" checked={form.sol_direto} onChange={(e) => update('sol_direto', e.target.checked)} />
            Sol direto (mais de 4h/dia)
          </label>
        </div>

        <Field label="Testar com BTU instalado (opcional)">
          <select className={inputClass} value={btuTeste ?? ''} onChange={(e) => setBtuTeste(e.target.value ? Number(e.target.value) : null)}>
            <option value="">Usar modelo sugerido ({detalhamento.btuNecessarioComercial.toLocaleString('pt-BR')} BTU)</option>
            {MODELOS_COMERCIAIS_BTU.map((btu) => (
              <option key={btu} value={btu}>
                {btu.toLocaleString('pt-BR')} BTU
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-base font-semibold">Resultado</h2>

        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">Volume da sala</dt>
            <dd>{detalhamento.volume.toFixed(2)} m³</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">BTU base (volume × 200)</dt>
            <dd>{Math.round(detalhamento.btuBase).toLocaleString('pt-BR')} BTU</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">Correção pé-direito</dt>
            <dd>+{Math.round(detalhamento.percentualPeDireito * 100)}%</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">Correção sol direto</dt>
            <dd>+{Math.round(detalhamento.percentualSolDireto * 100)}%</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">Correção cozinha</dt>
            <dd>+{Math.round(detalhamento.percentualCozinha * 100)}%</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">Pessoas além de 2</dt>
            <dd>+{detalhamento.btuFixoPessoas} BTU</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 dark:text-gray-400">Eletrônicos em uso</dt>
            <dd>+{detalhamento.btuFixoEletronicos} BTU</dd>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-1 font-medium dark:border-gray-800">
            <dt>BTU necessário (bruto)</dt>
            <dd>{Math.round(detalhamento.btuNecessarioBruto).toLocaleString('pt-BR')} BTU</dd>
          </div>
        </dl>

        <div className="rounded-lg bg-brand-50 p-4 dark:bg-brand-900/20">
          <p className="text-sm font-medium text-brand-800 dark:text-brand-300">Modelo comercial sugerido</p>
          <p className="text-2xl font-semibold text-brand-700 dark:text-brand-400">
            {detalhamento.btuNecessarioComercial.toLocaleString('pt-BR')} BTU
          </p>
          {detalhamento.excedeMaiorModelo && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              Excede o maior modelo padrão — considere múltiplas unidades.
            </p>
          )}
        </div>

        <div>
          <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Barra de adequação</span>
            <span>{percentual.toFixed(0)}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div className={`h-full ${corBarra} transition-all`} style={{ width: `${Math.min(150, percentual)}%` }} />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {btuParaTestar.toLocaleString('pt-BR')} BTU instalado vs. {detalhamento.btuNecessarioComercial.toLocaleString('pt-BR')} BTU necessário
          </p>
        </div>
      </div>
    </div>
  )
}
