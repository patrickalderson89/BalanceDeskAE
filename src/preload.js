const { contextBridge, ipcRenderer } = require("electron");

// Fetch app info once and store it
let appInfo = null;

const getAppInfo = async () => {
    if (!appInfo) {
        appInfo = await ipcRenderer.invoke("get-app-info");
    }
    return appInfo;
};

// Expose app info methods to the renderer process
contextBridge.exposeInMainWorld("appinfo", {
    name: async () => {
        const info = await getAppInfo();
        return info.name;
    },
    version: async () => {
        const info = await getAppInfo();
        return info.version;
    },
});

// Expose app urls
contextBridge.exposeInMainWorld("urls", {
    defaultPage: "pages/dashboard/dashboard.html",
});
