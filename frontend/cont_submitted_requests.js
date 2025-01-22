function generateQuote(submitRequestId) {
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
            <h3>Submit Request ID: ${submitRequestId}</h3>
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
                    submit_request_id: ${submitRequestId}  // Pass submitRequestId as a variable
                };
            
    
                try {
                    // Send the data to the backend
                    const response = await fetch('http://localhost:3000/cont_generatequote', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data_new),
                        credentials: 'include'  // Allow session cookies
                    });
    
                    const result = await response.json();
    
                    if (response.ok) {
                        alert('Quote generated!');
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

    // Write the form HTML into the popup window
    function rejectRequest(submitRequestId) {
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
                <h3>Submit Request ID: ${submitRequestId}</h3>
                  <div class="form-container">
                <form id="quotegenerateForm">
                    <label for="note">Note:</label>
    <textarea id="note" name="note" required placeholder="Enter a reason for rejection here" rows="4" cols="50"></textarea>
    <br><br>
                    <button type="submit">Reject Request</button>
                    <button type="button" onclick="window.close()">Cancel</button>
                </form>
            </div>
            </div>
            <script>
        
                document.getElementById('quotegenerateForm').addEventListener('submit', async (event) => {
                    event.preventDefault(); // Prevent default form submission
                    
                    const Note = document.getElementById('note').value;
        
                    // Prepare data for submission
                    const data_new = {
                        note: Note,
                        submit_request_id: "${submitRequestId}"  // Correctly pass submitRequestId as a variable
                    };
        
               
        
                    try {
                        // Send the data to the backend
                        const response = await fetch('http://localhost:3000/cont_rejectrequest', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data_new),
                            credentials: 'include'  // Allow session cookies
                        });
        
                        const result = await response.json();
        
                        if (response.ok) {
                            alert('request rejected!');
                            window.close(); // Close the popup window
                            window.opener.location.reload(); // Reload the parent window
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


//function to display query results
function displayResults(users) {
    //if query result is empty then it shows below alert and display 'No users found' in table
    if(users.length===0){
       alert("No requests yet");
    }
    const resultsTableBody = document.getElementById('table').getElementsByTagName('tbody')[0];

    // Clear previous results
    resultsTableBody.innerHTML = '';

    // Check if users is defined and is an array
    if (!users || users.length === 0) {
        const row = resultsTableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 6; // Adjust based on the number of columns in your table
        cell.innerText = 'No submit requests yet.'; // Message for no results/empty query results
        return; // Exit if there are no users to display
    }

    // Populate the table with new data
    users.forEach(user => {
      const row = resultsTableBody.insertRow();   
        row.insertCell(0).innerText = user.Submitrequest_ID ; 
        row.insertCell(1).innerText = user.Address ;  
        row.insertCell(2).innerText = user.Square_Feet ;     
        row.insertCell(3).innerText = user.Price_Dollars; 
        const pictureCell = row.insertCell(4);

if (user.Driveway_Pictures) {
    const link = document.createElement('a');
    link.href = user.Driveway_Pictures;
    link.innerText = 'View Picture';
    link.target = '_blank';

    // Ensure the link is appended correctly
    pictureCell.appendChild(link);
} else {
    pictureCell.innerText = 'No picture available';
}
        row.insertCell(5).innerText = user.Note ;  
        row.insertCell(6).innerText = user.Tracking_Status ;     
        row.insertCell(7).innerText = user.user_id ; 
        const actionCell = row.insertCell(8);

        // Create the "Generate Quote" button
        const generateQuoteButton = document.createElement('button');
        generateQuoteButton.innerText = 'Generate Quote';
        generateQuoteButton.classList.add('generate-quote-btn');
        // Passing the Submitrequest_ID to the function
        generateQuoteButton.onclick = () => generateQuote(user.Submitrequest_ID);
    
        // Create the "Reject Request" button
        const rejectRequestButton = document.createElement('button');
        rejectRequestButton.innerText = 'Reject Request';
        rejectRequestButton.classList.add('reject-request-btn');
        // Passing the Submitrequest_ID to the function
        rejectRequestButton.onclick = () => rejectRequest(user.Submitrequest_ID);
    
        if (user.Tracking_Status === 'Requested') {
            generateQuoteButton.disabled = false;
            rejectRequestButton.disabled = false;
        } else {
            generateQuoteButton.disabled = true;
            rejectRequestButton.disabled = true;
        }

        // Append buttons to the action cell
        actionCell.appendChild(generateQuoteButton);
        actionCell.appendChild(rejectRequestButton);
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

        // Second fetch to get submitted requests
        const requestsResponse = await fetch('http://localhost:3000/cont_submitted_requests', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'  // Include session cookie
        });

        const requestsData = await requestsResponse.json();
        console.log(requestsData.data);
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
