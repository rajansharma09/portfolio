emailjs.init("YOUR_PUBLIC_KEY");

const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const message = document.getElementById("message").value.trim();

    // Email validation

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

        alert("Please enter a valid email.");

        return;

    }

    if (message.length < 10) {

        alert("Message should be at least 10 characters.");

        return;

    }

    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {

        from_name: name,

        from_email: email,

        message: message

    }).then(function () {

        alert("Message sent successfully!");

        form.reset();

    }).catch(function (error) {

        alert("Failed to send message.");

        console.log(error);

    });

});