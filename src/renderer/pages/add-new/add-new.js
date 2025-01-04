/* Ensure that the Utils class is loaded and visible
if (typeof Utils !== "function") {
  throw new Error("Utils class is not defined.");
}*/

// Create Operation
document.getElementById("test-create-btn").addEventListener("click", async () => {
  const entityType = document.getElementById("entityTypeCreate").value;
  const data = {
      name: document.getElementById("nameCreate").value,
      description: document.getElementById("descriptionCreate").value
  };

  try {
      const result = await Utils.createEntity(entityType, data);
      handleResult("Create", entityType, result);
  } catch (error) {
      handleError("Create", entityType, error);
  }
});
