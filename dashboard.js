let globalStoreId;

document.addEventListener('DOMContentLoaded', () => {
    // Attempt to retrieve storeId from localStorage
    globalStoreId = localStorage.getItem("storeId");
    if (!globalStoreId) {
        console.error("Store ID not found. Redirecting to login.");
        window.location.href = "login.html"; // Adjust the path as necessary
        return;
    }

    fetchStoreDetails();
    fetchAllProducts();

    // When the user clicks the button, open the add product modal 
    document.getElementById("add-product-btn").onclick = function() {
        openAddProductModal();
    };

    // When the user clicks anywhere outside of the modal, close it
    var modal = document.getElementById("modal");
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});

function openAddProductModal() {
    var modal = document.getElementById("modal");
    var modalBody = document.getElementById("modal-body");

    modalBody.innerHTML = `
        <h2>Add Product</h2>
        <form id="add-product-form">
            <label for="product-name">Product Name:</label>
            <input type="text" id="product-name" name="product-name" required>
            <label for="product-price">Price:</label>
            <input type="number" id="product-price" name="product-price" required>
            <label for="product-quantity">Quantity:</label>
            <input type="number" id="product-quantity" name="product-quantity" required>
            <button type="submit">Submit</button>
        </form>
        <div id="feedback-message" style="display: none;"></div>
    `;

    // Add event listener for form submission to capture input values and send a POST request
    document.getElementById("add-product-form").addEventListener("submit", addProduct);

    // Handle closing the modal with the close button
    document.querySelector(".close-button").onclick = function() {
        modal.style.display = "none";
    };

    modal.style.display = "block"; // Show the modal
}

function addProduct(event) {
    event.preventDefault(); // Prevent form from submitting normally

    var productName = document.getElementById("product-name").value;
    var productPrice = document.getElementById("product-price").value;
    var productQuantity = document.getElementById("product-quantity").value;

    var productData = {
        name: productName,
        price: productPrice,
        quantity: productQuantity,
        storeId: globalStoreId
    };

    fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`
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
        var feedbackMessage = document.getElementById("feedback-message");
        feedbackMessage.textContent = "Product added successfully!";
        feedbackMessage.style.display = "block";
        feedbackMessage.style.color = "green";

        setTimeout(() => {
            document.getElementById("modal").style.display = "none";
            fetchAllProducts();
            feedbackMessage.style.display = "none";
        }, 2000);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


function openProductModal(product) {
    var modal = document.getElementById("modal");
    var modalBody = document.getElementById("modal-body");

    modalBody.innerHTML = `
        <h2>Product Details</h2>
        <p>Name: ${product.name}</p>
        <p>Price: ${product.price}</p>
        <p>Quantity: ${product.quantity}</p>
    `;

    document.querySelector(".close-button").onclick = function() {
        modal.style.display = "none";
    };

    modal.style.display = "block"; // Show the modal
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
            li.setAttribute('data-product-id', product.id);
            li.addEventListener('click', () => openProductModal(product));
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
