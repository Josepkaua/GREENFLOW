import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useConfig } from '../../context/ConfigContext';
import { calcularConsumoEnergia, calcularAguaCondensada } from '@shared/calculations';
import { formatCurrency, formatNumber } from '../../lib/format';
export default function RelatorioPDF() {
    const { config } = useConfig();
    const [gerando, setGerando] = useState(false);
    const [mensagem, setMensagem] = useState(null);
    async function gerarRelatorio() {
        setGerando(true);
        setMensagem(null);
        try {
            const salas = await window.api.salas.listComDimensionamento();
            const resumo = await window.api.dashboard.summary();
            const doc = new jsPDF();
            const dataGeracao = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date());
            doc.setFontSize(18);
            doc.text('Green Flow — Relatório de Gestão de Ares-Condicionados', 14, 18);
            doc.setFontSize(10);
            doc.setTextColor(120);
            doc.text(`Gerado em ${dataGeracao}`, 14, 24);
            doc.setTextColor(0);
            doc.setFontSize(12);
            doc.text(`Resumo: ${resumo.numSalas} salas · ${resumo.numAres} ares-condicionados · ${formatCurrency(resumo.gastoMensalTotal)}/mês · ${formatNumber(resumo.litrosDiaTotal)} L/dia de água condensada`, 14, 33);
            autoTable(doc, {
                startY: 40,
                head: [['Sala', 'BTU necessário', 'BTU instalado', '% dimensionamento', 'Status']],
                body: salas.map((s) => [
                    s.nome,
                    s.btu_necessario.toLocaleString('pt-BR'),
                    s.btuInstaladoTotal.toLocaleString('pt-BR'),
                    `${s.percentualDimensionamento.toFixed(0)}%`,
                    s.ares.length === 0 ? 'sem AC' : s.status
                ])
            });
            const linhasEnergia = salas.flatMap((sala) => sala.ares.map((ac) => {
                const { kWhMes, custoMes } = calcularConsumoEnergia(ac.potencia_w, ac.horas_dia, ac.dias_mes, config.tarifa_kwh);
                return [sala.nome, `${ac.marca} ${ac.modelo}`, formatNumber(kWhMes), formatCurrency(custoMes)];
            }));
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 10,
                head: [['Sala', 'Aparelho', 'kWh/mês', 'Custo/mês']],
                body: linhasEnergia
            });
            const linhasAgua = salas.flatMap((sala) => sala.ares.map((ac) => {
                const { litrosDia, litrosMes } = calcularAguaCondensada(ac.btu_instalado, config.umidade_relativa, ac.horas_dia, ac.dias_mes);
                return [sala.nome, `${ac.marca} ${ac.modelo}`, formatNumber(litrosDia), formatNumber(litrosMes)];
            }));
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 10,
                head: [['Sala', 'Aparelho', 'Água L/dia', 'Água L/mês']],
                body: linhasAgua
            });
            let y = doc.lastAutoTable.finalY + 10;
            doc.setFontSize(12);
            doc.text('Recomendações', 14, y);
            y += 6;
            doc.setFontSize(10);
            if (resumo.sugestoesTroca.length === 0) {
                doc.text('Nenhuma sugestão de troca entre salas no momento.', 14, y);
                y += 6;
            }
            else {
                for (const s of resumo.sugestoesTroca) {
                    doc.text(`- Trocar aparelhos entre "${s.salaSuperNome}" (super) e "${s.salaSubNome}" (sub).`, 14, y);
                    y += 6;
                }
            }
            y += 4;
            doc.setFontSize(8);
            doc.setTextColor(120);
            const fontes = [
                'Marinho et al. (2021). Estimativa de vazão da água condensada proveniente de aparelhos condicionadores de ar. Research, Society and Development, v.10, n.13. DOI: 10.33448/rsd-v10i13.21100.',
                'Lima et al. (2015). Água de ar condicionado: uma fonte alternativa de água potável? VI Congresso Brasileiro de Gestão Ambiental — IBEAS.',
                'WebArCondicionado / cursodearcondicionado.com.br — Cálculo de BTU por volume com pé-direito alto.'
            ];
            for (const fonte of fontes) {
                const linhas = doc.splitTextToSize(fonte, 180);
                doc.text(linhas, 14, y);
                y += linhas.length * 4;
            }
            const buffer = doc.output('arraybuffer');
            const resultado = await window.api.pdf.save(buffer);
            setMensagem(resultado.saved ? `Relatório salvo em: ${resultado.filePath}` : 'Geração cancelada.');
        }
        finally {
            setGerando(false);
        }
    }
    return (_jsxs("div", { className: "max-w-xl space-y-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900", children: [_jsx("h2", { className: "text-base font-semibold", children: "Relat\u00F3rio completo em PDF" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Inclui dados de salas e ares-condicionados, dimensionamento, consumo de energia, \u00E1gua condensada estimada, recomenda\u00E7\u00F5es de troca e as fontes t\u00E9cnicas utilizadas nos c\u00E1lculos." }), _jsx("button", { onClick: gerarRelatorio, disabled: gerando, className: "rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50", children: gerando ? 'Gerando...' : '📄 Gerar relatório PDF' }), mensagem && _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: mensagem })] }));
}
