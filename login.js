// JavaScript function to toggle between login and registration forms
function toggleForm() {
    var loginForm = document.getElementById("login-form");
    var registerForm = document.getElementById("register-form");
    var loginToggleBtn = document.getElementById("login-toggle");
    var registerToggleBtn = document.getElementById("register-toggle");
    var feedbackMessageContainer = document.getElementById("feedback-message");

    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        registerToggleBtn.style.display = "inline";
        loginToggleBtn.style.display = "none";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        registerToggleBtn.style.display = "none";
        loginToggleBtn.style.display = "inline";
    }

    if (feedbackMessageContainer) {
        feedbackMessageContainer.textContent = ""; // Clear the text
        feedbackMessageContainer.style.display = "none"; // Hide the container
    }
}

// Initial setup to hide the registration form
window.onload = function() {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").addEventListener("submit", handleLoginSubmit);
    document.getElementById("register-form").addEventListener("submit", handleRegisterSubmit);
};

// Handle login form submission
function handleLoginSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var loginData = {
        email: email,
        password: password
    };

    fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (response.ok) {
            const authToken = response.headers.get("Authorization").split(" ")[1];  // Extract JWT from the Authorization header
            localStorage.setItem("authToken", authToken); // Store the JWT in localStorage or sessionStorage

            return response.json(); // If the response is OK, parse the JSON body
        } else {
            // If the response is not OK (e.g., 401 Unauthorized), parse the JSON body to get the error message
            return response.json().then(err => { throw new Error(err.message); });
        }
    })
    .then(data => {
        console.log("Success:", data);

        // Extract storeId from the response data and store it
        const storeId = data.storeId; // Assuming the backend sends this key; adjust if necessary
        localStorage.setItem("storeId", storeId); // Store storeId for later use
        // Handle success response (e.g., navigating to another page or showing a success message)
        // Clear and hide the error message container upon successful login
        const feedbackMessageContainer = document.getElementById("feedback-message");
        if (feedbackMessageContainer) {
            feedbackMessageContainer.textContent = "Login Successful!"; // Clear the text
            feedbackMessageContainer.style.display = "block"; // Hide the container
            feedbackMessageContainer.style.color = "green";
        }

        // Delay redirection to the dashboard
        setTimeout(() => {
            window.location.href = "index.html"; // Redirect to the dashboard/main page
        }, 2000); // Display the message for 2 seconds
    })
    .catch((error) => {
        console.error("Error:", error);
        // Handle errors here (e.g., showing an error message)
        // Example of displaying the error message in the page
        feedbackMessageContainer = document.getElementById("feedback-message");
        if (feedbackMessageContainer) {
            feedbackMessageContainer.textContent = error.message;
            feedbackMessageContainer.style.display = "block"; // Make sure the container is visible
            feedbackMessageContainer.style.color = "red";
        }
    });
}

// Handle registration form submission
function handleRegisterSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    var firstName = document.getElementById("first-name").value;
    var lastName = document.getElementById("last-name").value;
    var email = document.getElementById("reg-email").value;
    var password = document.getElementById("reg-password").value;

    var registrationData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    };

    fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registrationData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(err => { throw new Error(err.message); });
        }
    })
    .then(data => {
        console.log("Registration Success:", data);
        // Display a success message to the user
        const feedbackMessageContainer = document.getElementById("feedback-message"); // Consider renaming this ID
        if (feedbackMessageContainer) {
            feedbackMessageContainer.textContent = "Registration successful! You can now login."; // Customize this message as needed
            feedbackMessageContainer.style.display = "block";
            feedbackMessageContainer.style.color = "green"; // Change color to indicate success, or use a different styling approach
        }

        setTimeout(() => {
            toggleForm(); // Toggle back to the login form
            feedbackMessageContainer.style.display = "none"; // Optionally hide the message container
        }, 2000); // Display the message for 2 seconds
        
        // Optionally, clear the form or automatically switch to the login form
        // document.getElementById("register-form").reset();
        // toggleForm(); // If you want to automatically switch back to the login form
    })
    .catch((error) => {
        console.error("Registration Error:", error);
        const feedbackMessageContainer = document.getElementById("feedback-message");
        if (feedbackMessageContainer) {
            feedbackMessageContainer.textContent = error.message;
            feedbackMessageContainer.style.display = "block";
            feedbackMessageContainer.style.color = "red"; // Ensure color indicates an error
        }
    });
}
