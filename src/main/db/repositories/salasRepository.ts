import { getDb } from '../index'
import { calcularBtuNecessario } from '@shared/calculations'
import type { Sala, SalaInput } from '@shared/types'

interface SalaRow {
  id: number
  nome: string
  comprimento: number
  largura: number
  altura: number
  num_pessoas: number
  num_eletronicos: number
  sol_direto: number
  tipo_ambiente: 'padrao' | 'cozinha'
  observacoes: string | null
  btu_necessario: number
  created_at: string
  updated_at: string
}

function rowToSala(row: SalaRow): Sala {
  return { ...row, sol_direto: Boolean(row.sol_direto) }
}

export function listSalas(): Sala[] {
  const rows = getDb().prepare<[], SalaRow>('SELECT * FROM salas ORDER BY nome').all()
  return rows.map(rowToSala)
}

export function getSala(id: number): Sala | undefined {
  const row = getDb().prepare<[number], SalaRow>('SELECT * FROM salas WHERE id = ?').get(id)
  return row ? rowToSala(row) : undefined
}

export function createSala(input: SalaInput): Sala {
  const btuNecessario = calcularBtuNecessario(input)
  const result = getDb()
    .prepare(
      `INSERT INTO salas (nome, comprimento, largura, altura, num_pessoas, num_eletronicos, sol_direto, tipo_ambiente, observacoes, btu_necessario)
       VALUES (@nome, @comprimento, @largura, @altura, @num_pessoas, @num_eletronicos, @sol_direto, @tipo_ambiente, @observacoes, @btu_necessario)`
    )
    .run({
      ...input,
      sol_direto: input.sol_direto ? 1 : 0,
      observacoes: input.observacoes ?? null,
      btu_necessario: btuNecessario
    })

  return getSala(Number(result.lastInsertRowid))!
}

export function updateSala(id: number, input: SalaInput): Sala {
  const btuNecessario = calcularBtuNecessario(input)
  getDb()
    .prepare(
      `UPDATE salas SET
        nome = @nome, comprimento = @comprimento, largura = @largura, altura = @altura,
        num_pessoas = @num_pessoas, num_eletronicos = @num_eletronicos, sol_direto = @sol_direto,
        tipo_ambiente = @tipo_ambiente, observacoes = @observacoes, btu_necessario = @btu_necessario,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = @id`
    )
    .run({
      ...input,
      id,
      sol_direto: input.sol_direto ? 1 : 0,
      observacoes: input.observacoes ?? null,
      btu_necessario: btuNecessario
    })

  return getSala(id)!
}

export function deleteSala(id: number): void {
  getDb().prepare('DELETE FROM salas WHERE id = ?').run(id)
}
