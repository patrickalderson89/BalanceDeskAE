document.addEventListener("DOMContentLoaded", async () => {
    // Ensure that the Utils class is defined and visible in the current scope
    if (typeof Utils === "function") {
        Utils.setElementText("footer-cp-year", new Date().getFullYear());

        // Check if appinfo is available and retrieve app details
        if (appinfo) {
            Utils.setElementText("footer-app-name", await Utils.getAppInfo("name"));
            Utils.setElementText("footer-app-version", await Utils.getAppInfo("version"));
        } else {
            console.error("Unable to retrieve app info");
        }
    } else {
        console.error("Utils class is not defined.");
    }
});
