document.addEventListener('DOMContentLoaded', function () {
    // Check if the user is logged in as soon as the page loads
    fetch('http://localhost:3000/home_admin', {
        method: 'GET',
        credentials: 'include'  // Include session cookie in the request
    })
    .then(response => {
        if (response.ok) {
            return response.json();  // User is authenticated, process the response
        } else {
            throw new Error('You must be logged in to access the home page.');
        }
    })
    .then(data => {
        // If the user is logged in, handle the response and show user data
        //alert("logged in!");
        // You could add any other personalized information here
    })
    .catch(error => {
        // If the user is not logged in, display the login prompt
        alert("Please sign with admin crednetials to continue");
        window.location.href = 'signin_admin.html';
    });

    // Add logout functionality if needed
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            logout();
        });
    } else {
        console.error('Logout button not found.');
    }
});

// Logout function to send the request to the server and destroy the session
function logout() {
    fetch('http://localhost:3000/logout', {
        method: 'GET',
        credentials: 'include'  // Include session cookie in the request
    })
    .then(response => {
        if (response.ok) {
            window.location.href = 'signin_admin.html';  // Redirect to login page after logout
        } else {
            alert('Logout failed, please try again!');
        }
    })
    .catch(error => {
        console.error('Error logging out:', error);
        alert('An error occurred during logout.');
    });
}
