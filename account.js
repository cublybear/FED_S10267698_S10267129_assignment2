// --------------- Toggle between Sign In and Sign Up Page ---------------
var tabs = document.getElementsByClassName("account-page");
const APIKEY = "678b1d1a19b96a08c0af6336";
// Function to change the active tab
function changetab(name) {
    // Remove active class from all tabs
    for (let tab of tabs) {
        tab.classList.remove("active");
    }
    // Add active class to the selected tab
    document.getElementById(name).classList.add("active");
}

// Add event listeners to sign in and sign up links
const signinlink = document.querySelector('.signin-link');
const signuplink = document.querySelector('.signup-link');

// Example: Change tabs when these links are clicked
if (signinlink) {
    signinlink.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default anchor behavior
        changetab('signin');
    });
}

if (signuplink) {
    signuplink.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default anchor behavior
        changetab('signup');
    });
}

// --------------- Create and store account data in database ---------------
function getAccounts(limit = 10) {
    let settings = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache"
        }
    };
    fetch("https://fedassignment2-eef5.restdb.io/rest/account", settings)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
};

// Wait for return response
async function accountexists(number, email) {
    // Create a query object to search for user either by email or phone number
    const query = JSON.stringify({ 
        $or: [ // Check that at least one of these conditions is true
            { "Email": email },
            { "Phone Number": number }
        ]
    });
    // Wait for response
    const response = await fetch(`https://fedassignment2-eef5.restdb.io/rest/account?q=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
            "x-apikey": APIKEY,
        },
    });
    // Wait for reponse to finish parsing
    const data = await response.json()

    return data.length > 0; // Returns true if database contains matching records
}

// Create an account
function createaccount(username, email, phone, password) {
    let jsondata = {
        "Username": username,
        "Email": email,
        "Phone Number": phone,
        "Password": password,
    };

    console.log(jsondata)
    let settings = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache"
        },
        body: JSON.stringify(jsondata)
    };

    // Reset the signup form to clear all input fields
    document.getElementById("signup-form").reset()
    fetch("https://fedassignment2-eef5.restdb.io/rest/account", settings)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            getAccounts(); // Refresh the account list
        });
}
console.log(document.getElementById("account-signup-submit"))

document.addEventListener("DOMContentLoaded", function () {
    getAccounts();

    // Add new contact event listener
    document.getElementById("account-signup-submit").addEventListener("click", async function (e) {
        e.preventDefault();
    
        // Get the form values
        let contactUsername = document.getElementById("account-username").value;
        let contactEmail = document.getElementById("account-email").value;
        let contactPhone = document.getElementById("account-phone").value;
        let contactPassword = document.getElementById("account-password").value;
        document.getElementById("loadingscreen").style.display = "flex" // Shows loading screen to wait for check
        exists = await accountexists(contactPhone, contactEmail); // checks if account exists with either phone or email

        if(!exists){
            createaccount(contactUsername, contactEmail, contactPhone, contactPassword) // creates account if it doesnt exist
        }
        else{
            document.getElementById("nocreate").style.display="block"
            setTimeout(function(){
                document.getElementById("nocreate").style.display="none"
            },3000)
        }
        document.getElementById("loadingscreen").style.display = "none"
    });
});
