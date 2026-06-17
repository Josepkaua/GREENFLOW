import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { calcularConsumoEnergia } from '@shared/calculations';
import { formatCurrency, formatNumber } from '../../lib/format';
export default function Gastos() {
    const [salas, setSalas] = useState([]);
    const { config } = useConfig();
    useEffect(() => {
        window.api.salas.listComDimensionamento().then(setSalas);
    }, []);
    const linhas = salas.flatMap((sala) => sala.ares.map((ac) => ({
        sala,
        ac,
        ...calcularConsumoEnergia(ac.potencia_w, ac.horas_dia, ac.dias_mes, config.tarifa_kwh)
    })));
    const totalMes = linhas.reduce((sum, l) => sum + l.custoMes, 0);
    const totalAno = linhas.reduce((sum, l) => sum + l.custoAno, 0);
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["Tarifa configurada: ", formatCurrency(config.tarifa_kwh), "/kWh \u2014 ajuste em Configura\u00E7\u00F5es."] }), _jsx("div", { className: "overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3", children: "Sala" }), _jsx("th", { className: "px-4 py-3", children: "Aparelho" }), _jsx("th", { className: "px-4 py-3", children: "kWh/m\u00EAs" }), _jsx("th", { className: "px-4 py-3", children: "Custo/m\u00EAs" }), _jsx("th", { className: "px-4 py-3", children: "Custo/ano" })] }) }), _jsxs("tbody", { className: "divide-y divide-gray-100 dark:divide-gray-800", children: [linhas.map(({ sala, ac, kWhMes, custoMes, custoAno }) => (_jsxs("tr", { className: "bg-white dark:bg-gray-900", children: [_jsx("td", { className: "px-4 py-3 font-medium", children: sala.nome }), _jsxs("td", { className: "px-4 py-3", children: [ac.marca, " ", ac.modelo] }), _jsxs("td", { className: "px-4 py-3", children: [formatNumber(kWhMes), " kWh"] }), _jsx("td", { className: "px-4 py-3", children: formatCurrency(custoMes) }), _jsx("td", { className: "px-4 py-3", children: formatCurrency(custoAno) })] }, ac.id))), linhas.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-4 py-8 text-center text-gray-400", children: "Nenhum ar-condicionado cadastrado ainda." }) }))] }), linhas.length > 0 && (_jsx("tfoot", { className: "bg-gray-50 font-medium dark:bg-gray-800", children: _jsxs("tr", { children: [_jsx("td", { className: "px-4 py-3", colSpan: 3, children: "Total" }), _jsx("td", { className: "px-4 py-3", children: formatCurrency(totalMes) }), _jsx("td", { className: "px-4 py-3", children: formatCurrency(totalAno) })] }) }))] }) })] }));
}
