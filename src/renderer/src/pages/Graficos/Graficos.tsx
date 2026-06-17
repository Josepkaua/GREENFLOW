import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { useConfig } from '../../context/ConfigContext'
import { calcularAguaCondensada } from '@shared/calculations'
import type { SalaComDimensionamento } from '@shared/types'

const CORES_STATUS = {
  subdimensionado: '#ef4444',
  adequado: '#22c55e',
  superdimensionado: '#f97316'
}

export default function Graficos(): JSX.Element {
  const [salas, setSalas] = useState<SalaComDimensionamento[]>([])
  const { config } = useConfig()

  useEffect(() => {
    window.api.salas.listComDimensionamento().then(setSalas)
  }, [])

  const dadosBtu = salas.map((s) => ({
    nome: s.nome,
    necessario: s.btu_necessario,
    instalado: s.btuInstaladoTotal
  }))

  const dadosCusto = salas.map((s) => ({ nome: s.nome, custo: Number(s.gastoMensal.toFixed(2)) }))

  const dadosStatus = (['subdimensionado', 'adequado', 'superdimensionado'] as const)
    .map((status) => ({
      status,
      quantidade: salas.filter((s) => s.status === status && s.ares.length > 0).length
    }))
    .filter((d) => d.quantidade > 0)

  const dadosAgua = salas.map((s) => ({
    nome: s.nome,
    litrosMes: s.ares.reduce(
      (sum, ac) => sum + calcularAguaCondensada(ac.btu_instalado, config.umidade_relativa, ac.horas_dia, ac.dias_mes).litrosMes,
      0
    )
  }))

  if (salas.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Cadastre salas e ares-condicionados para ver os gráficos.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GraficoCard titulo="BTU necessário × instalado por sala">
        <BarChart data={dadosBtu}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="necessario" name="Necessário" fill="#16a34a" />
          <Bar dataKey="instalado" name="Instalado" fill="#86efac" />
        </BarChart>
      </GraficoCard>

      <GraficoCard titulo="Custo mensal por sala (R$)">
        <BarChart data={dadosCusto}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="custo" name="Custo (R$)" fill="#15803d" />
        </BarChart>
      </GraficoCard>

      <GraficoCard titulo="Distribuição de status de dimensionamento">
        <PieChart>
          <Pie data={dadosStatus} dataKey="quantidade" nameKey="status" outerRadius={100} label>
            {dadosStatus.map((d) => (
              <Cell key={d.status} fill={CORES_STATUS[d.status]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </GraficoCard>

      <GraficoCard titulo="Água condensada estimada por sala (L/mês)">
        <LineChart data={dadosAgua}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="litrosMes" name="Litros/mês" stroke="#0ea5e9" strokeWidth={2} />
        </LineChart>
      </GraficoCard>
    </div>
  )
}

function GraficoCard({ titulo, children }: { titulo: string; children: React.ReactElement }): JSX.Element {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">{titulo}</h2>
      <ResponsiveContainer width="100%" height={260}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}
