const { ipcMain } = require("electron");

// Import individual handler files
const appInfoHandler = require("./appInfoHandler");
const entitiesHandler = require("./entitiesHandler");


// Initialize all IPC handlers
function registerIpcHandlers() {
    appInfoHandler.init(ipcMain);
    entitiesHandler.init(ipcMain);
}

module.exports = { registerIpcHandlers };
