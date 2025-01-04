// Ensure that the Utils class is loaded and visible
if (typeof Utils !== "function") {
  throw new Error("Utils class is not defined.");
}

// Utility to handle operation results
function handleResult(operation, entityType, result) {
  console.log(`Operation: ${operation} | Entity: ${entityType} | Result:`, result);
}

// Utility to handle errors
function handleError(operation, entityType, error) {
  console.error(`Operation: ${operation} | Entity: ${entityType} | Error:`, error);
}

// Mapping for entity type
const entityDataCreators = {
  category: () => ({
    name: document.getElementById("nameCreate").value,
    description: document.getElementById("descriptionCreate").value
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

// Create Operation
document.getElementById("test-create-btn").addEventListener("click", async () => {
  const entityType = document.getElementById("entityTypeCreate").value;
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
