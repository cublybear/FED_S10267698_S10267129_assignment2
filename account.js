// --------------- Toggle between Sign In and Sign Up Page --------------- 
var tabs = document.getElementsByClassName("account-page"); 
const APIKEY = "67a6f93e76011910f95afd4b"; 
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

// --------------- Create and store account in database --------------- 
function getAccounts(limit = 10) { 
    let settings = { 
        method: "GET", 
        headers: { 
            "Content-Type": "application/json", 
            "x-apikey": APIKEY, 
            "Cache-Control": "no-cache" 
        } 
    }; 
    fetch("https://fedassg-78fe.restdb.io/rest/account", settings) 
        .then(response => response.json()) 
        .then(data => { 
            console.log(data); 
        }); 
}; 

// Async to wait for return response 
async function accountexists(number, email,username) { 
    // Querying fields in database 
    const query = JSON.stringify({ // Parse ur query to query for email or phone number 
        $or: [ 
            { "Email": email }, 
            { "Phone Number": number }, 
            { "Username": username } 
        ] 
    }); 
    // Wait for response 
    const response = await fetch(`https://fedassg-78fe.restdb.io/rest/account?q=${encodeURIComponent(query)}`, { 
        method: "GET", 
        headers: { 
            "x-apikey": APIKEY, 
        }, 
    }); 
    // Wait for reponse to finish parsing 
    const data = await response.json()  
    return data.length > 0;  // Returns true if there is any found else false 
}

// Creates account 
async function createaccount(email, phone, password,username) {
    let jsondata = { 
        "Email": email, 
        "Phone Number": phone, 
        "Password": password, 
        "Username": username,
        "Moke Points": 0  // Set "Moke Points" to 0 when creating the account
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
 
    document.getElementById("signup-form").reset() 
    response = await fetch("https://fedassg-78fe.restdb.io/rest/account", settings) 
    data = await response.json() 
    console.log(data) 
    getAccounts(); // Refresh the account list 
}

async function signin(email, password){ 
    const query = JSON.stringify({ // Parse query for retieving account, all field need to be true to retieve. 
        $and: [ 
            { "Email": email }, 
            { "Password": password} 
        ] 
    }); 
    // Wait for response 
    const response = await fetch(`https://fedassg-78fe.restdb.io/rest/account?q=${encodeURIComponent(query)}`, { 
        method: "GET", 
        headers: { 
            "x-apikey": APIKEY, 
        }, 
    }); 
    // Wait for reponse to finish parsing 
    const data = await response.json() 
    if (!response.ok) { 
        throw new Error(`Error: ${response.status} ${response.statusText}`); 
    }  
    return data 
} 

function storeUser(data){ 
    sessionStorage.setItem("user",JSON.stringify(x[0])); 
} 
console.log(document.getElementById("account-signup-submit")) 

// --------------- Store account data in database --------------- 
document.addEventListener("DOMContentLoaded", function () { 
    getAccounts(); 
    // Add new contact event listener 
    document.getElementById("account-signup-submit").addEventListener("click", async function (e) { 
        e.preventDefault(); 
     
        // Get the form values 
        let username = document.getElementById("account-username").value; 
        let contactEmail = document.getElementById("account-email").value; 
        let contactPhone = document.getElementById("account-phone").value; 
        let contactPassword = document.getElementById("account-password").value; 
        document.getElementById("loadingscreen").style.display = "flex" // Shows loading screen to wait for check 
        exists = await accountexists(parseInt(contactPhone), contactEmail,username); // Checks if account exists with either phone or email 
        // After api call 
        if(!exists){ 
            await createaccount(contactEmail, parseInt(contactPhone), contactPassword,username) // Creates account if it doesnt exist 
            x = await signin(contactEmail,contactPassword) 
            storeUser(x) 
            window.location.href = "index.html" // Open tab on itself 
        } 
        else{ 
            document.getElementById("nocreate").style.display="block" 
            setTimeout(function(){ 
                document.getElementById("nocreate").style.display="none" 
            },3000) 
        } 
        document.getElementById("loadingscreen").style.display = "none" 
     
    }); 
    document.getElementById("account-signin-submit").addEventListener("click", async function (e) { 
        e.preventDefault(); 
     
        // Get the form values 
        let signinEmail = document.getElementById("signin-email").value; 
        let signinPassword = document.getElementById("signin-password").value; 
        document.getElementById("loadingscreen").style.display = "flex" // Shows loading screen to wait for check 
        exists = await accountexists(0, signinEmail); // Checks if account exists with either phone or email 
        
        // After api call 
        if(exists){ 
            x = await signin(signinEmail,signinPassword) 
            if(x.length!=0){ 
                storeUser(x) 
                window.location.href = "index.html" // Open tab on itself 
            } 
            else{ 
                document.getElementById("noaccount").style.display="block" 
                setTimeout(function(){ 
                    document.getElementById("noaccount").style.display="none" 
                },3000) 
            } 
        } 
        else{ 
            document.getElementById("noaccount").style.display="block" 
            setTimeout(function(){ 
                document.getElementById("noaccount").style.display="none" 
            },3000) 
        } 
        document.getElementById("loadingscreen").style.display = "none" 
    }); 
});