// Utility to handle operation results
function handleResult(operation, entityType, result) {
  console.log(`Operation: ${operation} | Entity: ${entityType} | Result:`, result);
}

// Utility to handle errors
function handleError(operation, entityType, error) {
  console.error(`Operation: ${operation} | Entity: ${entityType} | Error:`, error);
}

// Update the state of the create button based on form validation
function updateCreateButtonState() {
  const selectedType = document.getElementById("entityType").value;
  const requiredFields = document.querySelectorAll(
    `#${selectedType}-fields input[required], #${selectedType}-fields select[required]`
  );
  const createButton = document.getElementById("create-btn");

  const allFieldsValid = Array.from(requiredFields).every((field) => field.checkValidity());

  createButton.disabled = !allFieldsValid;
}

// Add input animation for form fields
function handleInputAnimation(event) {
  const target = event.target;
  if (target.value) {
    target.classList.add("animation-active");
  } else {
    target.classList.remove("animation-active");
  }
}

// Show or hide form fields based on selected entity type
function handleEntityTypeChange() {
  const entityType = document.getElementById("entityType").value;
  const fieldsContainer = document.getElementById("fields-container");

  Array.from(fieldsContainer.children).forEach((child) => {
    child.hidden = true;
  });

  if (entityType) {
    document.getElementById(`${entityType}-fields`).hidden = false;
  }
}

// Create entity operation
async function handleCreateEntity() {
  const entityType = document.getElementById("entityType").value;
  const resultParagraph = document.getElementById("request-result");

  const entityDataCreators = {
    category: () => ({
      name: document.getElementById("category-name").value,
      description: document.getElementById("category-description").value,
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
      payment_type: document.getElementById("income-payment-type").value,
      transaction_date: document.getElementById("income-transaction-date").value,
    }),
    expense: () => ({
      sub_budget_id: document.getElementById("expense-subbudget-id").value,
      title: document.getElementById("expense-title").value,
      description: document.getElementById("expense-description").value,
      recipient: document.getElementById("expense-recipient").value,
      amount: document.getElementById("expense-amount").value,
      payment_type: document.getElementById("expense-payment-type").value,
      transaction_date: document.getElementById("expense-transaction-date").value,
    }),
  };

  const createData = entityDataCreators[entityType];

  if (!createData) {
    handleError("Create", entityType, "Entity type not supported");
    return;
  }

  try {
    const data = createData();
    const result = await Utils.createEntity(entityType, data);
    handleResult("Create", entityType, result);
    resultParagraph.innerText = result ? "Oggetto creato." : "Errore durante la creazione dell'oggetto.";
  } catch (error) {
    handleError("Create", entityType, error);
  }
}

// Event listeners
function initializeEventListeners() {
  document.getElementById("add-new-page").addEventListener("input", handleInputAnimation);
  document.getElementById("fields-container").addEventListener("input", updateCreateButtonState);
  document.getElementById("entityType").addEventListener("change", handleEntityTypeChange);
  document.getElementById("create-btn").addEventListener("click", handleCreateEntity);
}

// Initialize event listeners
initializeEventListeners();
