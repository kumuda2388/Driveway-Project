  //function to display query results
function displayResults(users) {
    //if query result is empty then it shows below alert
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

// Debugging step
console.log('Link URL:', user.Driveway_Pictures);
        row.insertCell(5).innerText = user.Note ;  
        row.insertCell(6).innerText = user.Tracking_Status ;     
        row.insertCell(7).innerText = user.user_id ; 
        row.insertCell(8).innerText = user.Note_from_contractor ;
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // First fetch to check if the user is authenticated
        const authResponse = await fetch('http://localhost:3000/home', {
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
        const requestsResponse = await fetch('http://localhost:3000/cost_submitted_requests', {
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
        alert("Please sign in with correct credentials to continue.");
        window.location.href = 'signin.html'; // Redirect to login page
    }

    // Now add event listeners after DOM is fully loaded
    const raiseRequestButton = document.getElementById('raise_request'); // Select the button
    const propertyForm = document.getElementById('propertyForm'); // Get the form element

    raiseRequestButton.addEventListener('click', () => {
        // Toggle the display of the form
        if (propertyForm.style.display === 'none') {
            propertyForm.style.display = 'block';  // Show the form
        } else {
            propertyForm.style.display = 'none';  // Hide the form
        }
    });

    // Handle form submission
    propertyForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Get all input elements, including textareas and file inputs
        const address = document.getElementById('address').value;
        const squareFeet = document.getElementById('squareFeet').value;
        const price = document.getElementById('price').value;
        const note = document.getElementById('note').value;
        //const picture1 = document.getElementById('picture1').files[0];
        //const picture2 = document.getElementById('picture2').files[0];
        //const picture3 = document.getElementById('picture3').files[0];
        //const picture4 = document.getElementById('picture4').files[0];
        //const picture5 = document.getElementById('picture5').files[0];

        // Prepare the form data object to send to the server
        const data_new = {
            address: address,
            squareFeet: squareFeet,
            price: price,
            note: note,
            pictures: "https://imgur.com/a/IVFEz4t"
        };
        try {
            // Send the data to the backend
            const response = await fetch('http://localhost:3000/cost_submit_request_form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data_new),
                credentials: 'include'
            });

            const result = await response.json();

            if (response.ok) {
                alert('request submitted!');
                window.location.reload();
            } else {
                alert('Error: ' + (result.message || 'Failed to generate a submit request.'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the request.');
        }
    });

});
