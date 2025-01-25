document.getElementById("expense-page").addEventListener("load", function () {
    if (document.getElementById("current-page").value !== "expense/expense.html") {
        return;
    }

    // Function to handle form submission for updating an expense record
    const updateButton = document.getElementById("update-expense");
    const deleteButton = document.getElementById("delete");

    const expenseId = Utils.getCurrentItem().id;
    let sbid = null;

    // Simulate an API call to fetch expense data by ID
    async function fetchExpenseData(id) {
        const expense = await Utils.readEntity("expense", { id: expenseId });
        sbid = expense[0].sub_budget_id;
        return expense[0];
    }

    // Set the form values based on fetched data
    async function populateExpenseForm() {
        const expenseData = await fetchExpenseData(expenseId);

        document.getElementById("expense-title").value = expenseData.title;
        document.getElementById("expense-description").value = expenseData.description;
        document.getElementById("expense-recipient").value = expenseData.recipient;
        document.getElementById("expense-amount").value = expenseData.amount;
        document.getElementById("expense-payment-type").value = expenseData.payment_type;
        document.getElementById("expense-transaction-date").value = expenseData.transaction_date;
    }

    // Update the expense record
    async function updateExpense() {
        const updatedData = {
            title: document.getElementById("expense-title").value,
            description: document.getElementById("expense-description").value,
            recipient: document.getElementById("expense-recipient").value,
            amount: parseFloat(document.getElementById("expense-amount").value),
            payment_type: document.getElementById("expense-payment-type").value,
            transaction_date: document.getElementById("expense-transaction-date").value
        };

        await Utils.updateEntity("expense", updatedData, { id: expenseId });
    }

    // Delete the expense record
    async function deleteExpense() {
        await Utils.softDeleteEntity("expense", { id: expenseId });
        Utils.setPages("income/income.html", "categories/categories.html");
        await Utils.loadPageHTMLContent("../categories/categories.html");
    }

    // Handle form submission (update)
    updateButton.addEventListener("click", function (e) {
        updateExpense();
    });

    // Handle delete button click
    deleteButton.addEventListener("click", function () {
        deleteExpense();
    });

    // Populate the form with existing expense data when the page loads
    populateExpenseForm();
});

document.getElementById("expense-page").dispatchEvent(new Event("load"));