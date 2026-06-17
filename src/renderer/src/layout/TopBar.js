import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
const TITLES = {
    '/': 'Dashboard',
    '/salas': 'Salas',
    '/ares-condicionados': 'Ares-Condicionados',
    '/calculadora': 'Calculadora BTU',
    '/gastos': 'Gastos',
    '/agua': 'Água / Drenos',
    '/graficos': 'Gráficos',
    '/relatorio': 'Relatório PDF',
    '/configuracoes': 'Configurações'
};
const TEMA_CICLO = {
    light: { proximo: 'dark', icone: '☀️', label: 'Claro' },
    dark: { proximo: 'system', icone: '🌙', label: 'Escuro' },
    system: { proximo: 'light', icone: '🖥️', label: 'Sistema' }
};
export function TopBar() {
    const location = useLocation();
    const { config, updateConfig } = useConfig();
    const tema = TEMA_CICLO[config.tema];
    return (_jsxs("header", { className: "flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-950", children: [_jsx("h1", { className: "text-lg font-semibold", children: TITLES[location.pathname] ?? 'Green Flow' }), _jsxs("button", { type: "button", onClick: () => updateConfig({ ...config, tema: tema.proximo }), className: "flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800", title: "Alternar tema", children: [_jsx("span", { children: tema.icone }), tema.label] })] }));
}
