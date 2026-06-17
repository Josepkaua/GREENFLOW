import { listSalas } from '../db/repositories/salasRepository';
import { listArCondicionados } from '../db/repositories/arCondicionadosRepository';
import { getConfig } from '../db/repositories/configRepository';
import { calcularConsumoEnergia, calcularAguaCondensada, calcularStatusDimensionamento, sugerirTrocas } from '@shared/calculations';
export function getSalasComDimensionamento() {
    const salas = listSalas();
    const todosAres = listArCondicionados();
    const config = getConfig();
    return salas.map((sala) => {
        const ares = todosAres.filter((ac) => ac.sala_id === sala.id);
        const btuInstaladoTotal = ares.reduce((sum, ac) => sum + ac.btu_instalado, 0);
        const { percentual, status } = calcularStatusDimensionamento(btuInstaladoTotal, sala.btu_necessario);
        const gastoMensal = ares.reduce((sum, ac) => {
            return sum + calcularConsumoEnergia(ac.potencia_w, ac.horas_dia, ac.dias_mes, config.tarifa_kwh).custoMes;
        }, 0);
        const litrosDia = ares.reduce((sum, ac) => {
            return sum + calcularAguaCondensada(ac.btu_instalado, config.umidade_relativa, ac.horas_dia, ac.dias_mes).litrosDia;
        }, 0);
        return {
            ...sala,
            ares,
            btuInstaladoTotal,
            percentualDimensionamento: percentual,
            status,
            gastoMensal,
            litrosDia
        };
    });
}
export function getDashboardSummary() {
    const salas = getSalasComDimensionamento();
    const sugestoesTroca = sugerirTrocas(salas.map((s) => ({ id: s.id, nome: s.nome, btuInstaladoTotal: s.btuInstaladoTotal, btuNecessario: s.btu_necessario })));
    return {
        numSalas: salas.length,
        numAres: salas.reduce((sum, s) => sum + s.ares.length, 0),
        gastoMensalTotal: salas.reduce((sum, s) => sum + s.gastoMensal, 0),
        litrosDiaTotal: salas.reduce((sum, s) => sum + s.litrosDia, 0),
        subdimensionadas: salas.filter((s) => s.status === 'subdimensionado').length,
        adequadas: salas.filter((s) => s.status === 'adequado').length,
        superdimensionadas: salas.filter((s) => s.status === 'superdimensionado').length,
        sugestoesTroca
    };
}
