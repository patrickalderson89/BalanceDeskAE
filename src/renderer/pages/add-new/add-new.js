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

function cleanUp(){
  var container = document.getElementById("fields-container");
  var inputFieds = container.querySelectorAll("input");
  var selectFieds = container.querySelectorAll("select")

  inputFieds.forEach(input => {
    input.value = "";
  });

  selectFieds.forEach(select => {
    select.innerHTML = select.options[0].outerHTML;
  });
}

// Show or hide form fields based on selected entity type
async function handleEntityTypeChange() {
  cleanUp()
  const entityType = document.getElementById("entityType").value;
  const fieldsContainer = document.getElementById("fields-container");

  Array.from(fieldsContainer.children).forEach((child) => {
    child.hidden = true;
  });

  if (entityType) {
    document.getElementById(`${entityType}-fields`).hidden = false;
  }

  const container = document.getElementById(`${entityType}-fields`)

  if(entityType !== "category"){
    try {
      const select = container.querySelector("select")
      const result = await Utils.readAllEntities("category");
      handleResult("Read", entityType, result);

      result.forEach((obj) => {
        const option = new Option(obj.name, obj.id);
        select.add(option);
      });

    } catch (error) {
      handleError("Read", entityType, error);
    }
  }
  if(entityType === "income" || entityType === "expense"){
      document.getElementById(`${entityType}-category`).addEventListener("change" , async () => {
        const categorySelectValue = container.querySelectorAll("select")[0].value
        console.log(container.querySelectorAll("select")[0].value)
        const subBudgetSelect = Array.from(container.querySelectorAll("select"))[1];

        try{
        const result = await Utils.readEntity("subBudget", {category_id : `${categorySelectValue}`})
        handleResult("Read", "subBudget", result);

        result.forEach((obj, index) => {
          console.log(obj.name)
          const option = new Option(obj.name, index);
          subBudgetSelect.add(option);
        });

        } catch (error) {
          handleError("Read", "subBudget", error);
        }
      })
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

  const createData = entityDataCreators[entityType];

  if (!createData) {
    handleError("Create", entityType, "Entity type not supported");
    return;
  }

  try {
    const data = createData();
    const result = await Utils.createEntity(entityType, data);
    handleResult("Create", entityType, result);
    if(result){
      resultParagraph.innerText = "Oggetto creato.";
      cleanUp()

      setTimeout(() => {
        resultParagraph.innerText = "";
    }, 2000);
    }else{
      resultParagraph.innerText = "Errore durante la creazione dell'oggetto.";
      setTimeout(() => {
        resultParagraph.innerText = "";
    }, 2000); 
    }
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
