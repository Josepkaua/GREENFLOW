import { type ReactNode } from 'react';
import type { Configuracao, ConfiguracaoInput } from '@shared/types';
interface ConfigContextValue {
    config: Configuracao;
    effectiveDark: boolean;
    updateConfig: (input: ConfiguracaoInput) => Promise<void>;
}
export declare function ConfigProvider({ children }: {
    children: ReactNode;
}): JSX.Element | null;
export declare function useConfig(): ConfigContextValue;
export {};
