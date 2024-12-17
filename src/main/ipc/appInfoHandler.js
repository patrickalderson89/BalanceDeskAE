const { app } = require("electron");

module.exports = {
    init(ipcMain) {
        // Handle "get-app-info" events and return app info
        ipcMain.handle("get-app-name", () => {
            return app.getName();
        });
        ipcMain.handle("get-app-version", () => {
            return app.getVersion();
        });
    }
};
