import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { Field, inputClass } from '../../components/Field';
import { MODELOS_COMERCIAIS_BTU } from '@shared/calculations';
function valoresIniciais(ac, salaIdPadrao) {
    if (ac) {
        return {
            sala_id: ac.sala_id,
            marca: ac.marca,
            modelo: ac.modelo,
            btu_instalado: ac.btu_instalado,
            potencia_w: ac.potencia_w,
            horas_dia: ac.horas_dia,
            dias_mes: ac.dias_mes
        };
    }
    return {
        sala_id: salaIdPadrao ?? 0,
        marca: '',
        modelo: '',
        btu_instalado: 12000,
        potencia_w: 1200,
        horas_dia: 8,
        dias_mes: 22
    };
}
export function ArCondicionadoFormModal({ ac, salas, salaIdPadrao, onClose, onSaved }) {
    const [form, setForm] = useState(valoresIniciais(ac, salaIdPadrao));
    const [salvando, setSalvando] = useState(false);
    function update(key, value) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setSalvando(true);
        try {
            if (ac)
                await window.api.ac.update(ac.id, form);
            else
                await window.api.ac.create(form);
            onSaved();
            onClose();
        }
        finally {
            setSalvando(false);
        }
    }
    return (_jsx(Modal, { title: ac ? 'Editar ar-condicionado' : 'Novo ar-condicionado', onClose: onClose, children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(Field, { label: "Sala", children: _jsxs("select", { required: true, className: inputClass, value: form.sala_id || '', onChange: (e) => update('sala_id', Number(e.target.value)), children: [_jsx("option", { value: "", disabled: true, children: "Selecione uma sala" }), salas.map((s) => (_jsx("option", { value: s.id, children: s.nome }, s.id)))] }) }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Field, { label: "Marca", children: _jsx("input", { required: true, className: inputClass, value: form.marca, onChange: (e) => update('marca', e.target.value) }) }), _jsx(Field, { label: "Modelo", children: _jsx("input", { required: true, className: inputClass, value: form.modelo, onChange: (e) => update('modelo', e.target.value) }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Field, { label: "BTU instalado", children: _jsx("select", { className: inputClass, value: form.btu_instalado, onChange: (e) => update('btu_instalado', Number(e.target.value)), children: MODELOS_COMERCIAIS_BTU.map((btu) => (_jsxs("option", { value: btu, children: [btu.toLocaleString('pt-BR'), " BTU"] }, btu))) }) }), _jsx(Field, { label: "Pot\u00EAncia (W)", children: _jsx("input", { required: true, type: "number", min: "0", className: inputClass, value: form.potencia_w, onChange: (e) => update('potencia_w', Number(e.target.value)) }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Field, { label: "Horas de uso/dia", children: _jsx("input", { required: true, type: "number", min: "0", max: "24", className: inputClass, value: form.horas_dia, onChange: (e) => update('horas_dia', Number(e.target.value)) }) }), _jsx(Field, { label: "Dias de uso/m\u00EAs", children: _jsx("input", { required: true, type: "number", min: "0", max: "31", className: inputClass, value: form.dias_mes, onChange: (e) => update('dias_mes', Number(e.target.value)) }) })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: onClose, className: "rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-300", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: salvando || !form.sala_id, className: "rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50", children: salvando ? 'Salvando...' : 'Salvar' })] })] }) }));
}
