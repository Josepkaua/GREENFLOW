import { ipcMain, dialog } from 'electron';
import { writeFile } from 'fs/promises';
export function registerPdfHandlers(getMainWindow) {
    ipcMain.handle('pdf:save', async (_e, data) => {
        const win = getMainWindow();
        const options = {
            title: 'Salvar relatório Green Flow',
            defaultPath: 'relatorio-green-flow.pdf',
            filters: [{ name: 'PDF', extensions: ['pdf'] }]
        };
        const { canceled, filePath } = win ? await dialog.showSaveDialog(win, options) : await dialog.showSaveDialog(options);
        if (canceled || !filePath)
            return { saved: false };
        await writeFile(filePath, Buffer.from(data));
        return { saved: true, filePath };
    });
}
