import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Configuracao, ConfiguracaoInput } from '@shared/types'

interface ConfigContextValue {
  config: Configuracao
  effectiveDark: boolean
  updateConfig: (input: ConfiguracaoInput) => Promise<void>
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

export function ConfigProvider({ children }: { children: ReactNode }): JSX.Element | null {
  const [config, setConfig] = useState<Configuracao | null>(null)
  const [systemPrefersDark, setSystemPrefersDark] = useState(false)

  useEffect(() => {
    window.api.config.get().then(setConfig)

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemPrefersDark(media.matches)
    const listener = (e: MediaQueryListEvent): void => setSystemPrefersDark(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  const effectiveDark = config ? (config.tema === 'system' ? systemPrefersDark : config.tema === 'dark') : systemPrefersDark

  useEffect(() => {
    document.documentElement.classList.toggle('dark', effectiveDark)
  }, [effectiveDark])

  const updateConfig = useCallback(async (input: ConfiguracaoInput) => {
    const updated = await window.api.config.update(input)
    setConfig(updated)
  }, [])

  if (!config) return null

  return <ConfigContext.Provider value={{ config, effectiveDark, updateConfig }}>{children}</ConfigContext.Provider>
}

export function useConfig(): ConfigContextValue {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('useConfig deve ser usado dentro de ConfigProvider')
  return ctx
}
