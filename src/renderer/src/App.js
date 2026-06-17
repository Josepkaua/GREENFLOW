import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './context/ConfigContext';
import { AppLayout } from './layout/AppLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Salas from './pages/Salas/Salas';
import ArCondicionados from './pages/ArCondicionados/ArCondicionados';
import CalculadoraBTU from './pages/CalculadoraBTU/CalculadoraBTU';
import Gastos from './pages/Gastos/Gastos';
import AguaDrenos from './pages/AguaDrenos/AguaDrenos';
import Graficos from './pages/Graficos/Graficos';
import Configuracoes from './pages/Configuracoes/Configuracoes';
import RelatorioPDF from './pages/RelatorioPDF/RelatorioPDF';
export default function App() {
    return (_jsx(ConfigProvider, { children: _jsx(HashRouter, { children: _jsx(Routes, { children: _jsxs(Route, { element: _jsx(AppLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/salas", element: _jsx(Salas, {}) }), _jsx(Route, { path: "/ares-condicionados", element: _jsx(ArCondicionados, {}) }), _jsx(Route, { path: "/calculadora", element: _jsx(CalculadoraBTU, {}) }), _jsx(Route, { path: "/gastos", element: _jsx(Gastos, {}) }), _jsx(Route, { path: "/agua", element: _jsx(AguaDrenos, {}) }), _jsx(Route, { path: "/graficos", element: _jsx(Graficos, {}) }), _jsx(Route, { path: "/configuracoes", element: _jsx(Configuracoes, {}) }), _jsx(Route, { path: "/relatorio", element: _jsx(RelatorioPDF, {}) })] }) }) }) }));
}
