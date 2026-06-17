import { contextBridge, ipcRenderer } from 'electron';
const api = {
    salas: {
        list: () => ipcRenderer.invoke('salas:list'),
        listComDimensionamento: () => ipcRenderer.invoke('salas:listComDimensionamento'),
        get: (id) => ipcRenderer.invoke('salas:get', id),
        create: (input) => ipcRenderer.invoke('salas:create', input),
        update: (id, input) => ipcRenderer.invoke('salas:update', id, input),
        remove: (id) => ipcRenderer.invoke('salas:delete', id)
    },
    ac: {
        listAll: () => ipcRenderer.invoke('ac:listAll'),
        listBySala: (salaId) => ipcRenderer.invoke('ac:listBySala', salaId),
        create: (input) => ipcRenderer.invoke('ac:create', input),
        update: (id, input) => ipcRenderer.invoke('ac:update', id, input),
        remove: (id) => ipcRenderer.invoke('ac:delete', id)
    },
    config: {
        get: () => ipcRenderer.invoke('config:get'),
        update: (input) => ipcRenderer.invoke('config:update', input),
        systemPrefersDark: () => ipcRenderer.invoke('config:systemPrefersDark')
    },
    dashboard: {
        summary: () => ipcRenderer.invoke('dashboard:summary')
    },
    pdf: {
        save: (data) => ipcRenderer.invoke('pdf:save', data)
    }
};
contextBridge.exposeInMainWorld('api', api);
