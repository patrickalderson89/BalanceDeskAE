// Ensure that the Utils class is loaded and visible
if (typeof Utils !== "function") {
    throw new Error("Utils class is not defined.");
}

// Utility to handle operation results
function handleResult(operation, entityType, result) {
    console.log(`Operation: ${operation} | Entity: ${entityType} | Result:`, result);
}

// Utility to handle errors
function handleError(operation, entityType, error) {
    console.error(`Operation: ${operation} | Entity: ${entityType} | Error:`, error);
}

// Create Operation
document.getElementById("test-create-btn").addEventListener("click", async () => {
    const entityType = document.getElementById("entityTypeCreate").value;
    const data = {
        name: document.getElementById("nameCreate").value,
        description: document.getElementById("descriptionCreate").value
    };

    try {
        const result = await Utils.createEntity(entityType, data);
        handleResult("Create", entityType, result);
    } catch (error) {
        handleError("Create", entityType, error);
    }
});

// Read Operation
document.getElementById("test-read-btn").addEventListener("click", async () => {
    const entityType = document.getElementById("entityTypeRead").value;
    const id = document.getElementById("idRead").value || null;

    try {
        const result = id
            ? await Utils.readEntity(entityType, { ID: id })
            : await Utils.readAllEntities(entityType);
        handleResult("Read", entityType, result);
    } catch (error) {
        handleError("Read", entityType, error);
    }
});

// Update Operation
document.getElementById("test-update-btn").addEventListener("click", async () => {
    const entityType = document.getElementById("entityTypeUpdate").value;
    const id = document.getElementById("idUpdate").value;
    const data = {
        name: document.getElementById("nameUpdate").value || null,
        description: document.getElementById("descriptionUpdate").value || null
    };

    Object.keys(data).forEach(key => data[key] === null && delete data[key]);

    try {
        const result = await Utils.updateEntity(entityType, data, { ID: id });
        handleResult("Update", entityType, result);
    } catch (error) {
        handleError("Update", entityType, error);
    }
});

// Delete Operation
document.getElementById("test-delete-btn").addEventListener("click", async () => {
    const entityType = document.getElementById("entityTypeDelete").value;
    const id = document.getElementById("idDelete").value;

    try {
        const result = await Utils.deleteEntity(entityType, { ID: id });
        handleResult("Delete", entityType, result);
    } catch (error) {
        handleError("Delete", entityType, error);
    }
});

// Soft Delete Operation
document.getElementById("test-soft-delete-btn").addEventListener("click", async () => {
    const entityType = document.getElementById("entityTypeSoftDelete").value;
    const id = document.getElementById("idSoftDelete").value;

    try {
        const result = await Utils.softDeleteEntity(entityType, { ID: id });
        handleResult("Soft Delete", entityType, result);
    } catch (error) {
        handleError("Soft Delete", entityType, error);
    }
});

// Restore Operation
document.getElementById("test-restore-btn").addEventListener("click", async () => {
    const entityType = document.getElementById("entityTypeRestore").value;
    const id = document.getElementById("idRestore").value;

    try {
        const result = await Utils.restoreEntity(entityType, { ID: id });
        handleResult("Restore", entityType, result);
    } catch (error) {
        handleError("Restore", entityType, error);
    }
});

// Fetch Category Totals
document.getElementById("fetch-category-totals-btn").addEventListener("click", async () => {
    const categoryId = document.getElementById("categoryIdTotals").value || null;

    try {
        const totals = await Utils.getCategoryTotals(categoryId ? Number(categoryId) : null);
        console.log(`Category Totals (ID: ${categoryId}):`, totals);
    } catch (error) {
        console.error(`Error fetching category totals (ID: ${categoryId}):`, error);
    }
});

// Fetch Sub-Budget Totals
document.getElementById("fetch-sub-budget-totals-btn").addEventListener("click", async () => {
    const subBudgetId = document.getElementById("subBudgetIdTotals").value || null;

    try {
        const totals = await Utils.getSubBudgetTotals(subBudgetId ? Number(subBudgetId) : null);
        console.log(`Sub-Budget Totals (ID: ${subBudgetId}):`, totals);
    } catch (error) {
        console.error(`Error fetching sub-budget totals (ID: ${subBudgetId}):`, error);
    }
});
