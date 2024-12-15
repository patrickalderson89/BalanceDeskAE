// Fetch sidebar content
window.components.sidebar().then(content => {
    document.getElementById("sidebar-container").innerHTML = content;
});

// Fetch footer content
window.components.footer().then(content => {
    document.getElementById("footer-container").innerHTML = content;
});
