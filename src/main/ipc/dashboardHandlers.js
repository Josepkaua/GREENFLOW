import { ipcMain } from 'electron';
import { getDashboardSummary } from '../services/salaAggregationService';
export function registerDashboardHandlers() {
    ipcMain.handle('dashboard:summary', () => getDashboardSummary());
}
