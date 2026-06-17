import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
const NAV_ITEMS = [
    { to: '/', label: 'Dashboard', icon: '🏠' },
    { to: '/salas', label: 'Salas', icon: '🏫' },
    { to: '/ares-condicionados', label: 'Ares-Condicionados', icon: '❄️' },
    { to: '/calculadora', label: 'Calculadora BTU', icon: '🧮' },
    { to: '/gastos', label: 'Gastos', icon: '💰' },
    { to: '/agua', label: 'Água / Drenos', icon: '💧' },
    { to: '/graficos', label: 'Gráficos', icon: '📊' },
    { to: '/relatorio', label: 'Relatório PDF', icon: '📄' },
    { to: '/configuracoes', label: 'Configurações', icon: '⚙️' }
];
export function Sidebar() {
    return (_jsxs("aside", { className: "flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950", children: [_jsxs("div", { className: "flex items-center gap-2 px-5 py-5", children: [_jsx("span", { className: "text-2xl", children: "\uD83C\uDF31" }), _jsx("span", { className: "text-lg font-semibold text-brand-700 dark:text-brand-400", children: "Green Flow" })] }), _jsx("nav", { className: "flex-1 space-y-1 px-3", children: NAV_ITEMS.map((item) => (_jsxs(NavLink, { to: item.to, end: item.to === '/', className: ({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                        ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`, children: [_jsx("span", { className: "text-base", children: item.icon }), item.label] }, item.to))) }), _jsx("div", { className: "px-5 py-4 text-xs text-gray-400 dark:text-gray-500", children: "Gest\u00E3o inteligente de A/C" })] }));
}
