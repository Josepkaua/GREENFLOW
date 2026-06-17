import { contextBridge, ipcRenderer } from 'electron'
import type {
  Sala,
  SalaInput,
  SalaComDimensionamento,
  ArCondicionado,
  ArCondicionadoInput,
  Configuracao,
  ConfiguracaoInput,
  DashboardSummary
} from '@shared/types'
import type { ElectronApi } from '@shared/api'

const api: ElectronApi = {
  salas: {
    list: (): Promise<Sala[]> => ipcRenderer.invoke('salas:list'),
    listComDimensionamento: (): Promise<SalaComDimensionamento[]> => ipcRenderer.invoke('salas:listComDimensionamento'),
    get: (id: number): Promise<Sala | undefined> => ipcRenderer.invoke('salas:get', id),
    create: (input: SalaInput): Promise<Sala> => ipcRenderer.invoke('salas:create', input),
    update: (id: number, input: SalaInput): Promise<Sala> => ipcRenderer.invoke('salas:update', id, input),
    remove: (id: number): Promise<void> => ipcRenderer.invoke('salas:delete', id)
  },
  ac: {
    listAll: (): Promise<ArCondicionado[]> => ipcRenderer.invoke('ac:listAll'),
    listBySala: (salaId: number): Promise<ArCondicionado[]> => ipcRenderer.invoke('ac:listBySala', salaId),
    create: (input: ArCondicionadoInput): Promise<ArCondicionado> => ipcRenderer.invoke('ac:create', input),
    update: (id: number, input: ArCondicionadoInput): Promise<ArCondicionado> => ipcRenderer.invoke('ac:update', id, input),
    remove: (id: number): Promise<void> => ipcRenderer.invoke('ac:delete', id)
  },
  config: {
    get: (): Promise<Configuracao> => ipcRenderer.invoke('config:get'),
    update: (input: ConfiguracaoInput): Promise<Configuracao> => ipcRenderer.invoke('config:update', input),
    systemPrefersDark: (): Promise<boolean> => ipcRenderer.invoke('config:systemPrefersDark')
  },
  dashboard: {
    summary: (): Promise<DashboardSummary> => ipcRenderer.invoke('dashboard:summary')
  },
  pdf: {
    save: (data: ArrayBuffer): Promise<{ saved: boolean; filePath?: string }> => ipcRenderer.invoke('pdf:save', data)
  }
}

contextBridge.exposeInMainWorld('api', api)
