class Utils {
    // Static method to set the text content of an element by ID
    static setElementText(elementId, text) {
        const el = document.getElementById(elementId);
        if (el instanceof HTMLElement) {
            el.innerText = text;
        } else {
            console.error(`Unable to set text for element with ID: ${elementId}.`);
        }
    }

    // Format the date for display in a user-friendly format (Italian style)
    static formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
        return new Date(dateString).toLocaleDateString("it-IT", options);
    }

    // Update the properties of the previous and current pages
    static setPages(previous, current) {
        const previousField = document.getElementById("previous-page");
        const currentField = document.getElementById("current-page");

        if (previousField && currentField) {
            previousField.value = previous;
            currentField.value = current;

            console.log("Set pages to: \n\tPrevious: " + previous + "\n\tCurrent: " + current);

            return true;
        }

        console.error("Unable to set pages.");

        return false;
    }

    // Update the properties of the current item
    static setCurrentItem(type, id) {
        const typeField = document.getElementById("current-item-type");
        const idField = document.getElementById("current-item-id");

        if (typeField && idField) {
            typeField.value = type;
            idField.value = id;

            return true;
        }

        return false;
    }

    // Retrieve the properties of the current item
    static getCurrentItem() {
        const typeField = document.getElementById("current-item-type");
        const idField = document.getElementById("current-item-id");

        if (typeField && idField) {
            return {
                type: typeField.value,
                id: idField.value
            };
        }

        return false;
    }

    // Function to load HTML content dynamically
    static async loadPageHTMLContent(pageUrl, containerId = "main-content") {
        let success = false;
        const container = document.getElementById(containerId);
        container.style.visibility = "hidden";
        try {
            const response = await fetch(pageUrl);
            const html = await response.text();

            container.innerHTML = html;

            container.querySelectorAll("script").forEach((oldScript) => {
                const newScript = document.createElement("script");
                newScript.src = oldScript.src || ""; // Handle external scripts
                newScript.textContent = oldScript.textContent; // Handle inline scripts
                newScript.async = oldScript.async; // Preserve async attribute

                container.appendChild(newScript);
                oldScript.remove();
            });

            success = true;
        } catch (error) {
            console.error(`Error loading content ${error}.`);
        }

        container.style.visibility = "visible";
        return success;
    }

    // Function to retrieve app info
    static async getAppInfo(type) {
        const { appinfo } = window; // appinfo is exposed through contextBridge

        if (!appinfo) {
            console.warn("appinfo is not available.");
            return "";
        }

        try {
            if (type === "name") {
                return await appinfo?.name() || "";
            } else if (type === "nicename") {
                return await appinfo?.nicename() || "";
            } else if (type === "version") {
                return await appinfo?.version() || "";
            } else {
                console.warn("Invalid app info type.");
                return "";
            }
        } catch (error) {
            console.warn(`Error fetching app info ${error}.`);
            return "";
        }
    }

    /**
     * Dynamically create an entity.
     * @param {string} type - The type of entity (e.g., "category", "subBudget", "income", "expense").
     * @param {object} data - The data object to be used for creating the entity.
     * @returns {Promise<boolean|any>} - The result of the create operation.
     */
    static async createEntity(type, data) {
        const { database } = window;

        if (!database) {
            console.error("Database interface is not available.");
            return false;
        }

        const createMethod = `create${type.charAt(0).toUpperCase() + type.slice(1)}`;

        if (typeof database[createMethod] !== "function") {
            console.error(`Create method for entity type "${type}" is not defined.`);
            return false;
        }

        try {
            const result = await database[createMethod](data);
            return result;
        } catch (error) {
            console.error(`Error creating entity "${type}":`, error);
            return false;
        }
    }

    /**
     * Dynamically read an entity.
     * @param {string} type - The type of entity (e.g., "category", "subBudget", "income", "expense").
     * @param {object} conditions - The conditions to filter the read operation.
     * @param {string[]} columns - The columns to retrieve. Default to all.
     * @param {boolean} deleted - Whether to include deleted entities. Default false.
     * @returns {Promise<boolean|any>} - The result of the read operation.
     */
    static async readEntity(type, conditions, columns = ["*"], deleted = false) {
        const { database } = window;

        if (!database) {
            console.error("Database interface is not available.");
            return false;
        }

        const readMethod = `read${type.charAt(0).toUpperCase() + type.slice(1)}`;

        if (typeof database[readMethod] !== "function") {
            console.error(`Read method for entity type "${type}" is not defined.`);
            return false;
        }

        try {
            const result = await database[readMethod](conditions, columns, deleted);
            return result;
        } catch (error) {
            console.error(`Error reading entity "${type}":`, error);
            return false;
        }
    }

    /**
     * Dynamically update an entity.
     * @param {string} type - The type of entity (e.g., "category", "subBudget", "income", "expense").
     * @param {object} data - The data object to be used for updating the entity.
     * @param {object} conditions - The conditions to filter the update operation.
     * @returns {Promise<boolean|any>} - The result of the update operation.
     */
    static async updateEntity(type, data, conditions) {
        const { database } = window;

        if (!database) {
            console.error("Database interface is not available.");
            return false;
        }

        const updateMethod = `update${type.charAt(0).toUpperCase() + type.slice(1)}`;

        if (typeof database[updateMethod] !== "function") {
            console.error(`Update method for entity type "${type}" is not defined.`);
            return false;
        }

        try {
            const result = await database[updateMethod](data, conditions);
            return result;
        } catch (error) {
            console.error(`Error updating entity "${type}":`, error);
            return false;
        }
    }

    /**
     * Dynamically delete an entity.
     * @param {string} type - The type of entity (e.g., "category", "subBudget", "income", "expense").
     * @param {object} conditions - The conditions to filter the delete operation.
     * @returns {Promise<boolean|any>} - The result of the delete operation.
     */
    static async deleteEntity(type, conditions) {
        const { database } = window;

        if (!database) {
            console.error("Database interface is not available.");
            return false;
        }

        const deleteMethod = `delete${type.charAt(0).toUpperCase() + type.slice(1)}`;

        if (typeof database[deleteMethod] !== "function") {
            console.error(`Delete method for entity type "${type}" is not defined.`);
            return false;
        }

        try {
            const result = await database[deleteMethod](conditions);
            return result;
        } catch (error) {
            console.error(`Error deleting entity "${type}":`, error);
            return false;
        }
    }

    /**
     * Dynamically soft delete an entity (mark it as deleted without removing).
     * @param {string} type - The type of entity (e.g., "category", "subBudget", "income", "expense").
     * @param {object} conditions - The conditions to filter the soft delete operation.
     * @returns {Promise<boolean|any>} - The result of the soft delete operation.
     */
    static async softDeleteEntity(type, conditions) {
        const { database } = window;

        if (!database) {
            console.error("Database interface is not available.");
            return false;
        }

        const softDeleteMethod = `softDelete${type.charAt(0).toUpperCase() + type.slice(1)}`;

        if (typeof database[softDeleteMethod] !== "function") {
            console.error(`Soft delete method for entity type "${type}" is not defined.`);
            return false;
        }

        try {
            const result = await database[softDeleteMethod](conditions);
            return result;
        } catch (error) {
            console.error(`Error soft deleting entity "${type}":`, error);
            return false;
        }
    }

    /**
     * Dynamically restore a soft-deleted entity.
     * @param {string} type - The type of entity (e.g., "category", "subBudget", "income", "expense").
     * @param {object} conditions - The conditions to filter the restore operation.
     * @returns {Promise<boolean|any>} - The result of the restore operation.
     */
    static async restoreEntity(type, conditions) {
        const { database } = window;

        if (!database) {
            console.error("Database interface is not available.");
            return false;
        }

        const restoreMethod = `restore${type.charAt(0).toUpperCase() + type.slice(1)}`;

        if (typeof database[restoreMethod] !== "function") {
            console.error(`Restore method for entity type "${type}" is not defined.`);
            return false;
        }

        try {
            const result = await database[restoreMethod](conditions);
            return result;
        } catch (error) {
            console.error(`Error restoring entity "${type}":`, error);
            return false;
        }
    }

    /**
     * Fetch all entities of a specific type.
     * @param {string} type - The type of entity (e.g., "category", "subBudget", "income", "expense").
     * @param {boolean} deleted - Whether to include deleted entities. Default false.
     * @returns {Promise<any[]>} - An array of all entities of the specified type.
     */
    static async readAllEntities(type, deleted = false) {
        const { database } = window;

        if (!database) {
            console.error("Database interface is not available.");
            return [];
        }

        const readAllMethod = `readAll${type.charAt(0).toUpperCase() + type.slice(1)}`;

        if (typeof database[readAllMethod] !== "function") {
            console.error(`Read all method for entity type "${type}" is not defined.`);
            return [];
        }

        try {
            const result = await database[readAllMethod](deleted);
            return result;
        } catch (error) {
            console.error(`Error fetching all entities for "${type}":`, error);
            return [];
        }
    }

    /**
     * Fetch category totals (incomes and expenses) for all categories or by category ID.
     * @param {number} categoryId - The ID of the category to fetch totals for. Default null.
     * @returns {Promise<object>} - An object containing total incomes and expenses for all categories or the specified category.
     */
    static async getCategoryTotals(categoryId = null) {
        const { database } = window;

        if (!database) {
            console.error("Database interface is not available.");
            return null;
        }

        if (typeof database.getCategoryTotals !== "function") {
            console.error(`Method 'getCategoryTotals' is not defined in the database interface.`);
            return null;
        }

        try {
            const totals = await database.getCategoryTotals(categoryId);
            return categoryId ? totals[0] : totals;
        } catch (error) {
            console.error(`Error fetching category totals for ID "${categoryId}":`, error);
            return null;
        }
    }

    /**
     * Fetch sub-budget totals (incomes and expenses) for all budgets or by sub-budget ID.
     * @param {number} subBudgetId - The ID of the sub-budget to fetch totals for. Default null.
     * @returns {Promise<object>} - An object containing total incomes and expenses for all sub-budgets or the specified sub-budget.
     */
    static async getSubBudgetTotals(subBudgetId = null) {
        const { database } = window;

        if (!database) {
            console.error("Database interface is not available.");
            return null;
        }

        if (typeof database.getSubBudgetTotals !== "function") {
            console.error(`Method 'getSubBudgetTotals' is not defined in the database interface.`);
            return null;
        }

        try {
            const totals = await database.getSubBudgetTotals(subBudgetId);
            return subBudgetId ? totals[0] : totals;
        } catch (error) {
            console.error(`Error fetching sub-budget totals for ID "${subBudgetId}":`, error);
            return null;
        }
    }
}