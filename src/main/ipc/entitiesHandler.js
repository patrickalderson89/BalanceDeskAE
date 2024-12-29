module.exports = {
    init(ipcMain, orm) {
        // Define the entities and their corresponding database tables
        const entities = {
            category: "categories",
            subBudget: "sub_budgets",
            income: "incomes",
            expense: "expenses",
        };

        // Define CRUD operations
        const operations = {
            create: async (tableName, data) => { return await orm.insert(tableName, data) },
            read: async (tableName, conditions, columns, deleted) => {
                const result = await orm.select(tableName, conditions, columns, deleted);
                return result.length > 0 ? result[0] : null;
            },
            update: async (tableName, data, conditions) => { return await orm.update(tableName, data, conditions) },
            delete: async (tableName, conditions) => { return await orm.delete(tableName, conditions) },
        };

        // Dynamically register IPC handlers for each entity and operation
        for (const [entityName, tableName] of Object.entries(entities)) {
            for (const [operationName, operationHandler] of Object.entries(operations)) {
                const channel = `${operationName}-${entityName}`;
                ipcMain.handle(channel, async (event, ...args) => {
                    try {
                        // Pass the table name and arguments to the operation handler
                        return await operationHandler(tableName, ...args);
                    } catch (error) {
                        console.error(`Error handling ${channel}:`, error);
                        return false;
                    }
                });
            }
        }

        ipcMain.handle("getCategoryTotals", async (event, ID) => {
            try {
                return await orm.getCategoryTotals(ID)
            } catch {
                console.error(`Error handling ${channel}:`, error);
                return false;
            }
        });
        ipcMain.handle("getSubBudgetTotals", async (event, ID) => {
            try {
                return await orm.getSubBudgetTotals(ID)
            } catch {
                console.error(`Error handling ${channel}:`, error);
                return false;
            }
        });
    },
};
