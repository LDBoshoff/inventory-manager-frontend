document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm"); // login form
    const registerForm = document.getElementById("registerForm"); // register form

    const loginToggleText = document.getElementById("loginToggleText"); 
    const registerToggleText = document.getElementById("registerToggleText"); 
    
    const showRegisterForm = document.getElementById("showRegisterForm"); // switch to register form
    const showLoginForm = document.getElementById("showLoginForm"); // switch to login form

        // Show the login form and hide the register form
    showLoginForm.addEventListener("click", function () {
        loginForm.style.display = "block";
        loginToggleText.style.display = "block";
        
        registerForm.style.display = "none";
        registerToggleText.style.display = "none";
    });

        // Show the register form and hide the login form
    showRegisterForm.addEventListener("click", function () {
        loginForm.style.display = "none";
        loginToggleText.style.display = "none";
        
        registerForm.style.display = "block";
        registerToggleText.style.display = "block";
    });
    
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        
        const formData = new FormData(loginForm);
    
        // Create an object with the form data
        const loginData = {};
        formData.forEach((value, key) => {
            loginData[key] = value;
        });
    
        // Send a POST request to your server
        fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        })
        .then((response) => {
            if (response.status === 200) {
                // return response.json();
                return response.text();
            } else if (response.status === 401) {
                // Unauthorized, handle incorrect credentials
                console.log("Login failed: Unauthorized");
                console.log(response.text());

                throw new Error("Unauthorized");
            } else {
                // Handle other status codes (e.g., 500 for server error)
                console.log("Login failed: Server error");
                console.log(response.text());
                throw new Error("Server error");
            }
        })
        .then((data) => {
            console.log("Message received from backend:", data.message);
            console.log("Token received from backend:", data.token);
        
            // Store the token in local storage
            localStorage.setItem("token", data.token);
        
            // Redirect to the user dashboard or perform other actions
            window.location.href = "index.html"; // Uncomment this line when you want to redirect
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    });
    

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData(registerForm);

        // Create an object with the form data
        const registerData = {};
        formData.forEach((value, key) => {
            registerData[key] = value;
        });

        // Send a POST request to your server for registration
        fetch("http://localhost:8080/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
        })
        .then((response) => {
            if (response.status === 200) {
                // Successful registration
                console.log("Registration successful");
                // Display the success message
                const successMessage = document.getElementById("registrationSuccessMessage");
                successMessage.style.display = "block";
                // Hide the register form and show the login form
                loginForm.style.display = "block";
                loginToggleText.style.display = "block";
                
                registerForm.style.display = "none";
                registerToggleText.style.display = "none";
                // Reset the form fields if needed
                registerForm.reset();
            } else if (response.status === 409) {
                // Bad request, handle validation errors or duplicate email
                console.log("Registration failed: Bad request"); // add message saying email exists
            } else if (response.status === 500) {
                // Internal server error
                console.log("Registration failed: Server error");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    });

});
