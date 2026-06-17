import type { Sala } from '@shared/types';
interface SalaFormModalProps {
    sala: Sala | null;
    onClose: () => void;
    onSaved: () => void;
}
export declare function SalaFormModal({ sala, onClose, onSaved }: SalaFormModalProps): JSX.Element;
export {};
