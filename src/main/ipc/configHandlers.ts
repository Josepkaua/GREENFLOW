import { ipcMain, nativeTheme } from 'electron'
import { getConfig, updateConfig } from '../db/repositories/configRepository'
import type { ConfiguracaoInput } from '@shared/types'

export function registerConfigHandlers(): void {
  ipcMain.handle('config:get', () => getConfig())
  ipcMain.handle('config:update', (_e, input: ConfiguracaoInput) => {
    const config = updateConfig(input)
    nativeTheme.themeSource = config.tema
    return config
  })
  ipcMain.handle('config:systemPrefersDark', () => nativeTheme.shouldUseDarkColors)
}
