import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { ArCondicionadoFormModal } from './ArCondicionadoFormModal';
import { calcularStatusDimensionamento } from '@shared/calculations';
export default function ArCondicionados() {
    const [salas, setSalas] = useState([]);
    const [modal, setModal] = useState(null);
    async function carregar() {
        setSalas(await window.api.salas.listComDimensionamento());
    }
    useEffect(() => {
        carregar();
    }, []);
    async function excluir(id) {
        if (!confirm('Excluir este ar-condicionado?'))
            return;
        await window.api.ac.remove(id);
        carregar();
    }
    const linhas = salas.flatMap((sala) => sala.ares.map((ac) => ({ ac, sala })));
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: () => setModal('create'), disabled: salas.length === 0, className: "rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50", title: salas.length === 0 ? 'Cadastre uma sala primeiro' : '', children: "+ Novo ar-condicionado" }) }), _jsx("div", { className: "overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3", children: "Sala" }), _jsx("th", { className: "px-4 py-3", children: "Marca / Modelo" }), _jsx("th", { className: "px-4 py-3", children: "BTU instalado" }), _jsx("th", { className: "px-4 py-3", children: "Uso" }), _jsx("th", { className: "px-4 py-3", children: "Status da sala" }), _jsx("th", { className: "px-4 py-3" })] }) }), _jsxs("tbody", { className: "divide-y divide-gray-100 dark:divide-gray-800", children: [linhas.map(({ ac, sala }) => {
                                    const { status } = calcularStatusDimensionamento(sala.btuInstaladoTotal, sala.btu_necessario);
                                    return (_jsxs("tr", { className: "bg-white dark:bg-gray-900", children: [_jsx("td", { className: "px-4 py-3 font-medium", children: sala.nome }), _jsxs("td", { className: "px-4 py-3", children: [ac.marca, " ", ac.modelo] }), _jsxs("td", { className: "px-4 py-3", children: [ac.btu_instalado.toLocaleString('pt-BR'), " BTU"] }), _jsxs("td", { className: "px-4 py-3 text-gray-500 dark:text-gray-400", children: [ac.horas_dia, "h/dia \u00B7 ", ac.dias_mes, "d/m\u00EAs"] }), _jsx("td", { className: "px-4 py-3", children: _jsx(StatusBadge, { status: status }) }), _jsxs("td", { className: "px-4 py-3 text-right", children: [_jsx("button", { onClick: () => setModal(ac), className: "mr-3 text-brand-600 hover:underline", children: "Editar" }), _jsx("button", { onClick: () => excluir(ac.id), className: "text-red-500 hover:underline", children: "Excluir" })] })] }, ac.id));
                                }), linhas.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-4 py-8 text-center text-gray-400", children: "Nenhum ar-condicionado cadastrado ainda." }) }))] })] }) }), modal && (_jsx(ArCondicionadoFormModal, { ac: modal === 'create' ? null : modal, salas: salas, onClose: () => setModal(null), onSaved: carregar }))] }));
}
