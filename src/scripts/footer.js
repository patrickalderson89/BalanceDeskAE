document.addEventListener("DOMContentLoaded", async () => {
    // Ensure that the Utils class is defined and visible in the current scope
    if (typeof Utils !== "function") {
        console.error("Utils class is not defined.");
        return;
    }
    Utils.setElementText("footer-cp-year", new Date().getFullYear());
    Utils.setElementText("footer-app-name", await Utils.getAppInfo("name"));
    Utils.setElementText("footer-app-version", await Utils.getAppInfo("version"));
});
