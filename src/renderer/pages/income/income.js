document.getElementById("income-page").addEventListener("load", function () {
    if (document.getElementById("current-page").value !== "income/income.html") {
        return;
    }

    // Function to handle form submission for updating an income record
    const updateButton = document.getElementById("update-income");
    const deleteButton = document.getElementById("delete");

    const incomeId = Utils.getCurrentItem().id;
    let sbid = null;

    // Simulate an API call to fetch income data by ID
    async function fetchIncomeData(id) {
        const income = await Utils.readEntity("income", { id: incomeId });
        sbid = income[0].sub_budget_id;
        return income[0];
    }

    // Set the form values based on fetched data
    async function populateIncomeForm() {
        const incomeData = await fetchIncomeData(incomeId);

        document.getElementById("income-title").value = incomeData.title;
        document.getElementById("income-description").value = incomeData.description;
        document.getElementById("income-source").value = incomeData.source;
        document.getElementById("income-amount").value = incomeData.amount;
        document.getElementById("income-payment-type").value = incomeData.payment_type;
        document.getElementById("income-transaction-date").value = incomeData.transaction_date;
    }

    // Update the income record
    async function updateIncome() {
        const updatedData = {
            title: document.getElementById("income-title").value,
            description: document.getElementById("income-description").value,
            source: document.getElementById("income-source").value,
            amount: parseFloat(document.getElementById("income-amount").value),
            payment_type: document.getElementById("income-payment-type").value,
            transaction_date: document.getElementById("income-transaction-date").value
        };

        await Utils.updateEntity("income", updatedData, { id: incomeId });
    }

    // Delete the income record
    async function deleteIncome() {
        await Utils.softDeleteEntity("income", { id: incomeId });
        Utils.setPages("income/income.html", "categories/categories.html");
        await Utils.loadPageHTMLContent("../categories/categories.html");
    }

    // Handle form submission (update)
    updateButton.addEventListener("click", function (e) {
        updateIncome();
    });

    // Handle delete button click
    deleteButton.addEventListener("click", function () {
        deleteIncome();
    });

    // Populate the form with existing income data when the page loads
    populateIncomeForm();
});

document.getElementById("income-page").dispatchEvent(new Event("load"));