import { ipcMain, dialog, BrowserWindow } from 'electron'
import { writeFile } from 'fs/promises'

export function registerPdfHandlers(getMainWindow: () => BrowserWindow | null): void {
  ipcMain.handle('pdf:save', async (_e, data: ArrayBuffer) => {
    const win = getMainWindow()
    const options = {
      title: 'Salvar relatório Green Flow',
      defaultPath: 'relatorio-green-flow.pdf',
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    }
    const { canceled, filePath } = win ? await dialog.showSaveDialog(win, options) : await dialog.showSaveDialog(options)

    if (canceled || !filePath) return { saved: false as const }

    await writeFile(filePath, Buffer.from(data))
    return { saved: true as const, filePath }
  })
}
