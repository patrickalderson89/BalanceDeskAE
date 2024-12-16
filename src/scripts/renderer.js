document.addEventListener("DOMContentLoaded", async function () {
    if (typeof Utils !== "function") {
        console.error("Utils class is not defined.");
        return;
    }

    // Retrieve the default page url or try navigating to the first available page in the sidebar
    const defaultPage = urls && urls.defaultPage
        ? await urls.defaultPage
        : document.querySelectorAll(".sidebar .nav-item").item(0)?.getAttribute("href") || null;

    if (!defaultPage) {
        console.error("No default page found.");
        return;
    }

    const defaultPageLoaded = await Utils.loadPageHTMLContent(defaultPage, "main-content");
    if (!defaultPageLoaded) {
        console.error(`Unable to load default page: ${defaultPage}.`);
    }
});
