import { ipcMain } from 'electron'
import { listSalas, getSala, createSala, updateSala, deleteSala } from '../db/repositories/salasRepository'
import { getSalasComDimensionamento } from '../services/salaAggregationService'
import type { SalaInput } from '@shared/types'

export function registerSalasHandlers(): void {
  ipcMain.handle('salas:list', () => listSalas())
  ipcMain.handle('salas:listComDimensionamento', () => getSalasComDimensionamento())
  ipcMain.handle('salas:get', (_e, id: number) => getSala(id))
  ipcMain.handle('salas:create', (_e, input: SalaInput) => createSala(input))
  ipcMain.handle('salas:update', (_e, id: number, input: SalaInput) => updateSala(id, input))
  ipcMain.handle('salas:delete', (_e, id: number) => deleteSala(id))
}
