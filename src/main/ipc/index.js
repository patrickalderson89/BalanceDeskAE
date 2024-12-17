const { ipcMain } = require("electron");

// Import individual handler files
const appInfoHandler = require("./appInfoHandler");
const entitiesHandler = require("./entitiesHandler");
const appSettingsHandler = require("./appSettingsHandler");


// Initialize all IPC handlers
function registerIpcHandlers() {
    appInfoHandler.init(ipcMain);
    entitiesHandler.init(ipcMain);
    appSettingsHandler.init(ipcMain);
}

module.exports = { registerIpcHandlers };
