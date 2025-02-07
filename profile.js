document.addEventListener("DOMContentLoaded", function () {
    // Elements
    const accountUsernameInput = document.getElementById("account-username");
    const accountEmailInput = document.getElementById("account-email");
    const accountPhoneInput = document.getElementById("account-phone");
    const accountPasswordInput = document.getElementById("account-password");
    const accountAddressNameInput = document.getElementById("shipping-name");
    const accountAddressInput = document.getElementById("shipping-address");

    const APIKEY = "678b1d1a19b96a08c0af6336";
    const accountId = "67a36dd2f63b804800105dfe"; // Replace with the actual account ID from session/localStorage

    fetch(`https://fedassignment2-eef5.restdb.io/rest/account/${accountId}`, {
        method: 'GET',
        headers: {
            "x-apikey": APIKEY,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to load profile: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('API Response:', data); // Log the response to verify the structure

        const userProfile = data[0]; // Assuming only one profile is returned
        if (!userProfile) {
            throw new Error("Profile data not found.");
        }

        // Prefill the form fields with profile data as values (not placeholders)
        accountUsernameInput.value = userProfile.Username;
        accountEmailInput.value = userProfile.Email;
        accountPhoneInput.value = userProfile["Phone Number"];
        accountPasswordInput.value = ""; // Mask password field
        accountPasswordInput.placeholder = "********"; // Hide password for security

        // Address handling: Check if address exists in the profile data
        if ('Address' in userProfile) {
            accountAddressInput.value = userProfile.Address; // Set value if exists
        } else {
            accountAddressInput.value = ""; // Set empty value if not found
            accountAddressInput.placeholder = "Not set yet"; // Show placeholder if no address found
        }

        if ('Address Owner' in userProfile) {
            accountAddressNameInput.value = userProfile["Address Owner"]; // Set value if exists
        } else {
            accountAddressNameInput.value = ""; // Set empty value if not found
            accountAddressNameInput.placeholder = "Not set yet"; // Show placeholder if no address owner found
        }

        // Handle form submission to save changes
        document.getElementById("edit-signup-form").addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form from refreshing the page

            const updatedProfile = {
                _id: userProfile._id, // Keep the same ID to update the correct profile
                Username: accountUsernameInput.value || userProfile.Username, // Use current value if no input
                Email: accountEmailInput.value || userProfile.Email,
                "Phone Number": accountPhoneInput.value || userProfile["Phone Number"],
                Password: accountPasswordInput.value || userProfile.Password,
                Address: accountAddressInput.value || "", // Save empty if no address provided
                "Address Owner": accountAddressNameInput.value || "" // Save empty if no address owner provided
            };

            console.log('Updated Profile:', updatedProfile); // Log the updated profile

            // Save the updated profile to the backend
            saveProfile(updatedProfile);
        });
    })
    .catch(err => {
        console.error("Error loading profile data:", err);
        alert("Could not load profile data.");
    });

    // Function to save profile data to the API
    function saveProfile(updatedProfile) {
        fetch(`https://fedassignment2-eef5.restdb.io/rest/account/${updatedProfile._id}`, {
            method: 'PUT', // Use PUT for updating data
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': APIKEY,
            },
            body: JSON.stringify(updatedProfile),
        })
        .then(response => {
            console.log('Save Response:', response); // Log the response for debugging
            if (!response.ok) {
                throw new Error(`Failed to save profile: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Profile updated:", data);
            alert('Profile updated successfully!');
        })
        .catch(error => {
            console.error('Error saving profile:', error);
            alert('Error updating profile.');
        });
    }
});


// // --------------- Edit Account Details --------------- 
// const APIKEY = "678b1d1a19b96a08c0af6336"; 

// // Function to check if an account exists
// async function accountexists(number, email, username) {
//     const query = JSON.stringify({
//         $or: [
//             { "Email": email },
//             { "Phone Number": number },
//             { "Username": username }
//         ]
//     });

//     const response = await fetch(`https://fedassignment2-eef5.restdb.io/rest/account?q=${encodeURIComponent(query)}`, {
//         method: "GET",
//         headers: {
//             "x-apikey": APIKEY,
//         },
//     });

//     const data = await response.json();
//     return data.length > 0; // Returns true if found, false if not
// }

// // Function to update account details and add shipping address in one API call
// async function updateAccountAndShipping(accountId, email, phone, password, username, name, address) {
//     let jsondata = [
//         {
//             "method": "PUT",
//             "path": `/account/${accountId}`,
//             "data": {
//                 "Email": email,
//                 "Phone Number": phone,
//                 "Password": password,
//                 "Username": username
//             }
//         },
//         {
//             "method": "POST",
//             "path": `/shipping`,
//             "data": {
//                 "AccountId": accountId,
//                 "Name": name,
//                 "Address": address
//             }
//         }
//     ];

//     let settings = {
//         method: "POST", // Assuming the backend supports POST for batch updates
//         headers: {
//             "Content-Type": "application/json",
//             "x-apikey": APIKEY,
//             "Cache-Control": "no-cache"
//         },
//         body: JSON.stringify(jsondata)
//     };

//     try {
//         // Send both account update and shipping address update in a single call
//         const response = await fetch(`https://fedassignment2-eef5.restdb.io/rest/batch`, settings); // Assuming batch endpoint
//         if (!response.ok) {
//             throw new Error('Failed to update account and shipping address');
//         }
//         const data = await response.json();
//         console.log(data); // Log the response to verify

//         return data;
//     } catch (error) {
//         console.error("Error updating account and shipping address:", error);
//         alert("An error occurred while updating your account and shipping address. Please try again.");
//     }
// }

// // Edit account handler
// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("account-submit").addEventListener("click", async function (e) {
//         e.preventDefault();

//         let username = document.getElementById("account-username").value;
//         let contactEmail = document.getElementById("account-email").value;
//         let contactPhone = document.getElementById("account-phone").value;
//         let contactPassword = document.getElementById("account-password").value;
//         let name = document.getElementById("shipping-name").value;
//         let address = document.getElementById("shipping-address").value;

//         toggleLoadingScreen(true); // Show loading screen

//         // Check if account exists
//         const exists = await accountexists(parseInt(contactPhone), contactEmail, username);

//         if (exists) {
//             // Assuming the account ID can be fetched from the session or profile data
//             const userData = JSON.parse(localStorage.getItem("user")); // Fetch user data from localStorage
//             const accountId = userData._id; // Assuming user data contains the account ID

//             // Update account details and shipping address
//             const updatedData = await updateAccountAndShipping(accountId, contactEmail, parseInt(contactPhone), contactPassword, username, name, address);

//             // After updating, store the new user data and show success message
//             storeUser(updatedData);

//             alert("Account details and shipping address updated successfully!");
//             window.location.href = "profile.html"; // Redirect to profile page after successful update
//         } else {
//             document.getElementById("noaccount").style.display = "block";
//             setTimeout(function () {
//                 document.getElementById("noaccount").style.display = "none";
//             }, 3000);
//         }

//         toggleLoadingScreen(false); // Hide loading screen
//     });
// });

// // Function to store updated user data in localStorage
// function storeUser(data) {
//     localStorage.setItem("user", JSON.stringify(data[0])); // Store the updated user in localStorage
// }

// // Function to toggle loading screen visibility
// function toggleLoadingScreen(isVisible) {
//     const loadingScreen = document.getElementById("loadingscreen");
//     loadingScreen.style.display = isVisible ? "flex" : "none";
// }

