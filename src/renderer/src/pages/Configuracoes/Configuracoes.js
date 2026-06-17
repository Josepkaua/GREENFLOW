import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { Field, inputClass } from '../../components/Field';
export default function Configuracoes() {
    const { config, updateConfig } = useConfig();
    const [tarifa, setTarifa] = useState(config.tarifa_kwh);
    const [umidade, setUmidade] = useState(config.umidade_relativa);
    const [salvo, setSalvo] = useState(false);
    async function salvar(e) {
        e.preventDefault();
        await updateConfig({ tarifa_kwh: tarifa, umidade_relativa: umidade, tema: config.tema });
        setSalvo(true);
        setTimeout(() => setSalvo(false), 2000);
    }
    async function trocarTema(tema) {
        await updateConfig({ tarifa_kwh: tarifa, umidade_relativa: umidade, tema });
    }
    return (_jsxs("div", { className: "max-w-lg space-y-6", children: [_jsxs("form", { onSubmit: salvar, className: "space-y-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900", children: [_jsx("h2", { className: "text-base font-semibold", children: "Par\u00E2metros globais" }), _jsx(Field, { label: "Tarifa de energia (R$/kWh)", children: _jsx("input", { type: "number", step: "0.01", min: "0", className: inputClass, value: tarifa, onChange: (e) => setTarifa(Number(e.target.value)) }) }), _jsx(Field, { label: "Umidade relativa do ar local (%)", children: _jsx("input", { type: "number", step: "1", min: "0", max: "100", className: inputClass, value: umidade, onChange: (e) => setUmidade(Number(e.target.value)) }) }), _jsx("button", { type: "submit", className: "rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700", children: "Salvar" }), salvo && _jsx("span", { className: "ml-3 text-sm text-green-600", children: "Salvo!" })] }), _jsxs("div", { className: "space-y-3 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900", children: [_jsx("h2", { className: "text-base font-semibold", children: "Tema" }), _jsx("div", { className: "flex gap-2", children: ([
                            { tema: 'light', label: 'Claro', icone: '☀️' },
                            { tema: 'dark', label: 'Escuro', icone: '🌙' },
                            { tema: 'system', label: 'Sistema', icone: '🖥️' }
                        ]).map((opcao) => (_jsxs("button", { onClick: () => trocarTema(opcao.tema), className: `flex-1 rounded-lg border px-3 py-2 text-sm ${config.tema === opcao.tema
                                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'}`, children: [opcao.icone, " ", opcao.label] }, opcao.tema))) })] })] }));
}
