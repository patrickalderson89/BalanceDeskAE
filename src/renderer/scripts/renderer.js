document.addEventListener("DOMContentLoaded", async function () {
    if (typeof Utils !== "function") {
        console.error("Utils class is not defined.");
        return;
    }

    let currentPage = document.getElementById("current-page");
    if (currentPage instanceof HTMLElement) {
        currentPage.value = "dashboard/dashboard.html";
    } else {
        console.error(`Unable to set default page to ${defaultPage}.`);
    }
});
