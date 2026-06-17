import { jsx as _jsx } from "react/jsx-runtime";
const ESTILOS = {
    subdimensionado: {
        label: 'Subdimensionado',
        classes: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    },
    adequado: {
        label: 'Adequado',
        classes: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
    },
    superdimensionado: {
        label: 'Superdimensionado',
        classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
    }
};
export function StatusBadge({ status }) {
    const estilo = ESTILOS[status];
    return _jsx("span", { className: `rounded-full px-2.5 py-1 text-xs font-medium ${estilo.classes}`, children: estilo.label });
}
