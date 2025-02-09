var currentItem = Utils.getCurrentItem();
var nameField = document.getElementById("sub-budget-name");
var descriptionField = document.getElementById("sub-budget-description");
var totalIncomesField = document.getElementById("sub-budget-total-incomes");
var totalExpensesField = document.getElementById("sub-budget-total-expenses");
var totalField = document.getElementById("sub-budget-total");
var categoryField = document.getElementById("sub-budget-category");
var updateBtn = document.getElementById("update-sub-budget");
var deleteBtn = document.getElementById("delete");
var resultMessage = document.getElementById("result-message");
var resultDiv = document.getElementById("update-result");
var subBudgetUpdatedAt = document.getElementById("sub-budget-updated-at");
var tableBodyIncomes = document.getElementById("sub-budget-incomes-table-body");
var tableBodyExpenses = document.getElementById("sub-budget-expenses-table-body");

async function getSubBudgetData() {
    const result = await Utils.readEntity(currentItem.type, { ID: currentItem.id });
    const sb = result[0];
    const category = await Utils.readEntity("category", { id: sb.category_id }, ["name"]);
    const totals = await Utils.getSubBudgetTotals(sb.id);

    sb.total_incomes = totals.total_incomes;
    sb.total_expenses = totals.total_expenses;
    sb.category_name = category[0].name;
    return sb;
}

async function getIncomesExpenses(sbId) {
    try {
        const incomes = await Utils.readEntity("income", { sub_budget_id: sbId }, ['*'], false, "transaction_date", "ASC");
        const expenses = await Utils.readEntity("expense", { sub_budget_id: sbId }, ['*'], false, "transaction_date", "ASC");

        return [incomes, expenses];
    } catch {
        console.error("Unable to retrieve incomes and expenses");
        return [[], []];
    }
}

function displaysubBudgetData(subBudget) {
    nameField.value = subBudget.name;
    descriptionField.value = subBudget.description;
    totalIncomesField.textContent = subBudget.total_incomes + '€';
    totalExpensesField.textContent = subBudget.total_expenses + '€';
    totalField.textContent = subBudget.total_incomes - subBudget.total_expenses + '€';
    categoryField.textContent = subBudget.category_name;
    document.getElementById("sub-budget-created-at").textContent = Utils.formatDate(subBudget.created_at);
    subBudgetUpdatedAt.textContent = Utils.formatDate(subBudget.updated_at);
}

function displayIncomesExpenses(incomes, expenses) {
    incomes.forEach(income => {
        const row = document.createElement("tr");

        // Assign the income ID to the row using the dataset property
        row.dataset.incomeId = income.id;

        // Add subBudget data to the row
        row.innerHTML = `
            <td>${income.title}</td>
            <td>${income.description}</td>
            <td>${income.source}</td>
            <td>${income.amount}€</td>
            <td>${income.payment_type === "cash" ? "contanti" : "carta"}</td>
            <td>${Utils.formatDate(income.transaction_date)}</td>
            <td><span class="details">Apri</span></td>
        `;

        // Append the row to the table
        tableBodyIncomes.appendChild(row);

        // Add click event listener to the row to show details about the income
        row.querySelector(".details").addEventListener("click", async () => {
            Utils.setCurrentItem("income", row.dataset.incomeId);
            Utils.setPages("sub-budget/sub-budget.html", "income/income.html");
            await Utils.loadPageHTMLContent("../income/income.html");
        });
    });

    expenses.forEach(expense => {
        const row = document.createElement("tr");

        // Assign the expense ID to the row using the dataset property
        row.dataset.expenseId = expense.id;

        // Add subBudget data to the row
        row.innerHTML = `
            <td>${expense.title}</td>
            <td>${expense.description}</td>
            <td>${expense.recipient}</td>
            <td>${expense.amount}€</td>
            <td>${expense.payment_type === "cash" ? "contanti" : "carta"}</td>
            <td>${Utils.formatDate(expense.transaction_date)}</td>
            <td><span class="details">Apri</span></td>
        `;

        // Append the row to the table
        tableBodyExpenses.appendChild(row);

        // Add click event listener to the row to show details about the expense
        row.querySelector(".details").addEventListener("click", async () => {
            Utils.setCurrentItem("expense", row.dataset.expenseId);
            Utils.setPages("sub-budget/sub-budget.html", "expense/expense.html");
            await Utils.loadPageHTMLContent("../expense/expense.html");
        });
    });
}

function toggleUpdateButton() {
    updateBtn.disabled = !(nameField.checkValidity() && descriptionField.checkValidity());
}

async function updatesubBudget() {
    const updatedsubBudget = {
        name: nameField.value,
        description: descriptionField.value,
        updated_at: new Date(),
    };

    try {
        const result = await Utils.updateEntity(currentItem.type, updatedsubBudget, { id: currentItem.id });

        if (result) {
            displaySuccessMessage();
            const updatedItem = await Utils.readEntity(currentItem.type, { id: currentItem.id }, ["updated_at"]);
            subBudgetUpdatedAt.textContent = Utils.formatDate(updatedItem[0].updated_at);
            updateBtn.disabled = true;
        } else {
            throw new Error("Failed to update subBudget");
        }
    } catch (error) {
        displayErrorMessage();
    } finally {
        // Clear result message after 5 seconds
        setTimeout(clearResultMessage, 5000);
    }
}

function displaySuccessMessage() {
    resultMessage.textContent = "Sotto bilancio aggiornato con successo!";
    resultDiv.style.display = "block";
}

function displayErrorMessage() {
    resultMessage.textContent = "Errore durante l'aggiornamento del sotto bilancio.";
    resultDiv.style.display = "block";
}

function clearResultMessage() {
    resultDiv.style.display = "none";
    resultMessage.textContent = "";
}

nameField.addEventListener("change", toggleUpdateButton);
descriptionField.addEventListener("change", toggleUpdateButton);

document.getElementById("sub-budget-page").addEventListener("load", async () => {
    if (document.getElementById("current-page").value === "sub-budget/sub-budget.html") {

        const subBudget = await getSubBudgetData();
        displaysubBudgetData(subBudget);

        tableBodyIncomes.innerHTML = '';
        tableBodyExpenses.innerHTML = '';
        const [incomes, expenses] = await getIncomesExpenses(subBudget.id);
        displayIncomesExpenses(incomes, expenses);

        updateBtn.addEventListener("click", updatesubBudget);

        // Add event listener for button click
        deleteBtn.addEventListener("click", async () => {
            const ci = Utils.getCurrentItem();
            const deleted = await Utils.softDeleteEntity(ci.type, { id: ci.id });
            if (deleted) {
                Utils.setPages("sub-budget/sub-budget.html", "sub-budgets/sub-budgets.html");
                await Utils.loadPageHTMLContent("../sub-budgets/sub-budgets.html");
            }
        });
    }

});

document.getElementById("sub-budget-page").dispatchEvent(new Event("load"));