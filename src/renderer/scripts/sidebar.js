document.addEventListener("DOMContentLoaded", async function () {
    // ============================
    // SECTION 1: VARIABLES
    // ============================

    const previousPageInput = document.getElementById("previous-page"); // Input for previous page tracking
    const currentPageInput = document.getElementById("current-page"); // Input for current page tracking
    const sidebar = document.getElementById("sidebar");
    const sidebarToggleBtn = document.getElementById("sidebar-toggle");
    const mainContent = document.getElementById("main-content");
    const footer = document.getElementById("footer");

    // ============================
    // SECTION 2: INITIALIZATION
    // ============================

    // Check if Utils class is defined and set app name in the sidebar
    if (typeof Utils !== "function") {
        console.error("Utils class is not defined.");
        return;
    }
    Utils.setElementText("sidebar-app-name", await Utils.getAppInfo("nicename"));

    // Check if a default page has been set and load it
    if (currentPageInput.value) {
        await onNavigation(currentPageInput.value);
    }

    // ============================
    // SECTION 3: EVENT LISTENERS
    // ============================

    // Add event listener for sidebar toggle button
    sidebarToggleBtn.addEventListener("click", function () {
        toggleSidebarState();
    });

    // Add event listeners for sidebar links to update the input value
    const sidebarLinks = document.querySelectorAll(".sidebar .top-item, .sidebar .nav-item, .sidebar .bottom-item");

    sidebarLinks.forEach(async (link) => {
        link.addEventListener("click", async (event) => {
            event.preventDefault();
            const href = link.getAttribute("href");
            if (href && href !== '#') {
                if (currentPageInput.value !== href) {
                    Utils.setPages(currentPageInput.value, href);
                    await onNavigation(currentPageInput.value);
                }
            }
        });
    });

    // ============================
    // SECTION 4: FUNCTIONS
    // ============================

    /**
     * Toggle the sidebar state (open/closed).
     */
    function toggleSidebarState() {
        sidebar.classList.toggle("sidebar-closed");

        if (sidebar.classList.contains("sidebar-closed")) {
            mainContent.style.marginLeft = "80px"; // Sidebar closed
            footer.style.marginLeft = "80px";
            sidebarToggleBtn.title = "Espandi"; // Tooltip for expand
        } else {
            mainContent.style.marginLeft = "150px"; // Sidebar open
            footer.style.marginLeft = "150px";
            sidebarToggleBtn.title = "Riduci"; // Tooltip for collapse
        }
    }

    /**
     * Handle page switching logic based on the current page URL.
     * @param {string} url - The URL of the new page.
     */
    async function onNavigation(url) {
        if (!url || url === "#") return; // Skip empty or placeholder URLs

        // Compare with previous page to prevent redundant loading
        if (previousPageInput.value === url) {
            console.log("Page is already loaded. Skipping navigation.");
            return;
        }

        // Reset the base tag every time a new page is loaded
        const bases = document.getElementsByTagName("base");
        if (bases.length > 0) {
            bases[0].remove();
        }

        console.log(`Navigating to: ${url}`); // Log the navigation

        const success = await Utils.loadPageHTMLContent(url, "main-content"); // Load the page content

        // Update active item in the sidebar if content is successfully loaded
        if (success) {
            updateActiveItem(url);
        }
    }

    /**
     * Update the active navigation item in the sidebar.
     * @param {string} currentPage - The current active page URL.
     */
    function updateActiveItem(currentPage) {
        const items = document.querySelectorAll(".sidebar .top-item, .sidebar .nav-item, .sidebar .bottom-item");

        items.forEach((item) => {
            const href = item.getAttribute("href");
            if (href === currentPage) {
                item.classList.add("item-active");
            } else {
                item.classList.remove("item-active");
            }
        });
    }
});
