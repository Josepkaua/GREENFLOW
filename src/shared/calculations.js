export const MODELOS_COMERCIAIS_BTU = [7000, 9000, 12000, 18000, 24000, 30000, 36000, 48000, 60000];
/** Regra de bolso (cursodearcondicionado.com.br / WebArCondicionado / ABNT): 200 BTU/m³ de volume. */
export function calcularDetalhamentoBtu(f) {
    const volume = f.comprimento * f.largura * f.altura;
    const btuBase = volume * 200;
    const percentualPeDireito = f.altura > 3.5 ? 0.2 : f.altura >= 2.7 ? 0.1 : 0;
    const percentualSolDireto = f.sol_direto ? 0.1 : 0;
    const percentualCozinha = f.tipo_ambiente === 'cozinha' ? 0.2 : 0;
    const percentualTotal = percentualPeDireito + percentualSolDireto + percentualCozinha;
    const btuFixoPessoas = Math.max(0, f.num_pessoas - 2) * 600;
    const btuFixoEletronicos = f.num_eletronicos * 600;
    const btuNecessarioBruto = btuBase * (1 + percentualTotal) + btuFixoPessoas + btuFixoEletronicos;
    const maiorModelo = MODELOS_COMERCIAIS_BTU[MODELOS_COMERCIAIS_BTU.length - 1];
    const modeloEncontrado = MODELOS_COMERCIAIS_BTU.find((m) => m >= btuNecessarioBruto);
    return {
        volume,
        btuBase,
        percentualPeDireito,
        percentualSolDireto,
        percentualCozinha,
        btuFixoPessoas,
        btuFixoEletronicos,
        btuNecessarioBruto,
        btuNecessarioComercial: modeloEncontrado ?? maiorModelo,
        excedeMaiorModelo: modeloEncontrado === undefined
    };
}
export function calcularBtuNecessario(f) {
    return calcularDetalhamentoBtu(f).btuNecessarioComercial;
}
export function calcularConsumoEnergia(potenciaW, horasDia, diasMes, tarifaKwh) {
    const kWhMes = (potenciaW / 1000) * horasDia * diasMes;
    const custoMes = kWhMes * tarifaKwh;
    return { kWhMes, custoMes, custoAno: custoMes * 12 };
}
/**
 * Marinho et al. (2021), Research, Society and Development v.10 n.13 — DOI 10.33448/rsd-v10i13.21100.
 * Q (L/h) = P·1,130e-4 + H·2,275e-2 − 1,944, P = potência em BTU/h, H = umidade relativa (%).
 */
export function calcularAguaCondensada(btuInstalado, umidadeRelativa, horasDia, diasMes) {
    const litrosHora = Math.max(0, btuInstalado * 1.13e-4 + umidadeRelativa * 2.275e-2 - 1.944);
    const litrosDia = litrosHora * horasDia;
    const litrosMes = litrosDia * diasMes;
    return { litrosHora, litrosDia, litrosMes };
}
export function calcularStatusDimensionamento(btuInstaladoTotal, btuNecessario) {
    if (btuNecessario <= 0)
        return { percentual: 0, status: 'subdimensionado' };
    const percentual = (btuInstaladoTotal / btuNecessario) * 100;
    const status = percentual < 85 ? 'subdimensionado' : percentual > 120 ? 'superdimensionado' : 'adequado';
    return { percentual, status };
}
/** Verifica, par a par, se trocar o total de BTU instalado entre uma sala superdimensionada e uma subdimensionada resolveria ambas. */
export function sugerirTrocas(salas) {
    const sugestoes = [];
    const classificadas = salas.map((s) => ({
        ...s,
        status: calcularStatusDimensionamento(s.btuInstaladoTotal, s.btuNecessario).status
    }));
    const superdimensionadas = classificadas.filter((s) => s.status === 'superdimensionado');
    const subdimensionadas = classificadas.filter((s) => s.status === 'subdimensionado');
    for (const salaSuper of superdimensionadas) {
        for (const salaSub of subdimensionadas) {
            const novoStatusSuper = calcularStatusDimensionamento(salaSub.btuInstaladoTotal, salaSuper.btuNecessario).status;
            const novoStatusSub = calcularStatusDimensionamento(salaSuper.btuInstaladoTotal, salaSub.btuNecessario).status;
            if (novoStatusSuper === 'adequado' && novoStatusSub === 'adequado') {
                sugestoes.push({
                    salaSuperId: salaSuper.id,
                    salaSuperNome: salaSuper.nome,
                    salaSubId: salaSub.id,
                    salaSubNome: salaSub.nome
                });
            }
        }
    }
    return sugestoes;
}
