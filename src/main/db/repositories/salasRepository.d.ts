import type { Sala, SalaInput } from '@shared/types';
export declare function listSalas(): Sala[];
export declare function getSala(id: number): Sala | undefined;
export declare function createSala(input: SalaInput): Sala;
export declare function updateSala(id: number, input: SalaInput): Sala;
export declare function deleteSala(id: number): void;
