import type { ReactNode } from 'react';
interface ModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
}
export declare function Modal({ title, onClose, children }: ModalProps): JSX.Element;
export {};
