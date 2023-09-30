document.addEventListener("DOMContentLoaded", async function () {
    console.log("Starting dashboard.js");
    try {
        const isAuthenticated = await checkAuthentication();
        console.log("Is authenticated:", isAuthenticated);

        if (isAuthenticated) {
            fetchStores();
        } else {
            console.log("User is not authenticated");
            handleUnauthenticated();
        }
    } catch (error) {
        console.error("Error", error);
    }

      // Add an event listener to toggle the button and input field
    const createStoreButton = document.getElementById("createStore");
    const addStoreContainer = document.getElementById("addStoreContainer");
    const addStoreButton = document.getElementById("addStore");
    const cancelAddStoreButton = document.getElementById("cancelAddStore");
    const storeNameInput = document.getElementById("storeNameInput");

    createStoreButton.addEventListener("click", () => {
        // Hide the "Create Store" button and show the input field and "Add Store" button
        createStoreButton.style.display = "none";
        addStoreContainer.style.display = "block";
    });

    addStoreButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default form submission

        const storeName = storeNameInput.value.trim(); // Get the trimmed input value
        console.log("store name is");
        console.log(storeName);
        
        if (storeName) {
           
            // Send a POST request to create the store
            createNewStore(storeName);
            // Clear the input field and hide the container
            storeNameInput.value = "";
            addStoreContainer.style.display = "none";
            // Show the "Create Store" button again
            createStoreButton.style.display = "block";
        } else {
            alert("Please enter a store name.");
        }
    });

    cancelAddStoreButton.addEventListener("click", () => {
        // Clear the input field and hide the container
        storeNameInput.value = "";
        addStoreContainer.style.display = "none";
        // Show the "Create Store" button again
        createStoreButton.style.display = "block";
    });


});



function checkAuthentication() {
    // Return true if authenticated, false otherwise
    const token = localStorage.getItem("token");
    
    return token !== null;
}

function fetchStores() {
    // Fetch stores from the server
    fetch("http://localhost:8080/api/stores", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
        },
    })
    .then((response) => {
        if (response.status === 200) {
            response.json().then((stores) => {
                displayStores(stores);
            });
        } else if (response.status === 204) {
            // No stores, display the message
            console.log("No stores to display");
            displayNoStoresMessage();
            return;
        } else if (response.status === 401) {
            // Unauthorized, handle accordingly (e.g., redirect to login)
            handleUnauthenticated();
            throw new Error("Unauthorized");
        } else {
            // Handle other status codes (e.g., 500 for server error)
            console.log("Failed to fetch stores: Server error");
            throw new Error("Server error");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });

}

function handleUnauthenticated() {
    // Redirect the user to the login page or perform other actions
    window.location.href = "login.html"; 
}

function displayStores(stores) {
    // For demonstration purposes, let's assume there is a <div> with the id "storeList" on the dashboard where we want to display the stores.
    const storeList = document.getElementById("storeList");

    // Clear any previous content in the storeList div
    storeList.innerHTML = "";

    // Create HTML elements for each store and append them to the storeList div.
    stores.forEach((store) => {
        const storeElement = document.createElement("div");
        storeElement.textContent = `Store ID: ${store.store_id}, Name: ${store.store_name}`;
        // const storeID = store.store_id;   <------------------ IS THIS ACCEPTABLE OR HOW ELSE TO STORE EACH STORE'S ID IN THE FRONTEND?

        // Add a click event listener to each store element
        storeElement.addEventListener("click", () => {
            // Redirect to the store.html page with the selected store's ID as a query parameter
            window.location.href = `store.html?store_id=${store.store_id}&store_name=${store.store_name}`;
        });

        storeList.appendChild(storeElement);
    });
}

function displayNoStoresMessage() {
    // Display the "No stores" message
    const storeList = document.getElementById("storeList");
    const noStoresMessage = document.createElement("p");
    noStoresMessage.className = "no-stores";
    noStoresMessage.textContent = "You don't have any stores yet.";
    storeList.innerHTML = ""; // Clear any previous content
    storeList.appendChild(noStoresMessage);
}

function createNewStore(storeName) {

    console.log(`Sending new store to backend: ${storeName}`);

    // Fetch API to create a new store
    fetch("http://localhost:8080/api/stores", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ store_name: storeName }), // Send the store name in the request body
    })
    .then((response) => {
        if (response.status === 201) {
            // Store created successfully, you can handle this case as needed
            console.log("Store created successfully");
            // You can optionally fetch and display the updated list of stores
            fetchStores();
        } else if (response.status === 401) {
            // Unauthorized, handle accordingly (e.g., redirect to login)
            handleUnauthenticated();
            throw new Error("Unauthorized");
        } else {
            // Handle other status codes (e.g., 500 for server error)
            console.log("Failed to create store: Server error");
            throw new Error("Server error");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}


