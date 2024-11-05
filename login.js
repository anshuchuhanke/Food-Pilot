
    document.addEventListener("DOMContentLoaded", function() {
        const form = document.querySelector("form");
        const phoneInput = document.querySelector("input[type='tel']");
        const phoneSelect = document.querySelector("select");
        const emailButton = document.querySelector(".email-button");
        const googleButton = document.querySelector(".google-button");

        // Handle phone OTP form submission
        form.addEventListener("submit", async function(event) {
            event.preventDefault(); // Prevent the form from submitting normally

            const phoneNumber = phoneSelect.value + phoneInput.value.trim();

            if (phoneInput.value.trim() === "") {
                alert("Please enter your phone number.");
                return;
            }

            try {
                // Simulate sending OTP by making an API call to your backend service
                const response = await fetch('/api/send-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ phoneNumber })
                });

                if (response.ok) {
                    alert(`A one-time password has been sent to ${phoneNumber}.`);
                } else {
                    const errorData = await response.json();
                    alert(`Failed to send OTP: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error sending OTP:', error);
                alert('An error occurred while sending the OTP. Please try again.');
            }
        });

        // Handle "Continue with Email" button click
        emailButton.addEventListener("click", function() {
            const email = prompt("Please enter your email:");

            if (!email || !validateEmail(email)) {
                alert("Please enter a valid email.");
                return;
            }

            // Make an API call to send a magic link or OTP for email-based login
            fetch('/api/send-email-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })
            .then(response => response.ok ? alert(`A verification link has been sent to ${email}.`) : response.json().then(data => alert(`Error: ${data.message}`)))
            .catch(error => {
                console.error('Error sending email:', error);
                alert('An error occurred while sending the email. Please try again.');
            });
        });

        // Handle Google Sign-In button click
        googleButton.addEventListener("click", function() {
            gapi.load('auth2', function() {
                const auth2 = gapi.auth2.init({
                    client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual client ID
                    cookiepolicy: 'single_host_origin',
                });

                auth2.signIn().then(async function(googleUser) {
                    const idToken = googleUser.getAuthResponse().id_token;

                    try {
                        const response = await fetch('/api/google-login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ idToken })
                        });

                        if (response.ok) {
                            alert('Google login successful!');
                        } else {
                            const errorData = await response.json();
                            alert(`Google login failed: ${errorData.message}`);
                        }
                    } catch (error) {
                        console.error('Error during Google login:', error);
                        alert('An error occurred during Google login.');
                    }
                });
            });
        });

        // Utility function to validate email format
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    });



