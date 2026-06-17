import { getDb } from '../index';
import { calcularBtuNecessario } from '@shared/calculations';
function rowToSala(row) {
    return { ...row, sol_direto: Boolean(row.sol_direto) };
}
export function listSalas() {
    const rows = getDb().prepare('SELECT * FROM salas ORDER BY nome').all();
    return rows.map(rowToSala);
}
export function getSala(id) {
    const row = getDb().prepare('SELECT * FROM salas WHERE id = ?').get(id);
    return row ? rowToSala(row) : undefined;
}
export function createSala(input) {
    const btuNecessario = calcularBtuNecessario(input);
    const result = getDb()
        .prepare(`INSERT INTO salas (nome, comprimento, largura, altura, num_pessoas, num_eletronicos, sol_direto, tipo_ambiente, observacoes, btu_necessario)
       VALUES (@nome, @comprimento, @largura, @altura, @num_pessoas, @num_eletronicos, @sol_direto, @tipo_ambiente, @observacoes, @btu_necessario)`)
        .run({
        ...input,
        sol_direto: input.sol_direto ? 1 : 0,
        observacoes: input.observacoes ?? null,
        btu_necessario: btuNecessario
    });
    return getSala(Number(result.lastInsertRowid));
}
export function updateSala(id, input) {
    const btuNecessario = calcularBtuNecessario(input);
    getDb()
        .prepare(`UPDATE salas SET
        nome = @nome, comprimento = @comprimento, largura = @largura, altura = @altura,
        num_pessoas = @num_pessoas, num_eletronicos = @num_eletronicos, sol_direto = @sol_direto,
        tipo_ambiente = @tipo_ambiente, observacoes = @observacoes, btu_necessario = @btu_necessario,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = @id`)
        .run({
        ...input,
        id,
        sol_direto: input.sol_direto ? 1 : 0,
        observacoes: input.observacoes ?? null,
        btu_necessario: btuNecessario
    });
    return getSala(id);
}
export function deleteSala(id) {
    getDb().prepare('DELETE FROM salas WHERE id = ?').run(id);
}
