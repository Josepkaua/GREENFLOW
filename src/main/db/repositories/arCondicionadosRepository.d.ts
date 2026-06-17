import type { ArCondicionado, ArCondicionadoInput } from '@shared/types';
export declare function listArCondicionados(): ArCondicionado[];
export declare function listArCondicionadosBySala(salaId: number): ArCondicionado[];
export declare function getArCondicionado(id: number): ArCondicionado | undefined;
export declare function createArCondicionado(input: ArCondicionadoInput): ArCondicionado;
export declare function updateArCondicionado(id: number, input: ArCondicionadoInput): ArCondicionado;
export declare function deleteArCondicionado(id: number): void;
