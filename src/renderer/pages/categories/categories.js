var tableBody = document.getElementById("categories-table-body");

document.getElementById("categories-page").addEventListener("load", async () => {
    if (document.getElementById("current-page").value === "categories/categories.html") {
        // Fetch and populate the table
        tableBody.innerHTML = '';
        fetchItems();
    }
});

function createTableRow(category) {
    const row = document.createElement("tr");

    // Assign the category ID to the row using the dataset property
    row.dataset.categoryId = category.id;

    // Add category data to the row
    row.innerHTML = `
        <td>${category.name}</td>
        <td>${category.description}</td>
        <td>${Utils.formatDate(category.created_at)}</td>
        <td>${Utils.formatDate(category.updated_at)}</td>
        <td><span class="details">Apri</span></td>
    `;

    // Append the row to the table
    tableBody.appendChild(row);

    // Add click event listener to the row to show details about the category
    row.querySelector(".details").addEventListener("click", async () => {
        Utils.setCurrentItem("category", row.dataset.categoryId);
        Utils.setPages("categories/categories.html", "category/category.html");
        await Utils.loadPageHTMLContent("../category/category.html");
    });
}

async function fetchItems() {
    const categories = await Utils.readAllEntities("category");

    categories.forEach(category => {
        createTableRow(category);
    });
}

document.getElementById("categories-page").dispatchEvent(new Event("load"));