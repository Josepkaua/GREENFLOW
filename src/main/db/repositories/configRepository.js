import { getDb } from '../index';
export function getConfig() {
    return getDb().prepare('SELECT * FROM configuracoes WHERE id = 1').get();
}
export function updateConfig(input) {
    getDb()
        .prepare('UPDATE configuracoes SET tarifa_kwh = @tarifa_kwh, umidade_relativa = @umidade_relativa, tema = @tema WHERE id = 1')
        .run(input);
    return getConfig();
}
