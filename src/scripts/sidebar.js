document.addEventListener("DOMContentLoaded", async function () {
    // Sidebar toggle functionality
    const sidebar = document.getElementById("sidebar");
    const sidebarToggleBtn = document.getElementById("sidebar-toggle");
    const mainContent = document.getElementById("main-content");

    var currentPage = null;

    // Set the name for the app in the sidebar
    if (typeof Utils === "function") {
        if (appinfo) {
            Utils.setElementText("sidebar-app-name", await appinfo.name());
        } else {
            console.error("Unable to retrieve app info");
        }
    } else {
        console.error("Utils class is not defined.");
    }

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
                    console.log("Clicked link's href:", href); // Log the link's href
                    await loadHTMLContent(href, "main-content"); // Use await to ensure content is loaded before proceeding
                    console.log(currentPage);

                    // Update the sidebar UI only if the fetch succeeded
                    if (currentPage === href) {
                        updateActiveItem();
                    }
                }
            } else {
                console.error("No href found on the closest <a> element.");
            }
        });
    });

    // Function to load HTML content dynamically
    async function loadHTMLContent(url, containerId) {
        try {
            const response = await fetch(url);
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

            currentPage = url; // Update the current page URL
        } catch (error) {
            console.error("Error loading content:", error);
        }
    }

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
