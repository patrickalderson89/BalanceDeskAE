const { contextBridge, ipcRenderer } = require("electron");

// Expose app info methods to the renderer process
contextBridge.exposeInMainWorld("appinfo", {
    name: async () => {
        return await ipcRenderer.invoke("get-app-name");
    },
    nicename: async () => {
        return await ipcRenderer.invoke("get-app-nicename");
    },
    version: async () => {
        return await ipcRenderer.invoke("get-app-version")
    },
});

// Expose app urls
contextBridge.exposeInMainWorld("urls", {
    defaultPage: "dashboard/dashboard.html",
});
