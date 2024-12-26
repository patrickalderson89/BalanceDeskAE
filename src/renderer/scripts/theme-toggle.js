document.addEventListener("DOMContentLoaded", function () {
    // Detect the preferred color scheme
    const prefersColorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Print the current color scheme preference
    if (prefersColorSchemeMediaQuery.matches) {
        console.log("Preferred color scheme: Dark");
    } else {
        console.log("Preferred color scheme: Light");
    }

    // Add an event listener to track changes to the color scheme preference
    prefersColorSchemeMediaQuery.addEventListener("change", (e) => {
        if (e.matches) {
            console.log("Preferred color scheme changed to Dark");
        } else {
            console.log("Preferred color scheme changed to Light");
        }
    });
});