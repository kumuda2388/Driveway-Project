document.addEventListener('DOMContentLoaded', function() {
    // Get the form and input elements
    const registerForm = document.getElementById('signup-form');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const addressInput = document.getElementById('address');
    const cardName = document.getElementById("card_name");
    const cardNumber = document.getElementById("card_number");
    const expiryDate = document.getElementById("expiry_date");
    const cvv = document.getElementById("cvv");
    const phoneNumber = document.getElementById("phone_number");

    // Check if all elements are found
    if (registerForm && firstNameInput && lastNameInput && emailInput && passwordInput && addressInput && cardName && cardNumber && expiryDate && cvv && phoneNumber) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();  // Prevent form submission
      
            const data = {
                first_name: firstNameInput.value,
                last_name: lastNameInput.value,
                email: emailInput.value,
                password: passwordInput.value,
                address: addressInput.value,
                cardname:cardName.value,
                cardnumber:cardNumber.value,
                expirydate:expiryDate.value,
                cvv:cvv.value,
                phonenumber:phoneNumber.value
            };

            fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'  // Allow session cookies to be sent
            })
            .then(response => response.json())
            .then(data => {
                alert("signup successful! please signin");
                window.location.href = 'signin.html';  // Redirect to login page
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Please enter a email ID that is not used before');
              });
        });
    } else {
        console.error('Form or input elements not found!');
    }
});
