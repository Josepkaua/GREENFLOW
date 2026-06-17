import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { formatCurrency, formatNumber } from '../../lib/format';
export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    useEffect(() => {
        window.api.dashboard.summary().then(setSummary);
    }, []);
    if (!summary)
        return _jsx("p", { className: "text-sm text-gray-500", children: "Carregando..." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5", children: [_jsx(Card, { title: "Salas cadastradas", value: summary.numSalas, icon: "\uD83C\uDFEB" }), _jsx(Card, { title: "Ares-condicionados", value: summary.numAres, icon: "\u2744\uFE0F" }), _jsx(Card, { title: "Gasto mensal total", value: formatCurrency(summary.gastoMensalTotal), icon: "\uD83D\uDCB0" }), _jsx(Card, { title: "\u00C1gua condensada/dia", value: `${formatNumber(summary.litrosDiaTotal)} L`, icon: "\uD83D\uDCA7" }), _jsx(Card, { title: "Status geral", icon: "\uD83D\uDCD0", value: `${summary.adequadas}/${summary.numSalas}`, subtitle: `${summary.subdimensionadas} sub · ${summary.superdimensionadas} super` })] }), _jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900", children: [_jsx("h2", { className: "mb-3 text-base font-semibold", children: "Sugest\u00F5es de troca entre salas" }), summary.sugestoesTroca.length === 0 ? (_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Nenhuma sugest\u00E3o no momento \u2014 n\u00E3o h\u00E1 pares de salas super/subdimensionadas que se resolveriam com uma troca." })) : (_jsx("ul", { className: "space-y-2", children: summary.sugestoesTroca.map((s, idx) => (_jsxs("li", { className: "flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300", children: [_jsx("span", { children: "\uD83D\uDD04" }), "Trocar o(s) aparelho(s) de ", _jsx("strong", { children: s.salaSuperNome }), " (superdimensionada) com", ' ', _jsx("strong", { children: s.salaSubNome }), " (subdimensionada) deixaria ambas adequadas."] }, idx))) }))] })] }));
}
