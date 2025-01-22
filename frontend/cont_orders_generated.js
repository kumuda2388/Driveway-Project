// Function to format date to YYYY-MM-DD HH:MM:SS
function formatToYYYYMMDDHHMMSS(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

async function generateBill(Orderid, price){
    try {
        const data_new = {
            order_id: Orderid ,
            price: price 
        };
        const response = await fetch('http://localhost:3000/cont_generatebill', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data_new),  // Ensure `data_new` is defined correctly before this point
            credentials: 'include'  // Allow session cookies
        });

        const result = await response.json();  // Parse the response as JSON

        if (response.ok) {
            alert('Bill generated!');
            window.location.reload();  // Reload the parent window
        } else {
            alert('Error: ' + (result.message || 'Failed to generate bill.'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while generating the bill.');
    }
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
        row.insertCell(1).innerText = order.Quote_ID;
        row.insertCell(2).innerText = `$${order.Price.toFixed(2)}`;
        row.insertCell(3).innerText = formatToYYYYMMDDHHMMSS(order.Start_Date);
        row.insertCell(4).innerText = formatToYYYYMMDDHHMMSS(order.End_Date);
        row.insertCell(5).innerText = order.Status;
        
        // Insert the "Action" column for the button in the 7th column
        const actionCell = row.insertCell(6); // 6 is the index for the 7th column

        // Create the "Mark as complete" button
        const MarkCompleteButton = document.createElement('button');
        MarkCompleteButton.innerText = 'Mark as complete';
        MarkCompleteButton.classList.add('generate-quote-btn');
        
        // Add click event to generate the bill
        MarkCompleteButton.onclick = () => generateBill(order.Order_ID, order.Price);

        if (order.Status === 'work in progress') {
            MarkCompleteButton.disabled = false;
        } else {
            MarkCompleteButton.disabled = true;
        }

        // Append button to the action cell
        actionCell.appendChild(MarkCompleteButton);


    });
}


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const authResponse = await fetch('http://localhost:3000/home_admin', {
            method: 'GET',
            credentials: 'include'
        });

        if (!authResponse.ok) {
            throw new Error('You must be logged in to access the home page.');
        }

        const authData = await authResponse.json();

        const requestsResponse = await fetch('http://localhost:3000/cont_orders_generated', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        const requestsData = await requestsResponse.json();

        if (requestsResponse.ok) {
            displayResults(requestsData.data);
        } else {
            console.error('Error fetching requests:', requestsData);
            alert("No entries found");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Please sign in with admin credentials to continue.");
        window.location.href = 'signin_admin.html';
    }
});