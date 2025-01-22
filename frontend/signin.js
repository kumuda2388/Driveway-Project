document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const signinForm = document.getElementById('sign-in-form');
    const emailInput = document.getElementById('signin-email');
    const passwordInput = document.getElementById('signin-password');

    // Check if the elements exist before attaching event listener
    if (signinForm && emailInput && passwordInput) {
        signinForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const data = {
                email: emailInput.value,
                password: passwordInput.value
            };

            fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'  // Allow session cookies to be sent
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.href = 'home_customer.html';  // Redirect to home page
            })
            .catch(error => 
                {console.error('Error:', error);
                    alert("please enter a valid username or password");
                });
        });
    } else {
        console.error('Form or input elements not found!');
    }
});
