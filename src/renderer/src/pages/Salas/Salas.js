import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { SalaFormModal } from './SalaFormModal';
export default function Salas() {
    const [salas, setSalas] = useState([]);
    const [modal, setModal] = useState(null);
    async function carregar() {
        setSalas(await window.api.salas.listComDimensionamento());
    }
    useEffect(() => {
        carregar();
    }, []);
    async function excluir(id) {
        if (!confirm('Excluir esta sala e os ares-condicionados vinculados a ela?'))
            return;
        await window.api.salas.remove(id);
        carregar();
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: () => setModal('create'), className: "rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700", children: "+ Nova sala" }) }), _jsx("div", { className: "overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3", children: "Nome" }), _jsx("th", { className: "px-4 py-3", children: "Dimens\u00F5es" }), _jsx("th", { className: "px-4 py-3", children: "BTU necess\u00E1rio" }), _jsx("th", { className: "px-4 py-3", children: "ACs" }), _jsx("th", { className: "px-4 py-3", children: "Status" }), _jsx("th", { className: "px-4 py-3" })] }) }), _jsxs("tbody", { className: "divide-y divide-gray-100 dark:divide-gray-800", children: [salas.map((sala) => (_jsxs("tr", { className: "bg-white dark:bg-gray-900", children: [_jsx("td", { className: "px-4 py-3 font-medium", children: sala.nome }), _jsxs("td", { className: "px-4 py-3 text-gray-500 dark:text-gray-400", children: [sala.comprimento, "\u00D7", sala.largura, "\u00D7", sala.altura, " m"] }), _jsxs("td", { className: "px-4 py-3", children: [sala.btu_necessario.toLocaleString('pt-BR'), " BTU"] }), _jsx("td", { className: "px-4 py-3", children: sala.ares.length }), _jsx("td", { className: "px-4 py-3", children: sala.ares.length > 0 ? _jsx(StatusBadge, { status: sala.status }) : '—' }), _jsxs("td", { className: "px-4 py-3 text-right", children: [_jsx("button", { onClick: () => setModal(sala), className: "mr-3 text-brand-600 hover:underline", children: "Editar" }), _jsx("button", { onClick: () => excluir(sala.id), className: "text-red-500 hover:underline", children: "Excluir" })] })] }, sala.id))), salas.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-4 py-8 text-center text-gray-400", children: "Nenhuma sala cadastrada ainda." }) }))] })] }) }), modal && (_jsx(SalaFormModal, { sala: modal === 'create' ? null : modal, onClose: () => setModal(null), onSaved: carregar }))] }));
}
