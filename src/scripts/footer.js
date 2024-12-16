// Function to update footer with app name, version, and copyright year
const updateFooterInfo = async () => {
    // Check that the Utils class is defined and visible in the current scope
    if (typeof Utils === "function") {
        Utils.setElementText("footer-cp-year", new Date().getFullYear());
        if (appinfo) {
            Utils.setElementText("footer-app-name", await Utils.getAppInfo("name"));
            Utils.setElementText("footer-app-version", await Utils.getAppInfo("version"));
        } else {
            console.error("Unable to retrieve app info");
        }
    } else {
        console.error("Utils class is not defined.");
    }
};

// Wait for the DOM to be ready and update the footer information
document.addEventListener("DOMContentLoaded", async () => {
    await updateFooterInfo();
});