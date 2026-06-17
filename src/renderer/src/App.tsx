import { HashRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from './context/ConfigContext'
import { AppLayout } from './layout/AppLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Salas from './pages/Salas/Salas'
import ArCondicionados from './pages/ArCondicionados/ArCondicionados'
import CalculadoraBTU from './pages/CalculadoraBTU/CalculadoraBTU'
import Gastos from './pages/Gastos/Gastos'
import AguaDrenos from './pages/AguaDrenos/AguaDrenos'
import Graficos from './pages/Graficos/Graficos'
import Configuracoes from './pages/Configuracoes/Configuracoes'
import RelatorioPDF from './pages/RelatorioPDF/RelatorioPDF'

export default function App(): JSX.Element {
  return (
    <ConfigProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/salas" element={<Salas />} />
            <Route path="/ares-condicionados" element={<ArCondicionados />} />
            <Route path="/calculadora" element={<CalculadoraBTU />} />
            <Route path="/gastos" element={<Gastos />} />
            <Route path="/agua" element={<AguaDrenos />} />
            <Route path="/graficos" element={<Graficos />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/relatorio" element={<RelatorioPDF />} />
          </Route>
        </Routes>
      </HashRouter>
    </ConfigProvider>
  )
}
