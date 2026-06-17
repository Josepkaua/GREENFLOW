import { ipcMain } from 'electron'
import { getDashboardSummary } from '../services/salaAggregationService'

export function registerDashboardHandlers(): void {
  ipcMain.handle('dashboard:summary', () => getDashboardSummary())
}
