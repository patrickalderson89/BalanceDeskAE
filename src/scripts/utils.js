class Utils {
    // Static method to set the text content of an element by ID
    static setElementText(elementId, text) {
        const el = document.getElementById(elementId);
        if (el instanceof HTMLElement) {
            el.innerText = text;
        } else {
            console.error(`Unable to set text for element with ID: ${elementId}`);
        }
    }

    static async getAppInfo(type) {
        const { appinfo } = window;  // appinfo is exposed through contextBridge

        if (!appinfo) {
            console.warn("appinfo is not available.");
            return "";
        }

        try {
            if (type === "name") {
                return await appinfo.name();
            } else if (type === "version") {
                return await appinfo.version();
            } else {
                console.warn("Invalid app info type");
                return "";
            }
        } catch (error) {
            console.warn("Error fetching app info:", error);
            return "";
        }
    }

}
