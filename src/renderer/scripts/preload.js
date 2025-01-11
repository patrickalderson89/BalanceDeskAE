const { contextBridge, ipcRenderer } = require("electron");

// Define the entities operations to expose
const entities = [
    "Category", "SubBudget", "Income", "Expense"
];
const createExposeMethods = (entities) => {
    const exposedMethods = {};

    entities.forEach(operation => {
        const operationLower = operation.charAt(0).toLowerCase() + operation.slice(1);

        // Create methods for each operation (create, read, update, delete)
        exposedMethods[`create${operation}`] = async (data) => { return await ipcRenderer.invoke(`create-${operationLower}`, data) };
        exposedMethods[`read${operation}`] = async (conditions, columns, deleted) => { return await ipcRenderer.invoke(`read-${operationLower}`, conditions, columns, deleted) };
        exposedMethods[`readAll${operation}`] = async (deleted) => { return await ipcRenderer.invoke(`read-${operationLower}`, {}, ['*'], deleted) };
        exposedMethods[`update${operation}`] = async (data, conditions) => { return await ipcRenderer.invoke(`update-${operationLower}`, data, conditions) };
        exposedMethods[`delete${operation}`] = async (conditions) => { return await ipcRenderer.invoke(`delete-${operationLower}`, conditions) };
        exposedMethods[`softDelete${operation}`] = async (conditions) => { return await ipcRenderer.invoke(`update-${operationLower}`, { is_deleted: 1, deleted_at: new Date() }, conditions) };
        exposedMethods[`restore${operation}`] = async (conditions) => { return await ipcRenderer.invoke(`update-${operationLower}`, { is_deleted: 0, deleted_at: new Date() }, conditions) };
    });

    exposedMethods["getCategoryTotals"] = async (ID) => { return await ipcRenderer.invoke("getCategoryTotals", ID) };
    exposedMethods["getSubBudgetTotals"] = async (ID) => { return await ipcRenderer.invoke("getSubBudgetTotals", ID) };

    return exposedMethods;
};

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

// Dynamically expose the CRUD methods
contextBridge.exposeInMainWorld("database", createExposeMethods(entities));