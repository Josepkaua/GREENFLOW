import type { ArCondicionado, Sala } from '@shared/types';
interface ArCondicionadoFormModalProps {
    ac: ArCondicionado | null;
    salas: Sala[];
    salaIdPadrao?: number;
    onClose: () => void;
    onSaved: () => void;
}
export declare function ArCondicionadoFormModal({ ac, salas, salaIdPadrao, onClose, onSaved }: ArCondicionadoFormModalProps): JSX.Element;
export {};
