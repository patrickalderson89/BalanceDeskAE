// Utility to handle operation results
function handleResult(operation, entityType, result) {
  console.log(`Operation: ${operation} | Entity: ${entityType} | Result:`, result);
}

// Utility to handle errors
function handleError(operation, entityType, error) {
  console.error(`Operation: ${operation} | Entity: ${entityType} | Error:`, error);
}



document.getElementById("entityType").addEventListener("change", async () => {
  const entityTypeSelect = document.getElementById("entityType");
  const fieldsContainer = document.getElementById("fields-container");

  Array.from(fieldsContainer.children).forEach((child) => {
    child.classList.add("hidden");
  });

  const selectedType = entityTypeSelect.value;
  if (selectedType) {
    document.getElementById(`${selectedType}-fields`).classList.remove("hidden");
  }
});


// Validation of each input field
document.getElementById("fields-container").addEventListener("input", async () => {
  const selectedType = document.getElementById("entityType").value;
  const createButton = document.getElementById("create-btn");

  const fields = document.querySelectorAll(`#${selectedType}-fields input, #${selectedType}-fields select`);
  const allValid = Array.from(fields).every((field) => field.checkValidity());
  createButton.disabled = !allValid;
});



// Create Operation
document.getElementById("create-btn").addEventListener("click", async () => {
  const entityType = document.getElementById("entityType").value;

  // Map for entity type
  const entityDataCreators = {
    category: () => ({
      name: document.getElementById("category-name").value,
      description: document.getElementById("category-description").value
    }),
    Product: () => ({
      name: document.getElementById("nameCreate").value,
      description: document.getElementById("descriptionCreate").value,
      price: parseFloat(document.getElementById("priceCreate").value),
      stock: parseInt(document.getElementById("stockCreate").value)
    }),
    User: () => ({
      username: document.getElementById("usernameCreate").value,
      email: document.getElementById("emailCreate").value,
      role: document.getElementById("roleCreate").value
    })
  };

  // Mapping the function to create the data object
  const createData = entityDataCreators[entityType];

  if (!createData) {
    handleError("Create", entityType, "entityType not supported")
    return;
  }

  const data = createData();

  try {
    const result = await Utils.createEntity(entityType, data);
    handleResult("Create", entityType, result);
  } catch (error) {
    handleError("Create", entityType, error);
  }
});