class Utils {
    // Static method to set the text content of an element by ID
    static setElementText(elementId, text) {
        const el = document.getElementById(elementId);
        if (el instanceof HTMLElement) {
            el.innerText = text;
        } else {
            console.error(`Unable to set text for element with ID: ${elementId}.`);
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
                return await appinfo?.name() || "";
            } else if (type === "nicename") {
                return await appinfo?.nicename() || "";
            } else if (type === "version") {
                return await appinfo?.version() || "";
            } else {
                console.warn("Invalid app info type.");
                return "";
            }
        } catch (error) {
            console.warn(`Error fetching app info ${error}.`);
            return "";
        }
    }

    // Function to load HTML content dynamically
    static async loadPageHTMLContent(pageUrl, containerId) {
        let success = false;
        try {
            const response = await fetch(pageUrl);
            const html = await response.text();

            const container = document.getElementById(containerId);
            container.innerHTML = html;

            // Locate the dynamically loaded page container
            let pageContainer = container.querySelector("div[id$='-page']");
            if (!pageContainer) {
                console.warn("No valid page container found in the loaded content. Falling back to default container.");
                pageContainer = container;
            }

            // Re-execute scripts within the loaded content
            container.querySelectorAll("script").forEach((oldScript) => {
                const newScript = document.createElement("script");
                newScript.src = oldScript.src || ""; // Handle external scripts
                newScript.textContent = oldScript.textContent; // Handle inline scripts
                newScript.async = oldScript.async; // Preserve async attribute

                // Append the new script inside the specific page container
                pageContainer.appendChild(newScript);
                oldScript.remove();
            });

            success = true;
        } catch (error) {
            console.error(`Error loading content ${error}.`);
        }

        return success;
    }
}
