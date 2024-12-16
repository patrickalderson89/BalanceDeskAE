document.getElementById("sidebar-toggle").addEventListener("click", function () {
    var sidebar = document.getElementById("sidebar");
    var sidebarToggleBtn = document.getElementById("sidebar-toggle");
    var mainContent = document.getElementById("main-content");

    // Toggle the sidebar closed/open state
    sidebar.classList.toggle("sidebar-closed");

    // Adjust main content margin when the sidebar is closed
    if (sidebar.classList.contains("sidebar-closed")) {
        mainContent.style.marginLeft = "80px";  // Sidebar is closed
        sidebarToggleBtn.title = "Espandi";
    } else {
        mainContent.style.marginLeft = "150px";  // Sidebar is open
        sidebarToggleBtn.title = "Riduci";
    }

    // Select all sidebar links
    const sidebarLinks = document.querySelectorAll(".sidebar .nav-item a");

    // Loop through each link and add a click event listener
    sidebarLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();  // Prevent the default navigation

            const href = event.target.getAttribute("href");  // Get the href attribute of the clicked link
            console.log("Clicked link's href:", href);  // Log the href for debugging

            // TODO: fetch the content of the new page and show it on the main-content
        });
    });
});
