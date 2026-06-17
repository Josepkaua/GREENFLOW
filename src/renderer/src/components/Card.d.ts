import type { ReactNode } from 'react';
interface CardProps {
    title: string;
    value: ReactNode;
    subtitle?: string;
    icon?: string;
}
export declare function Card({ title, value, subtitle, icon }: CardProps): JSX.Element;
export {};
