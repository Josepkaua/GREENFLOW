import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Card({ title, value, subtitle, icon }) {
    return (_jsxs("div", { className: "rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: title }), icon && _jsx("span", { className: "text-xl", children: icon })] }), _jsx("div", { className: "mt-2 text-2xl font-semibold", children: value }), subtitle && _jsx("div", { className: "mt-1 text-xs text-gray-400 dark:text-gray-500", children: subtitle })] }));
}
