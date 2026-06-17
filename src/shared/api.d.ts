import type { Sala, SalaInput, SalaComDimensionamento, ArCondicionado, ArCondicionadoInput, Configuracao, ConfiguracaoInput, DashboardSummary } from './types';
export interface ElectronApi {
    salas: {
        list(): Promise<Sala[]>;
        listComDimensionamento(): Promise<SalaComDimensionamento[]>;
        get(id: number): Promise<Sala | undefined>;
        create(input: SalaInput): Promise<Sala>;
        update(id: number, input: SalaInput): Promise<Sala>;
        remove(id: number): Promise<void>;
    };
    ac: {
        listAll(): Promise<ArCondicionado[]>;
        listBySala(salaId: number): Promise<ArCondicionado[]>;
        create(input: ArCondicionadoInput): Promise<ArCondicionado>;
        update(id: number, input: ArCondicionadoInput): Promise<ArCondicionado>;
        remove(id: number): Promise<void>;
    };
    config: {
        get(): Promise<Configuracao>;
        update(input: ConfiguracaoInput): Promise<Configuracao>;
        systemPrefersDark(): Promise<boolean>;
    };
    dashboard: {
        summary(): Promise<DashboardSummary>;
    };
    pdf: {
        save(data: ArrayBuffer): Promise<{
            saved: boolean;
            filePath?: string;
        }>;
    };
}
