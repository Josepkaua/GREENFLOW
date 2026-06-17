import { ipcMain } from 'electron'
import {
  listArCondicionados,
  listArCondicionadosBySala,
  createArCondicionado,
  updateArCondicionado,
  deleteArCondicionado
} from '../db/repositories/arCondicionadosRepository'
import type { ArCondicionadoInput } from '@shared/types'

export function registerArCondicionadosHandlers(): void {
  ipcMain.handle('ac:listAll', () => listArCondicionados())
  ipcMain.handle('ac:listBySala', (_e, salaId: number) => listArCondicionadosBySala(salaId))
  ipcMain.handle('ac:create', (_e, input: ArCondicionadoInput) => createArCondicionado(input))
  ipcMain.handle('ac:update', (_e, id: number, input: ArCondicionadoInput) => updateArCondicionado(id, input))
  ipcMain.handle('ac:delete', (_e, id: number) => deleteArCondicionado(id))
}
