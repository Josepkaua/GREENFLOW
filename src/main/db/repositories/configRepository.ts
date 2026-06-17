import { getDb } from '../index'
import type { Configuracao, ConfiguracaoInput } from '@shared/types'

export function getConfig(): Configuracao {
  return getDb().prepare<[], Configuracao>('SELECT * FROM configuracoes WHERE id = 1').get()!
}

export function updateConfig(input: ConfiguracaoInput): Configuracao {
  getDb()
    .prepare('UPDATE configuracoes SET tarifa_kwh = @tarifa_kwh, umidade_relativa = @umidade_relativa, tema = @tema WHERE id = 1')
    .run(input)

  return getConfig()
}
