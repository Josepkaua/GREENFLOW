import { ipcMain } from 'electron';
import { listSalas, getSala, createSala, updateSala, deleteSala } from '../db/repositories/salasRepository';
import { getSalasComDimensionamento } from '../services/salaAggregationService';
export function registerSalasHandlers() {
    ipcMain.handle('salas:list', () => listSalas());
    ipcMain.handle('salas:listComDimensionamento', () => getSalasComDimensionamento());
    ipcMain.handle('salas:get', (_e, id) => getSala(id));
    ipcMain.handle('salas:create', (_e, input) => createSala(input));
    ipcMain.handle('salas:update', (_e, id, input) => updateSala(id, input));
    ipcMain.handle('salas:delete', (_e, id) => deleteSala(id));
}
