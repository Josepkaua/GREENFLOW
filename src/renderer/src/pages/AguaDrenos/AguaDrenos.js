import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { calcularAguaCondensada } from '@shared/calculations';
import { formatNumber } from '../../lib/format';
export default function AguaDrenos() {
    const [salas, setSalas] = useState([]);
    const { config } = useConfig();
    useEffect(() => {
        window.api.salas.listComDimensionamento().then(setSalas);
    }, []);
    const linhas = salas.flatMap((sala) => sala.ares.map((ac) => ({
        sala,
        ac,
        ...calcularAguaCondensada(ac.btu_instalado, config.umidade_relativa, ac.horas_dia, ac.dias_mes)
    })));
    const totalDia = linhas.reduce((sum, l) => sum + l.litrosDia, 0);
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["Umidade relativa configurada: ", config.umidade_relativa, "% \u2014 ajuste em Configura\u00E7\u00F5es. F\u00F3rmula: Marinho et al. (2021), Research, Society and Development v.10 n.13 \u2014 Q(L/h) = P\u00B71,130\u00D710\u207B\u2074 + H\u00B72,275\u00D710\u207B\u00B2 \u2212 1,944."] }), _jsx("div", { className: "overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3", children: "Sala" }), _jsx("th", { className: "px-4 py-3", children: "Aparelho" }), _jsx("th", { className: "px-4 py-3", children: "L/h" }), _jsx("th", { className: "px-4 py-3", children: "L/dia" }), _jsx("th", { className: "px-4 py-3", children: "L/m\u00EAs" })] }) }), _jsxs("tbody", { className: "divide-y divide-gray-100 dark:divide-gray-800", children: [linhas.map(({ sala, ac, litrosHora, litrosDia, litrosMes }) => (_jsxs("tr", { className: "bg-white dark:bg-gray-900", children: [_jsx("td", { className: "px-4 py-3 font-medium", children: sala.nome }), _jsxs("td", { className: "px-4 py-3", children: [ac.marca, " ", ac.modelo] }), _jsxs("td", { className: "px-4 py-3", children: [formatNumber(litrosHora, 2), " L"] }), _jsxs("td", { className: "px-4 py-3", children: [formatNumber(litrosDia), " L"] }), _jsxs("td", { className: "px-4 py-3", children: [formatNumber(litrosMes), " L"] })] }, ac.id))), linhas.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-4 py-8 text-center text-gray-400", children: "Nenhum ar-condicionado cadastrado ainda." }) }))] }), linhas.length > 0 && (_jsx("tfoot", { className: "bg-gray-50 font-medium dark:bg-gray-800", children: _jsxs("tr", { children: [_jsx("td", { className: "px-4 py-3", colSpan: 4, children: "Total estimado por dia" }), _jsxs("td", { className: "px-4 py-3", children: [formatNumber(totalDia), " L/dia"] })] }) }))] }) })] }));
}
