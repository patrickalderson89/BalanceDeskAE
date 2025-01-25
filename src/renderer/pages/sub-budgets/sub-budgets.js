var tableBody = document.getElementById("sub-budgets-table-body");
var currentItem = Utils.getCurrentItem();

async function createTableRow(subBudget) {
    const row = document.createElement("tr");

    // Assign the subBudget ID to the row using the dataset property
    row.dataset.subBudgetId = subBudget.id;

    let totalIncomes = 0;
    let totalExpenses = 0;
    try {
        const totals = await Utils.getSubBudgetTotals(subBudget.id);
        if (totals) {
            totalIncomes = totals.total_incomes;
            totalExpenses = totals.total_expenses;
        }
    } catch {
        console.error("Unable to retrieve sub-budget totals.");
    }

    // Add subBudget data to the row
    row.innerHTML = `
        <td>${subBudget.name}</td>
        <td>${subBudget.description}</td>
        <td>${totalIncomes}€</td>
        <td>${totalExpenses}€</td>
        <td>${totalIncomes - totalExpenses}€</td>
        <td><span class="details">Apri</span></td>
    `;

    // Append the row to the table
    tableBody.appendChild(row);

    // Add click event listener to the row to show details about the subBudget
    row.querySelector(".details").addEventListener("click", async () => {
        Utils.setCurrentItem("subBudget", row.dataset.subBudgetId);
        Utils.setPages("sub-budgets/sub-budgets.html", "sub-budget/sub-budget.html");
        await Utils.loadPageHTMLContent("../sub-budget/sub-budget.html");
    });
}

function setCategoryName(name) {
    if (name) {
        document.getElementById("category-name").textContent = name.trim();
    }
}

async function fetchItems() {
    const subBudgets = await Utils.readEntity("subBudget", { category_id: currentItem.id });

    let categoryName = "N/A";
    try {
        const category = await Utils.readEntity("category", { id: currentItem.id });
        categoryName = category[0].name;
    } catch {
        console.error("Unable to retrieve category name.");
    }
    setCategoryName(categoryName);

    subBudgets.forEach(async (subBudget) => {
        await createTableRow(subBudget);
    });
}

// Fetch and populate the table
document.getElementById("sub-budgets-page").addEventListener("load", async () => {
    if (document.getElementById("current-page").value === "sub-budgets/sub-budgets.html") {
        tableBody.innerHTML = '';
        await fetchItems();
    }
});

document.getElementById("sub-budgets-page").dispatchEvent(new Event("load"));