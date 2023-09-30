// Get the query parameters from the URL
const queryParams = new URLSearchParams(window.location.search);

// Get the value of the 'store_id' query parameter
const storeId = queryParams.get('store_id');
const storeName = queryParams.get('store_name');

// Now you can use the 'storeId' variable to fetch and display details of the selected store
// For example, you can make an API request to fetch store details based on 'storeId'
fetchStoreDetails();

function handleUnauthenticated() {
    // Redirect the user to the login page or perform other actions
    window.location.href = "login.html"; 
}

function displayStoreDetails(products) {
    const storeDetails = document.getElementById("storeDetails");

    // Assuming that the store name is the same for all products, you can take it from the first product
    const storeHeader = document.createElement("h2");
    storeHeader.textContent = `Store Name: ${storeName}`;
    storeDetails.appendChild(storeHeader);

    // Iterate through the products and display each product's details
    products.forEach((product) => {
        const productDiv = createProductDiv(product); // Use the createProductDiv function
        storeDetails.appendChild(productDiv);
    });
}

function createProductDiv(product) {
    const productId = product.product_id; // Replace 'product.id' with the actual way to get the product ID
    const productDiv = document.createElement("div");
    productDiv.classList.add("product-item"); // Add the "product-item" class to the div

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    // Function to create a table row with a key and value
    function createTableRow(key, value) {
        const row = document.createElement("tr");
        const keyCell = document.createElement("td");
        const valueCell = document.createElement("td");

        keyCell.textContent = key;
        valueCell.textContent = value;

        row.appendChild(keyCell);
        row.appendChild(valueCell);
        return row;
    }

    // Create a row for keys and a row for values
    const keysRow = document.createElement("tr");
    const valuesRow = document.createElement("tr");

    // Create cells for keys and values
    const productNameKey = document.createElement("td");
    productNameKey.textContent = "Name";
    const skuKey = document.createElement("td");
    skuKey.textContent = "SKU";
    const quantityKey = document.createElement("td");
    quantityKey.textContent = "Quantity";

    const productNameValue = document.createElement("td");
    productNameValue.textContent = product.product_name;
    const skuValue = document.createElement("td");
    skuValue.textContent = product.sku;

    // Quantity Display
    const quantityDisplay = document.createElement("td");
    quantityDisplay.textContent = product.quantity;

    // Minus Button
    const minusButton = document.createElement("button");
    minusButton.textContent = "-";
    minusButton.classList.add("quantity-button", "minus-button");

    // Plus Button
    const plusButton = document.createElement("button");
    plusButton.textContent = "+";
    plusButton.classList.add("quantity-button", "plus-button");

    // Save Button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("save-button");
    saveButton.style.display = "none"; // Initially hidden

    // Cancel Button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("cancel-button");
    cancelButton.style.display = "none"; // Initially hidden


        // Event listeners for plus and minus buttons
    let quantityValue = product.quantity; // Initialize with the fetched quantity

    minusButton.addEventListener("click", () => {
        if (quantityValue > 0) {
            quantityValue--;
            quantityDisplay.textContent = `${quantityValue}`;
            showSaveCancelButtons();
        }
    });
    plusButton.addEventListener("click", () => {
        quantityValue++;
        quantityDisplay.textContent = `${quantityValue}`;
        showSaveCancelButtons();
    });

    // Event listeners for save and cancel buttons
    saveButton.addEventListener("click", () => {
        // Send a request to update the quantity
        const newQuantity = quantityValue; // Get the new quantity from the user
        
        console.log(`product id = ${productId}`);
        // Define the request URL and data
        const updateUrl = `http://localhost:8080/api/products/${productId}`;
        const requestData = {
            method: "PUT", // or "PATCH" depending on your API
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({ quantity: newQuantity }), // Update quantity field
        };

        // Send the request
        fetch(updateUrl, requestData)
            .then((response) => {
                if (response.status === 200) {
                    console.log("Quantity updated successfully");
                    hideSaveCancelButtons();
                } else {
                    console.log("Failed to update quantity");
                    // Handle errors here
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                // Handle errors here
            });
    });

    cancelButton.addEventListener("click", () => {
        // Revert to the last fetched quantity
        quantityValue = product.quantity;
        quantityDisplay.textContent = `${quantityValue}`;
        hideSaveCancelButtons();
    });

    // // Apply border styles to table cells
    // const tableCells = [productNameKey, skuKey, quantityKey, productNameValue, skuValue, quantityValue];
    // tableCells.forEach((cell) => {
    //     cell.style.border = "1px solid #ddd"; // Add border to table cells
    //     cell.style.padding = "5px"; // Add padding to table cells
    // });

    

    keysRow.appendChild(productNameKey);
    keysRow.appendChild(skuKey);
    keysRow.appendChild(quantityKey);
    valuesRow.appendChild(productNameValue);
    valuesRow.appendChild(skuValue);
    valuesRow.appendChild(quantityDisplay);

    tbody.appendChild(keysRow);
    tbody.appendChild(valuesRow);

    table.appendChild(tbody);
    productDiv.appendChild(table);

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete"; // Button text
    deleteButton.classList.add("delete-button"); // Add a class for styling

    // Event listener for delete button ============================================================================================================================ DELETE A PRODUCT
    deleteButton.addEventListener("click", () => {
        // console.log("JUST CLICKED DELETE BUTTON"); // <--------------WORKING, delete later
        // Display the delete confirmation modal
        const deleteConfirmationModal = document.getElementById("deleteConfirmationModal");
        deleteConfirmationModal.style.display = "block";

        // Handle the "Yes" button click in the confirmation modal
        const yesButton = document.getElementById("confirmDeleteYesButton");
        yesButton.addEventListener("click", () => {
            const deleteUrl = `http://localhost:8080/api/products/delete?productId=${productId}`;

            fetch(deleteUrl, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((response) => {
                if (response.status === 204) {
                    console.log("Product deleted successfully");
                    // Perform any additional actions after successful deletion
                    deleteConfirmationModal.style.display = "none";
                    fetchStoreDetails();
                } else {
                    console.log("Failed to delete product");
                    // Handle errors here
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                // Handle errors here
            });
        });

        // Handle the "No" button click in the confirmation modal
        const noButton = document.getElementById("confirmDeleteNoButton");
        noButton.addEventListener("click", () => {
            // Close the confirmation modal
            deleteConfirmationModal.style.display = "none";
        });
    });

    productDiv.appendChild(minusButton);
    productDiv.appendChild(plusButton);
    productDiv.appendChild(saveButton);
    productDiv.appendChild(cancelButton);
    productDiv.appendChild(deleteButton); // Add the "Delete" button to the product div

    return productDiv;

    function showSaveCancelButtons() {
        saveButton.style.display = "inline-block";
        cancelButton.style.display = "inline-block";
    }

    function hideSaveCancelButtons() {
        saveButton.style.display = "none";
        cancelButton.style.display = "none";
    }
}

// FUNCTION TO HANDLE THE DELETE PRODUCT EVENT
function deleteProduct() {
    console.log("DELETING PRODUCT");
}

// ADD PRODUCT ---------------------------------------------------------------------------------

// Function to handle the click event of the "Add Product" button
function handleAddProduct() {
    // Display the modal
    const modal = document.getElementById("productModal");
    modal.style.display = "block";

    // Clear the input fields when the modal is opened
    document.getElementById("productName").value = "";
    document.getElementById("sku").value = "";
    document.getElementById("quantity").value = "";
}

// Function to handle the click event of the "Save Product" button
function handleSaveProduct() {
    // Get the values from the input fields
    const productName = document.getElementById("productName").value;
    const sku = document.getElementById("sku").value;
    const quantity = document.getElementById("quantity").value;

    // Validate the input (you can add more validation as needed)
    if (!productName || !sku || isNaN(quantity) || quantity < 0) {
        alert("Please fill in all fields with valid values.");
        return;
    }

    console.log(`productName = ${productName}, sku = ${sku}, quantity = ${quantity}`);   // PRINTS OUT THE DATA TO THE CONSOLE
    // You can now send the data to the server or perform any other actions
    // Here, you can add the logic to send the data to your backend
    // Create an object with the product data
    const productData = {
        store_id:  parseInt(storeId),
        product_name: productName,
        sku: sku,
        quantity: parseInt(quantity), // Convert quantity to an integer
    };

    console.log(productData);

    // Send the product data to the backend using a POST request
    fetch(`http://localhost:8080/api/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"), // Add your authorization header
        },
        body: JSON.stringify(productData), // Convert the data to JSON format
    })
    .then((response) => {
        if (response.status === 201) {
            console.log("Product added successfully");
            
            // You can perform any additional actions here, such as updating the UI
            fetchStoreDetails();
            
            // Close the modal
            const modal = document.getElementById("productModal");
            modal.style.display = "none";
        } else {
            console.log("Failed to add product");
            // Handle errors here, e.g., show an error message to the user
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        // Handle errors here, e.g., show an error message to the user
    });

    // After saving the product, close the modal
    const modal = document.getElementById("productModal");
    modal.style.display = "none";
}

// Function to handle the click event of the "Cancel" button
function handleCancel() {
    // Close the modal without saving
    const modal = document.getElementById("productModal");
    modal.style.display = "none";
}

// Add event listeners
const addProductButton = document.getElementById("addProductButton");
addProductButton.addEventListener("click", handleAddProduct);

const saveProductButton = document.getElementById("saveProductButton");
saveProductButton.addEventListener("click", handleSaveProduct);

const cancelButton = document.getElementById("cancelButton");
cancelButton.addEventListener("click", handleCancel);

// Close the modal if the "x" button is clicked
const closeModalButton = document.getElementById("closeModal");
closeModalButton.addEventListener("click", handleCancel);

// Close the modal if the user clicks anywhere outside of it
window.addEventListener("click", (event) => {
    const modal = document.getElementById("productModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Close the delete confirmation modal if the user clicks anywhere outside of it
window.addEventListener("click", (event) => {
    const deleteConfirmationModal = document.getElementById("deleteConfirmationModal");
    if (event.target === deleteConfirmationModal) {
        deleteConfirmationModal.style.display = "none";
    }
});

function fetchStoreDetails() {
    fetch(`http://localhost:8080/api/stores?store_id=${storeId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
        },
    })
    .then((response) => {
        if (response.status === 200) {
            console.log("Successfully retrieved products for store");
            response.json().then((store) => {
                // Clear the current store details
                const storeDetails = document.getElementById("storeDetails");
                storeDetails.innerHTML = "";

                // Display the updated store details
                displayStoreDetails(store);
            });
        } else if (response.status === 401) {
            // Unauthorized, handle accordingly (e.g., redirect to login)
            handleUnauthenticated();
            throw new Error("Unauthorized");
        } else {
            // Handle other status codes (e.g., 500 for server error)
            console.log("Failed to fetch store details: Server error");
            throw new Error("Server error");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}