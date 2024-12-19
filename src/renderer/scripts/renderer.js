document.addEventListener("DOMContentLoaded", async function () {
    if (typeof Utils !== "function") {
        console.error("Utils class is not defined.");
        return;
    }

    // Retrieve the default page url or try navigating to the first available page in the sidebar
    const { urls } = window; // urls is exposed through contextBridge
    const defaultPage = urls && urls.defaultPage
        ? await urls.defaultPage
        : document.querySelectorAll(".sidebar .nav-item").item(0)?.getAttribute("href") || null;

    if (!defaultPage) {
        console.error("No default page found.");
        return;
    }

    let currentPage = document.getElementById("current-page");
    if (currentPage instanceof HTMLElement) {
        currentPage.value = defaultPage;
    } else {
        console.error(`Unable to set default page to ${defaultPage}.`);
    }
});
