document.addEventListener("DOMContentLoaded", function () {
    if (typeof Utils !== "function") {
        console.error("Utils class is not defined.");
        return;
    }

    // Set default page for a specific element
    let currentPage = document.getElementById("current-page");
    if (currentPage instanceof HTMLElement) {
        currentPage.value = "dashboard/dashboard.html";
    } else {
        console.error("Unable to set default page.");
    }
});