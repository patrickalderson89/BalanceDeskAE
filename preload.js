// Destructure required Electron APIs
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("components", {
    sidebar: async () => await getSidebar(),
    footer: async () => await getFooter(),
});

const getSidebar = async () => {
    try {
        const response = await fetch("components/sidebar/sidebar.html");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error loading sidebar:", error);
        return "<p>Error loading sidebar.</p>";
    }
};

const getFooter = async () => {
    try {
        const response = await fetch("components/footer/footer.html");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error loading footer:", error);
        return "<p>Error loading footer.</p>";
    }
};
