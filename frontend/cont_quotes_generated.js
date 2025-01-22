function formatToYYYYMMDDHHMMSS(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

function updatequote(quoteId) {
    const popupWindow = window.open('', '_blank', 'width=500,height=500');
    
    if (!popupWindow) {
        alert('Popup blocked. Please enable popups for this site.');
        return;
    }

    popupWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Generate quote</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
        <div>
            <h3>Quote ID: ${quoteId}</h3>
              <div class="form-container">
            <form id="quotegenerateForm">
                <label for="price">Price:</label>
                <input type="number" id="price" name="price" step="0.01" required><br><br>
                <label for="startPeriod">Start Period:</label>
                <input type="date" id="startPeriod" name="startPeriod" required><br><br>
                <label for="endPeriod">End Period:</label>
                <input type="date" id="endPeriod" name="endPeriod" required><br><br>
                <button type="submit">Submit Quote</button>
                <button type="button" onclick="window.close()">Cancel</button>
            </form>
            </div>
        </div>
        <script>
            document.getElementById('quotegenerateForm').addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent default form submission
                const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        // Validate Start Period (should be today or later)
        const startdate = document.getElementById('startPeriod').value;
        if (startdate < today) {
            alert('Start period must be today or later!');
            return; // Prevent form submission
        }

        // Validate End Period (should be later than Start Period)
        const enddate = document.getElementById('endPeriod').value;
        if (enddate <= startdate) {
            alert('End period must be later than Start period!');
            return; // Prevent form submission
        }
                const price = document.getElementById('price').value;

                // Prepare data for submission
                const data_new = {
                    Price: price,
                    startDate: startdate,
                    endDate: enddate,
                    quote_id: ${quoteId} 
                };
    
                try {
                    // Send the data to the backend
                    const response = await fetch('http://localhost:3000/cont_updatequote', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data_new),
                        credentials: 'include'  // Allow session cookies
                    });
                
                    const result = await response.json();
    
                    if (response.ok) {
                        alert('Quote updated!');
                        window.close(); // Close the popup window
                        window.opener.location.reload();
                    } else {
                        alert('Error: ' + (result.message || 'Failed to generate quote.'));
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while generating the quote.');
                }
            });
        </script>
        </body>
        </html>
    `);
    
    popupWindow.focus();       
}

function quotenegotiation(quoteId) {
    const popupWindow = window.open('', '_blank', 'width=500,height=500');
    
    if (!popupWindow) {
        alert('Popup blocked. Please enable popups for this site.');
        return;
    }

    // Write a basic HTML structure to the popup
    popupWindow.document.write(`
        <html>
            <head><title>Negotiation Data</title></head>
            <body>
                <h2>Negotiation Details</h2>
                <table id="resultsTable">
                    <thead>
                        <tr>
                            <th>Message</th>
                            <th>Sender</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colspan="2">Loading...</td></tr>
                    </tbody>
                </table>
                <br><br>
                  <div class="form-container">
                <form id="quotenegotiationForm">
                <label for="note_message">Note:</label>
    <textarea id="note_message" name="note_message" required placeholder="Enter a description here" rows="4" cols="50"></textarea>
    <br><br>
                <button type="submit">send message</button>
                <button type="button" onclick="window.close()">Cancel</button>
            </form>
            </div>
            </body>
        </html>
    `);

    popupWindow.document.close();  // Close the document stream so it renders

    popupWindow.document.getElementById('quotenegotiationForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the form from submitting normally (page reload)

        const noteMessage = popupWindow.document.getElementById('note_message').value; // Get the message entered

        if (!noteMessage) {
            alert('Please enter a message before submitting.');
            return;
        }

        try {
            // Send the note message along with the quoteId to the server
            const response = await fetch('http://localhost:3000/cont_negotiatequote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quote_id: quoteId,
                    note_message: noteMessage
                }),
                credentials: 'include'
            });

            const result = await response.json();

            if (response.ok) {
                alert('Message sent successfully!');
                // Optionally, you can reload or update the negotiation data displayed in the table
                popupWindow.close(); // Reload the popup to show updated negotiation data
            } else {
                alert('Error: ' + result.message || 'Failed to send message.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while sending the message.');
        }
    });

    (async () => {
        try {
            const authResponse = await fetch('http://localhost:3000/home_admin', {
                method: 'GET',
                credentials: 'include'
            });
    
            if (!authResponse.ok) {
                throw new Error('You must be logged in to access the home page.');
            }
    
            const authData = await authResponse.json();
            //alert("Logged in!");
    
            const data_new = { quote_id: quoteId };
    
            const response = await fetch('http://localhost:3000/quotenegotiatedata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data_new),
                credentials: 'include'
            });
    
            const result = await response.json();
            const result_data = result.data;

            const tableBody = popupWindow.document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear the loading message

            if (!result_data || result_data.length === 0) {
                const row = tableBody.insertRow();
                const cell = row.insertCell(0);
                cell.colSpan = 2;
                cell.innerText = 'No negotiation yet.';
                return;
            }

            result_data.forEach(data => {
                const row = tableBody.insertRow();
                row.insertCell(0).innerText = data.note_message_details;
                row.insertCell(1).innerText = data.sender;
            });

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during the negotiation process.');
        }
    })();
    
    popupWindow.focus();
}


//function to display query results
function displayResults(users) {
    //if query result is empty then it shows below alert and display 'No users found' in table
    if(users.length===0){
       alert("No quotes yet");
    }
    const resultsTableBody = document.getElementById('table').getElementsByTagName('tbody')[0];

    // Clear previous results
    resultsTableBody.innerHTML = '';

    // Check if users is defined and is an array
    if (!users || users.length === 0) {
        const row = resultsTableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 6; // Adjust based on the number of columns in your table
        cell.innerText = 'No quotes yet.'; // Message for no results/empty query results
        return; // Exit if there are no users to display
    }

    // Populate the table with new data
    users.forEach(user => {
      const row = resultsTableBody.insertRow();   
        row.insertCell(0).innerText = user.Quote_ID ; 
        row.insertCell(1).innerText = user.Price ;  
        row.insertCell(2).innerText = formatToYYYYMMDDHHMMSS(user.Start_Period) ;     
        row.insertCell(3).innerText = formatToYYYYMMDDHHMMSS(user.End_Period); 
        row.insertCell(4).innerText = user.Status ; 
        const actionCell = row.insertCell(5);

        // Create the "Generate Quote" button
        const negotiationButton = document.createElement('button');
        negotiationButton.innerText = 'Negotiation';
        negotiationButton.classList.add('negotiation-quote-btn');
        negotiationButton.onclick = () => quotenegotiation(user.Quote_ID);
    
        const updatequoteButton = document.createElement('button');
        updatequoteButton.innerText = 'Update quote';
        updatequoteButton.classList.add('update-quote-btn');
        updatequoteButton.onclick = () => updatequote(user.Quote_ID);
    
        if (user.Status === 'Sent') {
            negotiationButton.disabled = false;
            updatequoteButton.disabled = false;
        } else {
            negotiationButton.disabled = true;
            updatequoteButton.disabled = true;
        }

        // Append buttons to the action cell
        actionCell.appendChild(negotiationButton);
        actionCell.appendChild(updatequoteButton);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // First fetch to check if the user is authenticated
        const authResponse = await fetch('http://localhost:3000/home_admin', {
            method: 'GET',
            credentials: 'include'  // Include session cookie in the request
        });

        if (!authResponse.ok) {
            throw new Error('You must be logged in to access the home page.');
        }

        // User is authenticated
        const authData = await authResponse.json();
       // alert("Logged in!");

        // Second fetch to get quotes
        const requestsResponse = await fetch('http://localhost:3000/cont_quote_generated', {
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
            console.error('Error fetching requests:', requestsData);
            alert("No entries found");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Please sign in with admin credentials to continue.");
        window.location.href = 'signin_admin.html'; // Redirect to login page
    }
});
