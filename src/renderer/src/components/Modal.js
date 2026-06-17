import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Modal({ title, onClose, children }) {
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", onClick: onClose, children: _jsxs("div", { className: "max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold", children: title }), _jsx("button", { type: "button", onClick: onClose, className: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200", "aria-label": "Fechar", children: "\u2715" })] }), children] }) }));
}
