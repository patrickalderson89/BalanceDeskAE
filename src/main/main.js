// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog, ipcMain } = require("electron");
const path = require("path");
const { SRC_PATH, MAIN_PROCESS_PATH, RENDERER_PROCESS_PATH } = require(path.join(__dirname, "constants"));
const { registerIpcHandlers } = require(path.join(MAIN_PROCESS_PATH, "ipc")); // Centralized import
const { entitiesDb, appSettingsDb } = require(path.join(MAIN_PROCESS_PATH, "database"));

// Prevent the app from loading a default menu as it is not needed.
Menu.setApplicationMenu(null);

let mainWindow = null;
const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: app.getName(),
        icon: path.join(RENDERER_PROCESS_PATH, "assets", "icons", "logo.ico"),
        webPreferences: {
            preload: path.join(RENDERER_PROCESS_PATH, "scripts", "preload.js"),
        },
        show: false,
        paintWhenInitiallyHidden: false,
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(RENDERER_PROCESS_PATH, "pages", "index.html"));

    // Clean up when the window is closed
    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    app.on("activate", () => {
        // On macOS it"s common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    createWindow();
    registerIpcHandlers(); // Register all IPC handlers

    // =============================
    // Initialize core databases
    // =============================
    const coreDatabases = [entitiesDb, appSettingsDb];

    for (const db of coreDatabases) {
        const name = db.dbName;
        try {
            await db.init();
            console.log(`${name} database initialized`);
        } catch (err) {
            console.error(`Error initializing ${name} database: ${err}`);

            // Show an error dialog only after the main window is ready
            await dialog.showMessageBox(mainWindow, {
                type: "error",
                title: "Errore durante l'inizializzazione del database",
                message: "L'applicazione ha riscontrato un problema critico e non può essere avviata.",
                buttons: ["Chiudi"]
            }).then(() => {
                app.quit();
            });

            break; // Stop at the first error
        }
    }

    mainWindow.show();
});

// Quit when all windows are closed, except on macOS. There, it"s common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});