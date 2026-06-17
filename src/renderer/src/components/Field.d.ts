import type { ReactNode } from 'react';
export declare const inputClass = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800";
export declare function Field({ label, children }: {
    label: string;
    children: ReactNode;
}): JSX.Element;
