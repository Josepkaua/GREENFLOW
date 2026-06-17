import { getDb } from '../index'
import type { ArCondicionado, ArCondicionadoInput } from '@shared/types'

export function listArCondicionados(): ArCondicionado[] {
  return getDb().prepare<[], ArCondicionado>('SELECT * FROM arcondicionados ORDER BY id').all()
}

export function listArCondicionadosBySala(salaId: number): ArCondicionado[] {
  return getDb()
    .prepare<[number], ArCondicionado>('SELECT * FROM arcondicionados WHERE sala_id = ? ORDER BY id')
    .all(salaId)
}

export function getArCondicionado(id: number): ArCondicionado | undefined {
  return getDb().prepare<[number], ArCondicionado>('SELECT * FROM arcondicionados WHERE id = ?').get(id)
}

export function createArCondicionado(input: ArCondicionadoInput): ArCondicionado {
  const result = getDb()
    .prepare(
      `INSERT INTO arcondicionados (sala_id, marca, modelo, btu_instalado, potencia_w, horas_dia, dias_mes)
       VALUES (@sala_id, @marca, @modelo, @btu_instalado, @potencia_w, @horas_dia, @dias_mes)`
    )
    .run(input)

  return getArCondicionado(Number(result.lastInsertRowid))!
}

export function updateArCondicionado(id: number, input: ArCondicionadoInput): ArCondicionado {
  getDb()
    .prepare(
      `UPDATE arcondicionados SET
        sala_id = @sala_id, marca = @marca, modelo = @modelo, btu_instalado = @btu_instalado,
        potencia_w = @potencia_w, horas_dia = @horas_dia, dias_mes = @dias_mes,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = @id`
    )
    .run({ ...input, id })

  return getArCondicionado(id)!
}

export function deleteArCondicionado(id: number): void {
  getDb().prepare('DELETE FROM arcondicionados WHERE id = ?').run(id)
}
