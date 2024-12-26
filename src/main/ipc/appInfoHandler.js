const { app } = require("electron");
const path = require("path");
const productNiceName = require(path.join(app.getAppPath(), "package.json")).productNiceName;

module.exports = {
    init(ipcMain) {
        // Handle "get-app-info" events and return app info
        ipcMain.handle("get-app-name", () => {
            return app.getName();
        });
        ipcMain.handle("get-app-nicename", () => {
            return productNiceName;
        });
        ipcMain.handle("get-app-version", () => {
            return app.getVersion();
        });
    }
};
