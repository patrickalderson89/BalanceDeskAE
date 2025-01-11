// Utility to handle operation results
function logOperationResult(operation, entityType, result) {
  console.log(`Operation: ${operation} | Entity: ${entityType} | Result:`, result);
}

// Utility to handle errors
function logOperationError(operation, entityType, error) {
  console.error(`Operation: ${operation} | Entity: ${entityType} | Error:`, error);
}

// Clear all form fields in a specified container
function clearFormFields(containerId) {
  const container = document.getElementById(containerId);
  container.querySelectorAll("input, select").forEach((element) => {
    element.value = "";
  });
}

// Enable or disable the create button based on form validity
function toggleCreateButtonState(isEnabled) {
  document.getElementById("create-btn").disabled = !isEnabled;
}

// Add animation class on field value change
function toggleInputAnimation(event) {
  event.target.classList.toggle("animation-active", event.target.value);
}

// Handle entity type change and update the form accordingly
async function onEntityTypeChange() {
  const entityType = document.getElementById("entityType").value;
  const fieldsContainer = document.getElementById("fields-container");

  // Hide all field sets initially
  Array.from(fieldsContainer.children).forEach((child) => {
    child.hidden = true;
  });

  // Show the relevant fields for the selected entity type
  const selectedFieldsContainer = document.getElementById(`${entityType}-fields`);
  if (entityType) {
    selectedFieldsContainer.hidden = false;
  }

  // Populate category select if entity type is not "category"
  if (entityType !== "category") {
    await populateCategorySelect(selectedFieldsContainer);
  }

  // Set up dynamic subBudget selection for income and expense
  if (["income", "expense"].includes(entityType)) {
    setUpSubBudgetSelect(selectedFieldsContainer);
  }
}

// Populate the category select dropdown
async function populateCategorySelect(container) {
  const select = container.querySelector("select");
  try {
    const categories = await Utils.readAllEntities("category");
    logOperationResult("Read", "category", categories);

    categories.forEach((category) => {
      const option = new Option(category.name, category.id);
      select.add(option);
    });
  } catch (error) {
    logOperationError("Read", "category", error);
  }
}

// Set up subBudget select for income and expense entities
function setUpSubBudgetSelect(container) {
  const subBudgetSelect = container.querySelectorAll("select")[1];
  container.querySelector("select").addEventListener("change", async (event) => {
    const categoryId = event.target.value;

    try {
      const subBudgets = await Utils.readEntity("subBudget", { category_id: categoryId });
      logOperationResult("Read", "subBudget", subBudgets);

      // Clear existing options
      subBudgetSelect.innerHTML = "<option value='' disabled selected>Seleziona Sotto bilancio</option>";

      // Populate new options
      subBudgets.forEach((subBudget) => {
        const option = new Option(subBudget.name, subBudget.id);
        subBudgetSelect.add(option);
      });
    } catch (error) {
      logOperationError("Read", "subBudget", error);
    }
  });
}

// Create entity based on selected type and form data
async function onCreateEntity() {
  const entityType = document.getElementById("entityType").value;
  const resultParagraph = document.getElementById("request-result");

  const entityData = getEntityData(entityType);
  if (!entityData) return;

  try {
    const result = await Utils.createEntity(entityType, entityData);
    logOperationResult("Create", entityType, result);

    resultParagraph.innerText = result ? "Creazione avvenuta con successo." : "Errore durante la creazione.";
    clearFormFields("fields-container");

    setTimeout(() => {
      resultParagraph.innerText = "";
    }, 2000);
  } catch (error) {
    logOperationError("Create", entityType, error);
  }
}

// Map entity type to corresponding form data
function getEntityData(entityType) {
  const dataCreators = {
    category: () => ({
      name: document.getElementById("category-name").value,
      description: document.getElementById("category-description").value,
    }),
    subBudget: () => ({
      category_id: document.getElementById("subBudget-category").value,
      name: document.getElementById("subBudget-name").value,
      description: document.getElementById("subBudget-description").value,
    }),
    income: () => ({
      sub_budget_id: document.getElementById("income-subBudget").value,
      title: document.getElementById("income-title").value,
      description: document.getElementById("income-description").value,
      source: document.getElementById("income-source").value,
      amount: document.getElementById("income-amount").value,
      payment_type: document.getElementById("income-payment-type").value,
      transaction_date: document.getElementById("income-transaction-date").value,
    }),
    expense: () => ({
      sub_budget_id: document.getElementById("expense-subBudget").value,
      title: document.getElementById("expense-title").value,
      description: document.getElementById("expense-description").value,
      recipient: document.getElementById("expense-recipient").value,
      amount: document.getElementById("expense-amount").value,
      payment_type: document.getElementById("expense-payment-type").value,
      transaction_date: document.getElementById("expense-transaction-date").value,
    }),
  };

  return dataCreators[entityType]?.();
}

// Update create button state based on field validation
function updateCreateButtonState() {
  const selectedType = document.getElementById("entityType").value;
  const requiredFields = document.querySelectorAll(`#${selectedType}-fields input[required], #${selectedType}-fields select[required]`);
  const allFieldsValid = Array.from(requiredFields).every((field) => field.checkValidity());

  toggleCreateButtonState(allFieldsValid);
}

// Initialize event listeners
function initializeEventListeners() {
  document.getElementById("add-new-page").addEventListener("input", toggleInputAnimation);
  document.getElementById("fields-container").addEventListener("input", updateCreateButtonState);
  document.getElementById("entityType").addEventListener("change", onEntityTypeChange);
  document.getElementById("create-btn").addEventListener("click", onCreateEntity);
}

// Initialize event listeners on page load
initializeEventListeners();