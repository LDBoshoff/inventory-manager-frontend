document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("storeId");
    fetchStoreDetails();
});

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


function logout() {
    // Clear localStorage or sessionStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("storeId");
    // Redirect to login page or perform other logout actions
}
