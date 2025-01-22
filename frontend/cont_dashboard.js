// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Function to clear and populate a table with data
function populateTable(tableId, data, columns) {
    const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    if (!data || data.length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = columns.length;
        cell.innerText = 'No data found.';
        return;
    }

    data.forEach(item => {
        const row = tableBody.insertRow();
        columns.forEach((col, index) => {
            const cell = row.insertCell(index);
            cell.innerText = item[col];
        });
    });
}

// Function to fetch and display data for all tables
async function fetchAndDisplayData() {
    try {
        const response = await fetch('http://localhost:3000/cont_dashboard', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data.');
        }

        const { data } = await response.json();

        // Populate each table with the corresponding data
        populateTable('table1', data.bigClients, ['first_name', 'last_name', 'email', 'TotalCompletedOrders']);
        populateTable('table2', data.difficultClients, ['user_id','first_name', 'last_name', 'email']);
        populateTable('table3', data.thisMonthQuotes, ['Quote_ID', 'Price', 'Start_Period', 'End_Period','Timestamp']);
        populateTable('table4', data.prospectiveClients, ['user_id','first_name', 'last_name', 'email']);
        populateTable('table5', data.largestDriveway, ['Address', 'Square_Feet']);
        populateTable('table6', data.overdueBills, ['BillID', 'Price', 'Status','Timestamp','Payment_date','Due_Date']);
        populateTable('table7', data.badClients, ['user_id','first_name', 'last_name', 'email']);
        populateTable('table8', data.goodClients, ['user_id','first_name', 'last_name', 'email']);
        console.log(data.overdueBills);
        console.log('Data successfully loaded and displayed.');
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading data. Please try again later.');
    }
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Authenticate the user
        const authResponse = await fetch('http://localhost:3000/home_admin', {
            method: 'GET',
            credentials: 'include'
        });

        if (!authResponse.ok) {
            throw new Error('You must be logged in to access the home page.');
        }

        const authData = await authResponse.json();
        console.log('Authentication successful:', authData);

        // Fetch and display dashboard data
        await fetchAndDisplayData();
    } catch (error) {
        console.error('Error:', error);
        alert("Please sign in with admin credentials to continue.");
        window.location.href = 'signin_admin.html';
    }
});