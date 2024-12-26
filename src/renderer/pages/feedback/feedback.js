document.getElementById("feedback-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("email").value;
    const subject = encodeURIComponent(document.getElementById("subject").value);
    const body = encodeURIComponent(document.getElementById("body").value);

    const mailtoLink = `mailto:feedback@app.com?subject=${subject}&body=${body}&cc=${email}`;
    window.location.href = mailtoLink;
});
