// Function to format date to YYYY-MM-DD HH:MM:SS
function formatToYYYYMMDDHHMMSS(dateString) {
    const date = new Date(dateString);
    return date.toISOString().replace('T', ' ').split('.')[0];
}

// Function to display work order data in the table
function displayResults(work_orders) {
    const tableBody = document.getElementById('table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing table rows

    if (!work_orders || work_orders.length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 6;
        cell.innerText = 'No work orders found.';
        return;
    }

    work_orders.forEach(order => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = order.Order_ID;
        row.insertCell(1).innerText = order.Quote_Id;
        row.insertCell(2).innerText = `$${order.Price.toFixed(2)}`;
        row.insertCell(3).innerText = formatToYYYYMMDDHHMMSS(order.start_Date);
        row.insertCell(4).innerText = formatToYYYYMMDDHHMMSS(order.End_Date);
        row.insertCell(5).innerText = order.status;
    });
}

// Fetch data after page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // First fetch to check if the user is authenticated
        const authResponse = await fetch('http://localhost:3000/home', {
            method: 'GET',
            credentials: 'include' // Include session cookie in the request
        });

        if (!authResponse.ok) {
            throw new Error('You must be logged in to access the home page.');
        }

        const authData = await authResponse.json();

        // Second fetch to get submitted work orders
        const requestsResponse = await fetch('http://localhost:3000/cost_orders_generated', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'  // Include session cookie
        });
        const requestsData = await requestsResponse.json();

        if (requestsResponse.ok) {
            displayResults(requestsData.data); // Call displayResults with the fetched data
        } else {
            console.error('Error fetching orders:', requestsData);
            alert("No entries found");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Please sign in with correct credentials to continue.");
        window.location.href = 'signin.html'; // Redirect to login page if not authenticated
    }
});