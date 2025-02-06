// --------------- Edit Account Details --------------- 
// Function to check if an account exists
const APIKEY = "678b1d1a19b96a08c0af6336"; 
async function accountexists(number, email, username) {
    const query = JSON.stringify({
        $or: [
            { "Email": email },
            { "Phone Number": number },
            { "Username": username }
        ]
    });

    const response = await fetch(`https://fedassignment2-eef5.restdb.io/rest/account?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
            "x-apikey": APIKEY,
        },
    });

    const data = await response.json();
    return data.length > 0; // Returns true if found, false if not
}

// Function to update the account details
async function updateAccountDetails(accountId, email, phone, password, username) {
    let jsondata = {
        "Email": email,
        "Phone Number": phone,
        "Password": password,
        "Username": username
    };

    let settings = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache"
        },
        body: JSON.stringify(jsondata)
    };

    // Update account in the database
    const response = await fetch(`https://fedassignment2-eef5.restdb.io/rest/account/${accountId}`, settings);
    const data = await response.json();
    console.log(data); // Log the response to verify

    return data;
}

// Edit account handler
document.addEventListener("DOMContentLoaded", function () {
    // Add event listener for editing account
    document.getElementById("account-submit").addEventListener("click", async function (e) {
        e.preventDefault();

        let username = document.getElementById("account-username").value;
        let contactEmail = document.getElementById("account-email").value;
        let contactPhone = document.getElementById("account-phone").value;
        let contactPassword = document.getElementById("account-password").value;

        document.getElementById("loadingscreen").style.display = "flex"; // Show loading screen

        // Check if account exists
        const exists = await accountexists(parseInt(contactPhone), contactEmail, username);

        if (exists) {
            // Assuming the account ID can be fetched from the session or profile data
            const userData = JSON.parse(localStorage.getItem("user")); // Fetch user data from localStorage
            const accountId = userData._id; // Assuming user data contains the account ID

            // Update account details
            const updatedAccount = await updateAccountDetails(accountId, contactEmail, parseInt(contactPhone), contactPassword, username);

            // After updating the account, store the new user data and show success message
            storeUser(updatedAccount);

            alert("Account details updated successfully!");
            window.location.href = "profile.html"; // Redirect to profile page after successful update
        } else {
            document.getElementById("noaccount").style.display = "block";
            setTimeout(function () {
                document.getElementById("noaccount").style.display = "none";
            }, 3000);
        }

        document.getElementById("loadingscreen").style.display = "none"; // Hide loading screen
    });
});

// Function to store updated user data in localStorage
function storeUser(data) {
    localStorage.setItem("user", JSON.stringify(data[0])); // Store the updated user in localStorage
}


// --------------- Edit payment details --------------- 


// --------------- Add address --------------- 