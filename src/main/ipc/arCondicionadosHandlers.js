import { ipcMain } from 'electron';
import { listArCondicionados, listArCondicionadosBySala, createArCondicionado, updateArCondicionado, deleteArCondicionado } from '../db/repositories/arCondicionadosRepository';
export function registerArCondicionadosHandlers() {
    ipcMain.handle('ac:listAll', () => listArCondicionados());
    ipcMain.handle('ac:listBySala', (_e, salaId) => listArCondicionadosBySala(salaId));
    ipcMain.handle('ac:create', (_e, input) => createArCondicionado(input));
    ipcMain.handle('ac:update', (_e, id, input) => updateArCondicionado(id, input));
    ipcMain.handle('ac:delete', (_e, id) => deleteArCondicionado(id));
}
