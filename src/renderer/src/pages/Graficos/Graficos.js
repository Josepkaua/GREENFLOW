import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useConfig } from '../../context/ConfigContext';
import { calcularAguaCondensada } from '@shared/calculations';
const CORES_STATUS = {
    subdimensionado: '#ef4444',
    adequado: '#22c55e',
    superdimensionado: '#f97316'
};
export default function Graficos() {
    const [salas, setSalas] = useState([]);
    const { config } = useConfig();
    useEffect(() => {
        window.api.salas.listComDimensionamento().then(setSalas);
    }, []);
    const dadosBtu = salas.map((s) => ({
        nome: s.nome,
        necessario: s.btu_necessario,
        instalado: s.btuInstaladoTotal
    }));
    const dadosCusto = salas.map((s) => ({ nome: s.nome, custo: Number(s.gastoMensal.toFixed(2)) }));
    const dadosStatus = ['subdimensionado', 'adequado', 'superdimensionado'].map((status) => ({
        status,
        quantidade: salas.filter((s) => s.status === status && s.ares.length > 0).length
    }));
    const dadosAgua = salas.map((s) => ({
        nome: s.nome,
        litrosMes: s.ares.reduce((sum, ac) => sum + calcularAguaCondensada(ac.btu_instalado, config.umidade_relativa, ac.horas_dia, ac.dias_mes).litrosMes, 0)
    }));
    if (salas.length === 0) {
        return _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Cadastre salas e ares-condicionados para ver os gr\u00E1ficos." });
    }
    return (_jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [_jsx(GraficoCard, { titulo: "BTU necess\u00E1rio \u00D7 instalado por sala", children: _jsxs(BarChart, { data: dadosBtu, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "nome", tick: { fontSize: 12 } }), _jsx(YAxis, { tick: { fontSize: 12 } }), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "necessario", name: "Necess\u00E1rio", fill: "#16a34a" }), _jsx(Bar, { dataKey: "instalado", name: "Instalado", fill: "#86efac" })] }) }), _jsx(GraficoCard, { titulo: "Custo mensal por sala (R$)", children: _jsxs(BarChart, { data: dadosCusto, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "nome", tick: { fontSize: 12 } }), _jsx(YAxis, { tick: { fontSize: 12 } }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "custo", name: "Custo (R$)", fill: "#15803d" })] }) }), _jsx(GraficoCard, { titulo: "Distribui\u00E7\u00E3o de status de dimensionamento", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: dadosStatus, dataKey: "quantidade", nameKey: "status", outerRadius: 100, label: true, children: dadosStatus.map((d) => (_jsx(Cell, { fill: CORES_STATUS[d.status] }, d.status))) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) }), _jsx(GraficoCard, { titulo: "\u00C1gua condensada estimada por sala (L/m\u00EAs)", children: _jsxs(LineChart, { data: dadosAgua, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "nome", tick: { fontSize: 12 } }), _jsx(YAxis, { tick: { fontSize: 12 } }), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "litrosMes", name: "Litros/m\u00EAs", stroke: "#0ea5e9", strokeWidth: 2 })] }) })] }));
}
function GraficoCard({ titulo, children }) {
    return (_jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900", children: [_jsx("h2", { className: "mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300", children: titulo }), _jsx(ResponsiveContainer, { width: "100%", height: 260, children: children })] }));
}
