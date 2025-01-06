// Utility to handle operation results
function handleResult(operation, entityType, result) {
  console.log(`Operation: ${operation} | Entity: ${entityType} | Result:`, result);
}

// Utility to handle errors
function handleError(operation, entityType, error) {
  console.error(`Operation: ${operation} | Entity: ${entityType} | Error:`, error);
}

// Validation of each input field
function updateCreateButtonState() {
  const selectedType = document.getElementById("entityType").value;
  const fields = document.querySelectorAll(`#${selectedType}-fields input[required], #${selectedType}-fields select[required]`);
  const createButton = document.getElementById("create-btn");

  // Verify if all the input fields are valid
  const allValid = Array.from(fields).every((field) => field.checkValidity());

  // Lock of unlock the submit button
  createButton.disabled = !allValid;
  allValid ? createButton.classList.remove("disabled") : createButton.className = "disabled"
}



// Real time input fields validation
document.getElementById("fields-container").addEventListener("input", async () => {
  updateCreateButtonState();
});



// Hide/Unhide usefull/unusefull forms
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



// Create Operation
document.getElementById("create-btn").addEventListener("click", async () => {
  const entityType = document.getElementById("entityType").value
  const resultParagraph = document.getElementById("request-result")

  console.log("entityType changed in : " + entityType)

  // Map for entity type
  const entityDataCreators = {
    category: () => ({
      name: document.getElementById("category-name").value,
      description: document.getElementById("category-description").value
    }),
    subBudget: () => ({
      category_id: document.getElementById("subBudget-category-id").value,
      name: document.getElementById("subBudget-name").value,
      description: document.getElementById("subBudget-description").value,
    }),
    income: () => ({
      sub_budget_id: document.getElementById("income-subbudget-id").value,
      title: document.getElementById("income-title").value,
      description: document.getElementById("income-description").value,
      source: document.getElementById("income-source").value,
      amount: document.getElementById("income-amount").value,
      payment_type: document.getElementById("income-payment-type").value
    }),
    expense: () => ({
      sub_budget_id: document.getElementById("expense-subbudget-id").value,
      title: document.getElementById("expense-title").value,
      description: document.getElementById("expense-description").value,
      recipient: document.getElementById("expense-recipient").value,
      amount: document.getElementById("expense-amount").value,
      payment_type: document.getElementById("expense-payment-type").value
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
    result ? resultParagraph.innerHTML = "oggetto creato" : resultParagraph.innerHTML = "c'è stato un problema con la creazione dell'oggetto, riprova"
  } catch (error) {
    handleError("Create", entityType, error);
  }
});