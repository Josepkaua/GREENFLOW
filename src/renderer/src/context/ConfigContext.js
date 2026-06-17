import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
const ConfigContext = createContext(null);
export function ConfigProvider({ children }) {
    const [config, setConfig] = useState(null);
    const [systemPrefersDark, setSystemPrefersDark] = useState(false);
    useEffect(() => {
        window.api.config.get().then(setConfig);
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        setSystemPrefersDark(media.matches);
        const listener = (e) => setSystemPrefersDark(e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, []);
    const effectiveDark = config ? (config.tema === 'system' ? systemPrefersDark : config.tema === 'dark') : systemPrefersDark;
    useEffect(() => {
        document.documentElement.classList.toggle('dark', effectiveDark);
    }, [effectiveDark]);
    const updateConfig = useCallback(async (input) => {
        const updated = await window.api.config.update(input);
        setConfig(updated);
    }, []);
    if (!config)
        return null;
    return _jsx(ConfigContext.Provider, { value: { config, effectiveDark, updateConfig }, children: children });
}
export function useConfig() {
    const ctx = useContext(ConfigContext);
    if (!ctx)
        throw new Error('useConfig deve ser usado dentro de ConfigProvider');
    return ctx;
}
