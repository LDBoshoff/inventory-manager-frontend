let globalStoreId;

document.addEventListener('DOMContentLoaded', () => {

    // Attempt to retrieve storeId from localStorage
    globalStoreId = localStorage.getItem("storeId");
    if (!globalStoreId) {
        console.error("Store ID not found. Redirecting to login.");
        // Redirect to login or handle appropriately
        window.location.href = "login.html"; // Adjust the path as necessary
        return;
    }
    // localStorage.removeItem("authToken");
    // localStorage.removeItem("storeId");
    fetchStoreDetails();
    fetchAllProducts();

    var modal = document.getElementById("add-product-modal"); // Get modal element
    var btn = document.getElementById("add-product-btn");// Get button that opens the modal
    var span = document.getElementsByClassName("close-button")[0];// Get the <span> element that closes the modal

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Add event listener for form submission to capture input values and send a POST request
    document.getElementById("add-product-form").addEventListener("submit", addProduct);

});

function addProduct(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Capture the product details from the form
    var productName = document.getElementById("product-name").value;
    var productPrice = document.getElementById("product-price").value;
    var productQuantity = document.getElementById("product-quantity").value;

    // Construct the request payload
    var productData = {
        name: productName,
        price: productPrice,
        quantity: productQuantity,
        storeId: globalStoreId
    };

    // Send a POST request to the server
    fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
            // Include any other headers your API requires
        },
        body: JSON.stringify(productData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Display the success message
        var feedbackMessage = document.getElementById("feedback-message"); // Assume you have a placeholder for the success message
        feedbackMessage.textContent = "Product added successfully!";
        feedbackMessage.style.display = "block"; // Make sure the message is visible
        feedbackMessage.style.color = "green";

        // Use setTimeout to delay the closing of the modal and the refresh of the product list
        setTimeout(() => {
            // Close the modal
            var modal = document.getElementById("add-product-modal");
            modal.style.display = "none";

            // Refresh the product list
            fetchAllProducts(); // This function needs to be defined in your script

            // Optionally, clear the form fields
            document.getElementById("product-name").value = '';
            document.getElementById("product-price").value = '';
            document.getElementById("product-quantity").value = '';

            // Hide the success message again (optional)
            feedbackMessage.style.display = "none";
        }, 2000); // 2000 milliseconds = 2 seconds
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle errors, such as displaying a notification to the user
    });
}

function fetchStoreDetails() {
    const storeId = localStorage.getItem("storeId"); // Retrieve the stored storeId
    // if (!storeId) {
    //     console.error("Store ID not found. Redirecting to login.");
    //     window.location.href = "login.html"; // Adjust the path as necessary
    //     return;
    // }

    // Adjust the URL and headers according to your actual API and authentication method
    fetch(`http://localhost:8080/api/stores/${storeId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) { // Check if the response is 401 Unauthorized
                // Redirect to login page
                window.location.href = "login.html";
                return;
            }
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Dynamically set the store's name and other details
        document.getElementById('store-name').textContent = data.name; // Set store's name dynamically
        document.getElementById('total-sales').textContent = data.totalSales;
        document.getElementById('sales-revenue').textContent = `$${data.salesRevenue.toFixed(2)}`;
    })
    .catch(error => {
        console.error('Failed to fetch store details:', error);
        // Consider redirecting to the login page or showing an error message
    });
}

function fetchAllProducts() {
    const storeId = localStorage.getItem("storeId"); // Retrieve the stored storeId
    // if (!storeId) {
    //     console.error("Store ID not found. Redirecting to login.");
    //     window.location.href = "login.html"; // Adjust the path as necessary
    //     return;
    // }

    // Adjust the URL and headers according to your actual API and authentication method
    fetch(`http://localhost:8080/api/products?storeId=${storeId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const productList = document.getElementById('products');
        productList.innerHTML = ''; // Clear existing products
        data.products.forEach(product => {
            const li = document.createElement('li');
            li.textContent = `ID: ${product.id}, Name: ${product.name}, Price: ${product.price}, Quantity: ${product.quantity}`;
            productList.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Failed to fetch products:', error);
        // Consider redirecting to the login page or showing an error message
    });
}

function logout() {
    // Clear localStorage or sessionStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("storeId");
    // Redirect to login page or perform other logout actions
}
