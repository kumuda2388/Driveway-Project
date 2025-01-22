document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    const passwordForm = document.getElementById('change-password');
    const currentpassword = document.getElementById('current_password');
    const newpassword = document.getElementById('new_password');
    const email = document.getElementById('passwordchange-email');
    // Check if the elements exist before attaching event listener
    if (passwordForm && currentpassword && newpassword && email) {
        passwordForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const data = {
                email: email.value,
                currentpassword: currentpassword.value,
                newpassword: newpassword.value
            };

            fetch('http://localhost:3000/passwordchange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'  // Allow session cookies to be sent
            })
            .then(response => response.json())
            .then(data => {
                alert("password changed successfully! Please sign in to continue");
                window.location.href = 'signin.html';  // Redirect to home page
            })
            .catch(error => 
                {console.error('Error:', error);
                    alert("please enter a correct email and current password");
                });
        });
    } else {
        console.error('Form or input elements not found!');
    }
});
