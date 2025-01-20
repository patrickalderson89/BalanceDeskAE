// ===========================================
// Section: Variables
// ===========================================

var searchInput = document.getElementById("search-input");  // Search input element
var tableBody = document.getElementById("categories-list"); // Table body to populate with categories

// ===========================================
// Section: Functions
// ===========================================

// Fetch categories from the backend API
async function fetchCategories() {
    const categories = await Utils.readAllEntities("category");
    const categoryTotals = await Utils.getCategoryTotals();

    // Map the category totals to the categories array
    const categoriesWithTotals = categories.map(category => {
        const totalData = categoryTotals.find(total => total.category_id === category.id);
        if (totalData) {
            return {
                ...category,
                total_incomes: totalData.total_incomes,
                total_expenses: totalData.total_expenses
            };
        } else {
            return category;
        }
    });

    // Populate the categories table
    populateCategoriesTable(categoriesWithTotals);

    // Update the general balance card with the total information
    updateGeneralBalanceCard(categoriesWithTotals);
}

// Populate the categories table with data
function populateCategoriesTable(categories) {
    // Clear the table before adding new rows
    tableBody.innerHTML = '';

    // Loop through each category and create a new row
    categories.forEach(category => {
        const row = document.createElement("tr");

        // Add category data to the row
        row.innerHTML = `
            <td>${category.name}</td>
            <td>${category.total_incomes}€</td>
            <td>${category.total_expenses}€</td>
            <td>${category.total_incomes - category.total_expenses}€</td>
            <td>${formatDate(category.created_at)}</td>
            <td>${formatDate(category.updated_at)}</td>
        `;

        // Append the row to the table
        tableBody.appendChild(row);
    });
}

// Format the date for display in a user-friendly format (Italian style)
function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("it-IT", options);
}

// Filter rows in the categories table based on the search query
function filterRows(query) {
    const rows = tableBody.getElementsByTagName("tr");
    const regex = new RegExp(query, "i"); // Create a case-insensitive search pattern

    // Loop through all the rows
    for (const row of rows) {
        const name = row.getElementsByTagName("td")[0].textContent;

        // Hide the row if it doesn’t match the search query
        row.style.display = regex.test(name) ? "" : "none";
    }
}

// ===========================================
// Section: Event Listeners
// ===========================================

// Listen for input events on the search field to filter the rows
searchInput.addEventListener("input", function () {
    const query = searchInput.value.trim();  // Get the search query
    if (query) {
        filterRows(query); // Filter rows based on the search query
    } else {
        // Reset the table and show all rows again if the search is cleared
        const rows = tableBody.getElementsByTagName("tr");
        for (const row of rows) {
            row.style.display = ""; // Make all rows visible again
        }
    }
});

document.getElementById("create-entity-btn").addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent the default behavior

    // Find the correct link in the sidebar
    const sidebarLinks = document.querySelectorAll(".sidebar .sidebar-middle .sidebar-nav a");

    sidebarLinks.forEach((link) => {
        // Check if the href attribute matches
        if (link.getAttribute("href") === e.target.getAttribute("href")) {
            link.click(); // Simulate the click event
        }
    });
});

// ===========================================
// Section: Initial Calls
// ===========================================

// Fetch and display categories data immediately if the DOM is ready
fetchCategories();

// Function to update the general balance card
function updateGeneralBalanceCard(categories) {
    const categoriesCount = categories.length;
    let totalIncomes = 0;
    let totalExpenses = 0;

    // Calculate the total incomes, expenses, and balance
    categories.forEach(category => {
        totalIncomes += category.total_incomes || 0;
        totalExpenses += category.total_expenses || 0;
    });

    const totalBalance = totalIncomes - totalExpenses;

    // Update the values in the card
    document.getElementById("categories-count").textContent = `Categorie: ${categoriesCount}`;
    document.getElementById("total-incomes").textContent = `Entrate Totali: €${totalIncomes.toFixed(2)}`;
    document.getElementById("total-expenses").textContent = `Uscite Totali: €${totalExpenses.toFixed(2)}`;
    document.getElementById("total-balance").textContent = `Totale: €${totalBalance.toFixed(2)}`;
}