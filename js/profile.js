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

    const APIKEY = "67a6f93e76011910f95afd4b";
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

            const response = await fetch(`https://fedassg-78fe.restdb.io/rest/account/${userProfile._id}`, {
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
    function toggleLoadingScreen(isVisible) {
        const loadingScreen = document.getElementById("loadingscreen");
        if (loadingScreen) {
            loadingScreen.style.display = isVisible ? "flex" : "none";
        }
    }

    async function deleteaccount(email, phone, password, username) {
        let query = JSON.stringify({
            $and: [
                { "Email": email },
                { "Phone Number": phone },
                { "Username": username }
            ]
        });

        let response = await fetch(`https://fedassg-78fe.restdb.io/rest/account?q=${encodeURIComponent(query)}`, {
            method: 'DELETE',
            headers: {
                "x-apikey": APIKEY,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete account: ${response.statusText}`);
        }

        let data = await response.json();
        console.log('Account deleted:', data);
    }

    document.getElementById("delete-account-btn").addEventListener("click", async function (e) {
        e.preventDefault(); // Prevent default form behavior

        const email = accountEmailInput.value;
        const phone = accountPhoneInput.value;
        const password = accountPasswordInput.value;
        const username = accountUsernameInput.value;

        toggleLoadingScreen(true);

        try {
            await deleteaccount(email, phone, password, username);
            alert("Your account has been deleted.");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("An error occurred while deleting your account.");
        } finally {
            toggleLoadingScreen(false);
        }
    });

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
