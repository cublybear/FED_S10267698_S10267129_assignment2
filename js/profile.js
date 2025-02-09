import { fetchUser } from "./fetchUser.js";

document.addEventListener("DOMContentLoaded", async function () {
    const username = document.getElementById("profile-username");
    const accountUsernameInput = document.getElementById("account-username");
    const accountEmailInput = document.getElementById("account-email");
    const accountPhoneInput = document.getElementById("account-phone");
    const accountPasswordInput = document.getElementById("account-password");
    const accountAddressNameInput = document.getElementById("shipping-name");
    const accountAddressInput = document.getElementById("shipping-address");
    const addShippingNameInput = document.getElementById("add-shipping-name");
    const addShippingAddressInput = document.getElementById("add-shipping-address");

    const APIKEY = "678b1d1a19b96a08c0af6336";
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

            const response = await fetch(`https://fedassignment2-eef5.restdb.io/rest/account/${userProfile._id}`, {
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

            // Now update sessionStorage with the new profile data
            const updatedSessionData = {
                ...data,
                mockPoints: userProfile.mockPoints,
                likedPosts: userProfile.likedPosts
            };

            sessionStorage.setItem("userProfile", JSON.stringify(updatedSessionData));

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
            PrimaryAddress: accountAddressInput.value.trim() || userProfile.Address.split(",")[0],
            SecondaryAddress: addShippingAddressInput.value.trim() || userProfile.Address.split(",")[1],
            PrimaryAddressOwner: accountAddressNameInput.value.trim() || userProfile["Address Owner"].split(",")[0],
            SecondaryAddressOwner: addShippingNameInput.value.trim() || userProfile["Address Owner"].split(",")[1],
        };

        console.log('Updated Shipping Details:', updatedFields);
        await saveProfile(updatedFields);
    });

    // --------------- Delete account from database ---------------
    // Function to toggle the loading screen visibility
    function toggleLoadingScreen(isVisible) {
        const loadingScreen = document.getElementById("loadingscreen");
        if (loadingScreen) {
            loadingScreen.style.display = isVisible ? "flex" : "none";
        }
    }

    // Event listener for the delete account button
    document.getElementById("delete-account-btn").addEventListener("click", async function (e) {
        e.preventDefault();  // Prevent default form behavior

        // Retrieve the user data from sessionStorage
        let accountstring = sessionStorage.getItem("user");
        let account = accountstring ? JSON.parse(accountstring) : null;

        if (account) {
            const username = account.Username;  // Access the username directly
            console.log(`Deleting account for: ${username}`);

            toggleLoadingScreen(true);  // Show loading screen

            try {
                // Call delete account function using the username
                await deleteAccount(username);
                alert("Your account has been deleted.");
                window.location.href = "index.html";  // Redirect to homepage or login page after deletion
            } catch (error) {
                console.error("Error deleting account:", error);
                alert("An error occurred while deleting your account.");
            } finally {
                toggleLoadingScreen(false);  // Hide loading screen
            }
        } else {
            console.error("Account data not found.");
            alert("Account data not found.");
        }
    });

    // Function to delete the account based on the username
    async function deleteAccount(username) {
        if (!username) {
            console.error("Username is required to delete the account.");
            return;
        }

        // Set up the query to find the account by username
        let query = JSON.stringify({ "Username": username });

        try {
            // Send DELETE request to the server to remove the account
            let response = await fetch(`https://fedassignment2-eef5.restdb.io/rest/account?q=${encodeURIComponent(query)}`, {
                method: 'DELETE',
                headers: {
                    "x-apikey": APIKEY,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete account: ${response.statusText}`);
            }

            // Parse the response (optional, depending on API response)
            let data = await response.json();
            console.log('Account deleted:', data);

        } catch (error) {
            console.error("Error occurred while deleting account:", error);
            throw error;  // Re-throw error for further handling
        }
    }

    // --------------- Logout Button Fix ---------------
    const logoutButton = document.getElementById("logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            console.log("Logout button clicked!");
            logout();
        });
    } else {
        console.error("Logout button not found in the DOM.");
    }

    function logout() {
        console.log("Logging out...");

        // Clear all session storage
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("userProfile");

        // Redirect to login page
        window.location.href = "account.html";
    }
});
