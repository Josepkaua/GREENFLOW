import type { StatusDimensionamento, SugestaoTroca } from './types';
export declare const MODELOS_COMERCIAIS_BTU: readonly [7000, 9000, 12000, 18000, 24000, 30000, 36000, 48000, 60000];
export interface FatoresBtu {
    comprimento: number;
    largura: number;
    altura: number;
    num_pessoas: number;
    num_eletronicos: number;
    sol_direto: boolean;
    tipo_ambiente: 'padrao' | 'cozinha';
}
export interface DetalhamentoBtu {
    volume: number;
    btuBase: number;
    percentualPeDireito: number;
    percentualSolDireto: number;
    percentualCozinha: number;
    btuFixoPessoas: number;
    btuFixoEletronicos: number;
    btuNecessarioBruto: number;
    btuNecessarioComercial: number;
    excedeMaiorModelo: boolean;
}
/** Regra de bolso (cursodearcondicionado.com.br / WebArCondicionado / ABNT): 200 BTU/m³ de volume. */
export declare function calcularDetalhamentoBtu(f: FatoresBtu): DetalhamentoBtu;
export declare function calcularBtuNecessario(f: FatoresBtu): number;
export declare function calcularConsumoEnergia(potenciaW: number, horasDia: number, diasMes: number, tarifaKwh: number): {
    kWhMes: number;
    custoMes: number;
    custoAno: number;
};
/**
 * Marinho et al. (2021), Research, Society and Development v.10 n.13 — DOI 10.33448/rsd-v10i13.21100.
 * Q (L/h) = P·1,130e-4 + H·2,275e-2 − 1,944, P = potência em BTU/h, H = umidade relativa (%).
 */
export declare function calcularAguaCondensada(btuInstalado: number, umidadeRelativa: number, horasDia: number, diasMes: number): {
    litrosHora: number;
    litrosDia: number;
    litrosMes: number;
};
export declare function calcularStatusDimensionamento(btuInstaladoTotal: number, btuNecessario: number): {
    percentual: number;
    status: StatusDimensionamento;
};
interface SalaParaTroca {
    id: number;
    nome: string;
    btuInstaladoTotal: number;
    btuNecessario: number;
}
/** Verifica, par a par, se trocar o total de BTU instalado entre uma sala superdimensionada e uma subdimensionada resolveria ambas. */
export declare function sugerirTrocas(salas: SalaParaTroca[]): SugestaoTroca[];
export {};
