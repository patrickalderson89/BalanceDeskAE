document.getElementById("feedback-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const submitButton = document.getElementById("submit-btn");
    const originalText = submitButton.textContent;

    // Replace button text with loading spinner
    submitButton.textContent = "";
    const spinner = document.createElement("div");
    spinner.classList.add("btn-loading-spinner");
    submitButton.appendChild(spinner);

    const subjectInput = document.getElementById("subject");
    const bodyInput = document.getElementById("body");
    const subject = encodeURIComponent(subjectInput.value);
    const body = encodeURIComponent(bodyInput.value);

    // Simulate a short delay
    setTimeout(() => {
        const mailtoLink = `mailto:feedback@app.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;

        if (typeof Utils === "function") {
            Utils.loadPageHTMLContent("../dashboard/dashboard.html", "main-content");
            return;
        } else {
            // Reset the form and button
            subjectInput.value = '';
            bodyInput.value = '';
            submitButton.textContent = originalText;
        }
    }, 3000); // Adjust the delay as needed
});
