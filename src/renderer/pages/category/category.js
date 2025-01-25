var currentItem = Utils.getCurrentItem();
var nameField = document.getElementById("category-name");
var descriptionField = document.getElementById("category-description");
var updateBtn = document.getElementById("update-category");
var deleteBtn = document.getElementById("delete");
var resultMessage = document.getElementById("result-message");
var resultDiv = document.getElementById("update-result");
var categoryUpdatedAt = document.getElementById("category-updated-at");

async function getCategoryData() {
    const result = await Utils.readEntity(currentItem.type, { ID: currentItem.id });
    return result[0];
}

function displayCategoryData(category) {
    nameField.value = category.name;
    descriptionField.value = category.description;
    document.getElementById("category-created-at").textContent = Utils.formatDate(category.created_at);
    categoryUpdatedAt.textContent = Utils.formatDate(category.updated_at);
}

function toggleUpdateButton() {
    updateBtn.disabled = !(nameField.checkValidity() && descriptionField.checkValidity());
}

async function updateCategory() {
    const updatedCategory = {
        name: nameField.value,
        description: descriptionField.value,
        updated_at: new Date(),
    };

    try {
        const result = await Utils.updateEntity(currentItem.type, updatedCategory, { id: currentItem.id });

        if (result) {
            displaySuccessMessage();
            const updatedItem = await Utils.readEntity(currentItem.type, { id: currentItem.id }, ["updated_at"]);
            categoryUpdatedAt.textContent = Utils.formatDate(updatedItem[0].updated_at);
            updateBtn.disabled = true;
        } else {
            throw new Error("Failed to update category");
        }
    } catch (error) {
        displayErrorMessage();
    } finally {
        // Clear result message after 5 seconds
        setTimeout(clearResultMessage, 5000);
    }
}

function displaySuccessMessage() {
    resultMessage.textContent = "Categoria aggiornata con successo!";
    resultDiv.style.display = "block";
}

function displayErrorMessage() {
    resultMessage.textContent = "Errore durante l'aggiornamento della categoria.";
    resultDiv.style.display = "block";
}

function clearResultMessage() {
    resultDiv.style.display = "none";
    resultMessage.textContent = "";
}

nameField.addEventListener("change", toggleUpdateButton);
descriptionField.addEventListener("change", toggleUpdateButton);

document.getElementById("category-page").addEventListener("load", async () => {
    if (document.getElementById("current-page").value === "category/category.html") {

        const category = await getCategoryData();
        tableBody.innerHTML = '';
        displayCategoryData(category);

        updateBtn.addEventListener("click", updateCategory);

        document.getElementById("view-sub-budgets").addEventListener("click", async () => {
            Utils.setPages("category/category.html", "sub-budgets/sub-budgets.html");
            await Utils.loadPageHTMLContent("../sub-budgets/sub-budgets.html");
        });

        // Add event listener for button click
        deleteBtn.addEventListener("click", async () => {
            const ci = Utils.getCurrentItem();
            const deleted = await Utils.softDeleteEntity(ci.type, { id: ci.id });
            if (deleted) {
                Utils.setPages("category/category.html", "categories/categories.html");
                await Utils.loadPageHTMLContent("../categories/categories.html");
            }
        });
    }

});

document.getElementById("category-page").dispatchEvent(new Event("load"));