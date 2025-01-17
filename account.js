// --------------------------- Account Page -------------------------------
var tabs = document.getElementsByClassName("account-page");

// Function to change the active tab
function changetab(name){
    // Remove active class from all tabs
    for (let tab of tabs){
        tab.classList.remove("active");
    }
    // Add active class to the selected tab
    document.getElementById(name).classList.add("active");
}

// Add event listeners to sign in and sign up links
const signinlink = document.querySelector('.signin-link');
const signuplink = document.querySelector('.signup-link');

// Example: Change tabs when these links are clicked
if (signinlink){
    signinlink.addEventListener('click', function(event){
        event.preventDefault(); // Prevent default anchor behavior
        changetab('signin');
    });
}

if (signuplink){
    signuplink.addEventListener('click', function(event){
        event.preventDefault(); // Prevent default anchor behavior
        changetab('signup');
    });
}
