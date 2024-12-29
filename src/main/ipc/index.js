// Import individual handler files
const appInfoHandler = require("./appInfoHandler");
const entitiesHandler = require("./entitiesHandler");


// Initialize all IPC handlers
function registerIpcHandlers(ipcMain, balancedeskDb) {
    appInfoHandler.init(ipcMain);
    entitiesHandler.init(ipcMain, balancedeskDb.orm);
}

module.exports = { registerIpcHandlers };
