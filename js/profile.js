import { fetchUser } from "./fetchUser.js";

document.addEventListener("DOMContentLoaded", async function () {
    // Elements
    const username = document.getElementById("profile-username");
    const accountUsernameInput = document.getElementById("account-username");
    const accountEmailInput = document.getElementById("account-email");
    const accountPhoneInput = document.getElementById("account-phone");
    const accountPasswordInput = document.getElementById("account-password");
    const accountAddressNameInput = document.getElementById("shipping-name");
    const accountAddressInput = document.getElementById("shipping-address");
    const addShippingNameInput = document.getElementById("add-shipping-name");
    const addShippingAddressInput = document.getElementById("add-shipping-address");

    const APIKEY = "67a76d364d8744a119828030";

    let userProfile = null;

    try {
        // Fetch the user profile data using fetchUser function
        const { user } = await fetchUser();

        if (!user) {
            throw new Error("Profile data not found.");
        }

        userProfile = user;

        console.log("Loaded Profile:", userProfile);

        // Assign values safely to the form fields
        username.textContent = userProfile.Username || "User"; // Default to "User" if username is missing
        accountUsernameInput.value = userProfile.Username || "";
        accountEmailInput.value = userProfile.Email || "";
        accountPhoneInput.value = userProfile["Phone Number"] || "";
        accountPasswordInput.placeholder = "********"; // Don't pre-fill passwords

        // Handle multiple addresses
        const addresses = userProfile.Address.split(",");
        accountAddressInput.value = addresses[0] || ""; // Primary Address
        addShippingAddressInput.value = addresses[1] || ""; // Secondary Address

        // Handle multiple address owners
        const owners = userProfile["Address Owner"].split(",");
        accountAddressNameInput.value = owners[0] || ""; // Primary Address Owner
        addShippingNameInput.value = owners[1] || ""; // Secondary Address Owner

    } catch (err) {
        console.error("Error loading profile data:", err);
    }

    async function saveProfile(updatedFields) {
        try {
            if (!userProfile || !userProfile._id) {
                throw new Error("User profile ID is missing.");
            }

            const updatedProfile = {
                _id: userProfile._id,
                Username: updatedFields.Username || userProfile.Username,
                Email: updatedFields.Email || userProfile.Email,
                "Phone Number": updatedFields["Phone Number"] || userProfile["Phone Number"],
                Password: updatedFields.Password || userProfile.Password,
                "Address Owner": `${updatedFields.PrimaryAddressOwner || userProfile["Address Owner"].split(",")[0]}, ${updatedFields.SecondaryAddressOwner || userProfile["Address Owner"].split(",")[1]}`,
                Address: `${updatedFields.PrimaryAddress || userProfile.Address.split(",")[0]}, ${updatedFields.SecondaryAddress || userProfile.Address.split(",")[1]}`
            };

            console.log("Sending to API:", JSON.stringify(updatedProfile, null, 2));

            const response = await fetch(`https://fedassg2-cd74.restdb.io/rest/account/${userProfile._id}`, {
                method: 'PATCH',
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


            // Now update sessionStorage with the new profile data, including mock points and liked posts
            const updatedSessionData = {
                ...data,
                mockPoints: userProfile.mockPoints,
                likedPosts: userProfile.likedPosts
            };

            // Save the updated user profile to sessionStorage
            sessionStorage.setItem("userProfile", JSON.stringify(updatedSessionData));

            // Retrieve the updated data from sessionStorage and log it
            const storedProfile = sessionStorage.getItem("userProfile");
            console.log("Updated Profile stored in sessionStorage:", storedProfile);


            return data;

        } catch (error) {
            console.error('Error saving profile:', error);
        }
    }


    // Handle shipping details form submission
    document.getElementById("edit-shipping").addEventListener("submit", async function (event) {
        event.preventDefault();

        const updatedFields = {
            PrimaryAddress: accountAddressInput.value.trim() || userProfile.Address.split(",")[0], // Ensure Primary Address is never empty
            SecondaryAddress: addShippingAddressInput.value.trim() || userProfile.Address.split(",")[1], // Ensure Secondary Address is never empty
            PrimaryAddressOwner: accountAddressNameInput.value.trim() || userProfile["Address Owner"].split(",")[0], // Ensure Primary Address Owner is never empty
            SecondaryAddressOwner: addShippingNameInput.value.trim() || userProfile["Address Owner"].split(",")[1], // Ensure Secondary Address Owner is never empty
        };

        console.log('Updated Shipping Details:', updatedFields);
        await saveProfile(updatedFields);
    });
});

// Function to toggle loading screen visibility
function toggleLoadingScreen(isVisible) {
    const loadingScreen = document.getElementById("loadingscreen");
    loadingScreen.style.display = isVisible ? "flex" : "none";
}

// --------------- Delete account from database --------------- 
// Delete account 
async function deleteaccount(email, phone, password, username) {
    let jsondata = { 
        "Email": email, 
        "Phone Number": phone, 
        "Password": password, 
        "Username": username,
    };

    console.log(jsondata); 
    
    let settings = { 
        method: "DELETE",  // Change method to DELETE
        headers: { 
            "Content-Type": "application/json", 
            "x-apikey": APIKEY, 
            "Cache-Control": "no-cache" 
        }, 
        body: JSON.stringify(jsondata) // You might need to pass the identifier to delete an account (ID or Email)
    }; 
    
    // Reset form (optional)
    document.getElementById("signup-form").reset();
    
    // Make the DELETE request
    response = await fetch("https://fedassg2-cd74.restdb.io/rest/account", settings); 
    
    data = await response.json();
    console.log(data); 
    
    if (response.ok) {
        alert("Account successfully deleted.");
    } else {
        alert("Error deleting account.");
    }
    
    getAccounts(); // Refresh the account list after deletion
}

// Modify the DOM event to delete the account (in your event listener part)
document.addEventListener("DOMContentLoaded", function () {
    getAccounts();
    
    // Add delete account event listener
    document.getElementById("delete").addEventListener("click", async function (e) {
        e.preventDefault();

        document.getElementById("loadingscreen").style.display = "flex"; // Shows loading screen to wait
        
        exists = await accountexists(parseInt(contactPhone), contactEmail, username); // Check if account exists
        
        if (exists) {
            // Call the delete function
            await deleteaccount(contactEmail, parseInt(contactPhone), contactPassword, username);
            window.location.href = "index.html"; // Redirect after deletion
        } else {
            document.getElementById("nocreate").style.display = "block"; 
            setTimeout(function() {
                document.getElementById("nocreate").style.display = "none";
            }, 3000);
        }
        
        document.getElementById("loadingscreen").style.display = "none"; 
    });
});


// Logout button event listener
document.getElementById("logout").addEventListener("click", function () {
    logout();  // Call the logout function
});
// Logout function
function logout() {
    // Clear session storage (to remove logged-in user data)
    sessionStorage.removeItem("user");

    // Redirect to the login page
    window.location.href = "account.html";
}
