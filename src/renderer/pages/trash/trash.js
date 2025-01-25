var tableBody = document.getElementById("trash-table-body");

// Entity types to fetch
var entityTypes = ["category", "subBudget", "income", "expense"];

// Fetch deleted items for a specific entity type
async function fetchDeletedItemsForType(entityType) {
    try {
        let nameColumn = entityType === "income" || entityType === "expense" ? "title" : "name";
        const response = await Utils.readEntity(entityType, { is_deleted: 1 }, ["ID", nameColumn, "description", "deleted_at"], true);
        return response;
    } catch (error) {
        console.error(`Error fetching deleted ${entityType}:`, error);
        return [];
    }
}

// Fetch and display all deleted items
async function fetchAndDisplayDeletedItems() {
    const entityNameMap = {
        category: "Categoria",
        subBudget: "Sotto Bilancio",
        income: "Entrata",
        expense: "Uscita"
    }
    for (const entityType of entityTypes) {
        const items = await fetchDeletedItemsForType(entityType);

        if (items < 1) {
            continue;
        }

        // Create a header row for the entity type
        const headerRow = document.createElement("tr");
        headerRow.classList.add("entity-header");
        headerRow.innerHTML = `<td colspan="4">${entityNameMap[entityType].toUpperCase()}</td>`;
        tableBody.appendChild(headerRow);

        // Create rows for each deleted item under the entity type
        items.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${item.title || item.name || "N/A"}</td>
        <td>${item.deleted_at
                    ? Utils.formatDate(item.deleted_at)
                    : "Sconosciuto"}</td>
        <td>
          <button class="restore-btn" data-entity="${entityType}" data-id="${item.id}">Ripristina</button>
          <button class="delete-btn" data-entity="${entityType}" data-id="${item.id}">Elimina</button>
        </td>
      `;
            tableBody.appendChild(row);
        });
    }
}

// Add event listeners for restore and delete buttons
tableBody.addEventListener("click", async (event) => {
    const target = event.target;

    // Check if it's a restore or delete button
    if (target.classList.contains("restore-btn") || target.classList.contains("delete-btn")) {
        const entityType = target.dataset.entity;
        const entityId = target.dataset.id;
        const action = target.classList.contains("delete-btn") ? "deleteEntity" : "restoreEntity";

        try {
            const response = await Utils[action](entityType, { ID: entityId });
            if (response) {
                target.closest("tr").remove();
            } else {
                console.error(`Failed to ${action} item. Please try again.`);
            }
        } catch (error) {
            console.error(`Error during ${action}:`, error);
        }
    }
});

// Fetch and display the data
fetchAndDisplayDeletedItems();
