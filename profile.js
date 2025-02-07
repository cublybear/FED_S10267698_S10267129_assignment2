document.addEventListener("DOMContentLoaded", async function () {
    // Elements
    const accountUsernameInput = document.getElementById("account-username");
    const accountEmailInput = document.getElementById("account-email");
    const accountPhoneInput = document.getElementById("account-phone");
    const accountPasswordInput = document.getElementById("account-password");
    const accountAddressNameInput = document.getElementById("shipping-name");
    const accountAddressInput = document.getElementById("shipping-address");

    const APIKEY = "678b1d1a19b96a08c0af6336";
    const accountId = "67a36dd2f63b804800105dfe"; // Replace with actual session/localStorage ID

    let userProfile = null; // Store fetched profile

    try {
        // Fetch user data
        const response = await fetch(`https://fedassignment2-eef5.restdb.io/rest/account/${accountId}`, {
            method: 'GET',
            headers: { "x-apikey": APIKEY },
        });

        if (!response.ok) throw new Error(`Failed to load profile: ${response.statusText}`);

        userProfile = await response.json();
        console.log("API Response:", userProfile);

        if (!userProfile || !userProfile._id) throw new Error("Profile data not found.");

        // Assign values safely
        accountUsernameInput.value = userProfile.Username || "";
        accountEmailInput.value = userProfile.Email || "";
        accountPhoneInput.value = userProfile["Phone Number"] || "";
        accountPasswordInput.placeholder = "********"; // Don't pre-fill passwords
        accountAddressInput.value = userProfile.Address || "";
        accountAddressNameInput.value = userProfile["Address Owner"] || "";

    } catch (err) {
        console.error("Error loading profile data:", err);
    }

    async function saveProfile(updatedFields) {
        try {
            if (!userProfile || !userProfile._id) {
                throw new Error("User profile ID is missing.");
            }

            // Make sure all fields are included in the updated profile
            const updatedProfile = {
                _id: userProfile._id,
                Username: updatedFields.Username || userProfile.Username,
                Email: updatedFields.Email || userProfile.Email,
                "Phone Number": updatedFields["Phone Number"] || userProfile["Phone Number"],
                Password: updatedFields.Password || userProfile.Password,
                Address: updatedFields.Address || userProfile.Address,
                "Address Owner": updatedFields["Address Owner"] || userProfile["Address Owner"]
            };

            console.log("Sending to API:", JSON.stringify(updatedProfile, null, 2));

            const response = await fetch(`https://fedassignment2-eef5.restdb.io/rest/account/${updatedProfile._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': APIKEY,
                },
                body: JSON.stringify(updatedProfile),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save profile: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Profile updated:", data);
            alert('Profile updated successfully!');
            return data;
        } catch (error) {
            console.error('Error saving profile:', error);
            alert(`Error updating profile: ${error.message}`);
        }
    }

    // Handle account details form submission
    document.getElementById("edit-acc").addEventListener("submit", async function (event) {
        event.preventDefault();

        const updatedFields = {
            Username: accountUsernameInput.value.trim() || userProfile.Username, // Ensure Username is never empty
            Email: accountEmailInput.value.trim() || userProfile.Email, // Ensure Email is never empty
            "Phone Number": accountPhoneInput.value.trim() || userProfile["Phone Number"], // Ensure Phone Number is never empty
        };

        // Only update password if user enters a new one
        if (accountPasswordInput.value.trim()) {
            updatedFields.Password = accountPasswordInput.value.trim();
        } else {
            updatedFields.Password = userProfile.Password; // Ensure Password is never empty
        }

        console.log('Updated Account Details:', updatedFields);
        await saveProfile(updatedFields);
    });

    // Handle shipping details form submission
    document.getElementById("edit-shipping").addEventListener("submit", async function (event) {
        event.preventDefault();

        const updatedFields = {
            Address: accountAddressInput.value.trim() || userProfile.Address, // Ensure Address is never empty
            "Address Owner": accountAddressNameInput.value.trim() || userProfile["Address Owner"], // Ensure Address Owner is never empty
        };

        console.log('Updated Shipping Details:', updatedFields);
        await saveProfile(updatedFields);
    });
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

