import { listSalas } from '../db/repositories/salasRepository'
import { listArCondicionados } from '../db/repositories/arCondicionadosRepository'
import { getConfig } from '../db/repositories/configRepository'
import {
  calcularConsumoEnergia,
  calcularAguaCondensada,
  calcularStatusDimensionamento,
  sugerirTrocas
} from '@shared/calculations'
import type { SalaComDimensionamento, DashboardSummary } from '@shared/types'

export function getSalasComDimensionamento(): SalaComDimensionamento[] {
  const salas = listSalas()
  const todosAres = listArCondicionados()
  const config = getConfig()

  return salas.map((sala) => {
    const ares = todosAres.filter((ac) => ac.sala_id === sala.id)
    const btuInstaladoTotal = ares.reduce((sum, ac) => sum + ac.btu_instalado, 0)
    const { percentual, status } = calcularStatusDimensionamento(btuInstaladoTotal, sala.btu_necessario)

    const gastoMensal = ares.reduce((sum, ac) => {
      return sum + calcularConsumoEnergia(ac.potencia_w, ac.horas_dia, ac.dias_mes, config.tarifa_kwh).custoMes
    }, 0)

    const litrosDia = ares.reduce((sum, ac) => {
      return sum + calcularAguaCondensada(ac.btu_instalado, config.umidade_relativa, ac.horas_dia, ac.dias_mes).litrosDia
    }, 0)

    return {
      ...sala,
      ares,
      btuInstaladoTotal,
      percentualDimensionamento: percentual,
      status,
      gastoMensal,
      litrosDia
    }
  })
}

export function getDashboardSummary(): DashboardSummary {
  const salas = getSalasComDimensionamento()
  // salas sem nenhum AC ainda não são "subdimensionadas" — só ainda não têm aparelho
  const salasComAr = salas.filter((s) => s.ares.length > 0)

  const sugestoesTroca = sugerirTrocas(
    salasComAr.map((s) => ({ id: s.id, nome: s.nome, btuInstaladoTotal: s.btuInstaladoTotal, btuNecessario: s.btu_necessario }))
  )

  return {
    numSalas: salas.length,
    numAres: salas.reduce((sum, s) => sum + s.ares.length, 0),
    gastoMensalTotal: salas.reduce((sum, s) => sum + s.gastoMensal, 0),
    litrosDiaTotal: salas.reduce((sum, s) => sum + s.litrosDia, 0),
    subdimensionadas: salasComAr.filter((s) => s.status === 'subdimensionado').length,
    adequadas: salasComAr.filter((s) => s.status === 'adequado').length,
    superdimensionadas: salasComAr.filter((s) => s.status === 'superdimensionado').length,
    sugestoesTroca
  }
}
