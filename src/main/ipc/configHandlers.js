import { ipcMain, nativeTheme } from 'electron';
import { getConfig, updateConfig } from '../db/repositories/configRepository';
export function registerConfigHandlers() {
    ipcMain.handle('config:get', () => getConfig());
    ipcMain.handle('config:update', (_e, input) => {
        const config = updateConfig(input);
        nativeTheme.themeSource = config.tema;
        return config;
    });
    ipcMain.handle('config:systemPrefersDark', () => nativeTheme.shouldUseDarkColors);
}
