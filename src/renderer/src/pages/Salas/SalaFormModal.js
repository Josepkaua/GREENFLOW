import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { Field, inputClass } from '../../components/Field';
import { calcularDetalhamentoBtu } from '@shared/calculations';
const VAZIO = {
    nome: '',
    comprimento: 5,
    largura: 4,
    altura: 2.8,
    num_pessoas: 2,
    num_eletronicos: 1,
    sol_direto: false,
    tipo_ambiente: 'padrao',
    observacoes: ''
};
export function SalaFormModal({ sala, onClose, onSaved }) {
    const [form, setForm] = useState(sala
        ? {
            nome: sala.nome,
            comprimento: sala.comprimento,
            largura: sala.largura,
            altura: sala.altura,
            num_pessoas: sala.num_pessoas,
            num_eletronicos: sala.num_eletronicos,
            sol_direto: sala.sol_direto,
            tipo_ambiente: sala.tipo_ambiente,
            observacoes: sala.observacoes ?? ''
        }
        : VAZIO);
    const [salvando, setSalvando] = useState(false);
    const detalhamento = calcularDetalhamentoBtu(form);
    function update(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setSalvando(true);
        try {
            if (sala)
                await window.api.salas.update(sala.id, form);
            else
                await window.api.salas.create(form);
            onSaved();
            onClose();
        }
        finally {
            setSalvando(false);
        }
    }
    return (_jsx(Modal, { title: sala ? 'Editar sala' : 'Nova sala', onClose: onClose, children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(Field, { label: "Nome da sala", children: _jsx("input", { required: true, className: inputClass, value: form.nome, onChange: (e) => update('nome', e.target.value) }) }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsx(Field, { label: "Comprimento (m)", children: _jsx("input", { required: true, type: "number", step: "0.1", min: "0", className: inputClass, value: form.comprimento, onChange: (e) => update('comprimento', Number(e.target.value)) }) }), _jsx(Field, { label: "Largura (m)", children: _jsx("input", { required: true, type: "number", step: "0.1", min: "0", className: inputClass, value: form.largura, onChange: (e) => update('largura', Number(e.target.value)) }) }), _jsx(Field, { label: "P\u00E9-direito (m)", children: _jsx("input", { required: true, type: "number", step: "0.1", min: "0", className: inputClass, value: form.altura, onChange: (e) => update('altura', Number(e.target.value)) }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Field, { label: "N\u00BA de pessoas", children: _jsx("input", { type: "number", min: "0", className: inputClass, value: form.num_pessoas, onChange: (e) => update('num_pessoas', Number(e.target.value)) }) }), _jsx(Field, { label: "N\u00BA de eletr\u00F4nicos", children: _jsx("input", { type: "number", min: "0", className: inputClass, value: form.num_eletronicos, onChange: (e) => update('num_eletronicos', Number(e.target.value)) }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Field, { label: "Tipo de ambiente", children: _jsxs("select", { className: inputClass, value: form.tipo_ambiente, onChange: (e) => update('tipo_ambiente', e.target.value), children: [_jsx("option", { value: "padrao", children: "Padr\u00E3o" }), _jsx("option", { value: "cozinha", children: "Cozinha" })] }) }), _jsxs("label", { className: "flex items-center gap-2 pt-6 text-sm", children: [_jsx("input", { type: "checkbox", checked: form.sol_direto, onChange: (e) => update('sol_direto', e.target.checked) }), "Sol direto (mais de 4h/dia)"] })] }), _jsx(Field, { label: "Observa\u00E7\u00F5es", children: _jsx("textarea", { className: inputClass, rows: 2, value: form.observacoes ?? '', onChange: (e) => update('observacoes', e.target.value) }) }), _jsxs("div", { className: "rounded-lg bg-brand-50 p-4 text-sm dark:bg-brand-900/20", children: [_jsxs("p", { className: "font-medium text-brand-800 dark:text-brand-300", children: ["BTU necess\u00E1rio estimado: ", detalhamento.btuNecessarioComercial.toLocaleString('pt-BR'), " BTU"] }), _jsxs("p", { className: "mt-1 text-xs text-brand-700/80 dark:text-brand-400/80", children: ["Base: ", Math.round(detalhamento.btuBase).toLocaleString('pt-BR'), " BTU \u00B7 Corre\u00E7\u00F5es:", ' ', Math.round((detalhamento.percentualPeDireito + detalhamento.percentualSolDireto + detalhamento.percentualCozinha) * 100), "% \u00B7 Fixos: ", detalhamento.btuFixoPessoas + detalhamento.btuFixoEletronicos, " BTU"] })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: onClose, className: "rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-300", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: salvando, className: "rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50", children: salvando ? 'Salvando...' : 'Salvar' })] })] }) }));
}
