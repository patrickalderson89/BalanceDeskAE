const { globalShortcut } = require("electron");

/**
 * Registers all global shortcuts for the Electron app.
 * @param {Electron.BrowserWindow} mainWindow - The main application window.
 */
function registerShortcuts(mainWindow) {
    // Open DevTools: Ctrl+Shift+D
    globalShortcut.register("CommandOrControl+Shift+D", () => {
        if (mainWindow && mainWindow.webContents) {
            mainWindow.webContents.openDevTools();
        }
    });

    // Minimize the window: Ctrl+M
    globalShortcut.register("CommandOrControl+M", () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.minimize();
        }
    });

    // Quit the app: Ctrl+Q
    globalShortcut.register("CommandOrControl+Q", () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.close();
        }
    });

    console.log("Global shortcuts registered.");
}

/**
 * Unregisters all global shortcuts.
 */
function unregisterShortcuts() {
    globalShortcut.unregisterAll();
    console.log("Global shortcuts unregistered.");
}

module.exports = {
    registerShortcuts,
    unregisterShortcuts,
};
