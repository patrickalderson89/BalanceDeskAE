document.addEventListener("DOMContentLoaded", async function () {
    // Sidebar toggle functionality
    const sidebar = document.getElementById("sidebar");
    const sidebarToggleBtn = document.getElementById("sidebar-toggle");
    const mainContent = document.getElementById("main-content");

    var currentPage = null;

    // Set the name for the app in the sidebar
    if (typeof Utils !== "function") {
        console.error("Utils class is not defined.");
        return;
    }
    Utils.setElementText("sidebar-app-name", await appinfo.name());

    // Sidebar toggle button
    sidebarToggleBtn.addEventListener("click", function () {
        // Toggle the sidebar state
        sidebar.classList.toggle("sidebar-closed");

        // Update main-content margin and button title
        if (sidebar.classList.contains("sidebar-closed")) {
            mainContent.style.marginLeft = "80px"; // Sidebar closed
            sidebarToggleBtn.title = "Espandi";
        } else {
            mainContent.style.marginLeft = "150px"; // Sidebar open
            sidebarToggleBtn.title = "Riduci";
        }
    });

    // Sidebar navigation link handling
    const sidebarLinks = document.querySelectorAll(".sidebar .top-item, .sidebar .nav-item, .sidebar .bottom-item");

    sidebarLinks.forEach((link) => {
        link.addEventListener("click", async (event) => {
            if (link.classList.contains("outlink")) {
                return; // Early exit if the link points to an outside resource
            }

            event.preventDefault(); // Prevent default navigation

            const href = link.getAttribute("href");
            if (href) {
                if (currentPage !== href) {
                    // Reset the base tag every time a new page is loaded
                    const bases = document.getElementsByTagName("base");
                    if (bases.length > 0) {
                        bases[0].remove();
                    }
                    console.log(`Clicked link's href: ${href}.`); // Log the link's href
                    const success = await Utils.loadPageHTMLContent(href, "main-content"); // Use await to ensure content is loaded before proceeding

                    // Update the sidebar UI only if the fetch succeeded
                    if (success) {
                        currentPage = href;
                        updateActiveItem();
                    }
                }
            } else {
                console.error("No href found on the closest <a> element.");
            }
        });
    });

    // Function to update the active item in the sidebar
    function updateActiveItem() {
        const items = document.querySelectorAll(".sidebar .top-item, .sidebar .nav-item, .sidebar .bottom-item");

        items.forEach((item) => {
            const href = item.getAttribute("href");
            if (item.classList.contains("item-active") && href !== currentPage) {
                item.classList.remove("item-active");
            } else if (href === currentPage) {
                item.classList.add("item-active");
            }
        });
    }
});
