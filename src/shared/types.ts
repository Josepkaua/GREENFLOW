export type TipoAmbiente = 'padrao' | 'cozinha'
export type Tema = 'light' | 'dark' | 'system'
export type StatusDimensionamento = 'subdimensionado' | 'adequado' | 'superdimensionado'

export interface Sala {
  id: number
  nome: string
  comprimento: number
  largura: number
  altura: number
  num_pessoas: number
  num_eletronicos: number
  sol_direto: boolean
  tipo_ambiente: TipoAmbiente
  observacoes: string | null
  btu_necessario: number
  created_at: string
  updated_at: string
}

export type SalaInput = Omit<Sala, 'id' | 'btu_necessario' | 'created_at' | 'updated_at'>

export interface ArCondicionado {
  id: number
  sala_id: number
  marca: string
  modelo: string
  btu_instalado: number
  potencia_w: number
  horas_dia: number
  dias_mes: number
  created_at: string
  updated_at: string
}

export type ArCondicionadoInput = Omit<ArCondicionado, 'id' | 'created_at' | 'updated_at'>

export interface Configuracao {
  id: 1
  tarifa_kwh: number
  umidade_relativa: number
  tema: Tema
}

export type ConfiguracaoInput = Omit<Configuracao, 'id'>

export interface SalaComDimensionamento extends Sala {
  ares: ArCondicionado[]
  btuInstaladoTotal: number
  percentualDimensionamento: number
  status: StatusDimensionamento
  gastoMensal: number
  litrosDia: number
}

export interface SugestaoTroca {
  salaSuperId: number
  salaSuperNome: string
  salaSubId: number
  salaSubNome: string
}

export interface DashboardSummary {
  numSalas: number
  numAres: number
  gastoMensalTotal: number
  litrosDiaTotal: number
  subdimensionadas: number
  adequadas: number
  superdimensionadas: number
  sugestoesTroca: SugestaoTroca[]
}
