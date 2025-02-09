export async function fetchUser() {
    // Retrieve the logged-in username from sessionStorage
    let loggedInUsername = sessionStorage.getItem("username");

    // If username is not set or its length is greater than 1, default it to "hi"
    if (!loggedInUsername || loggedInUsername.length > 1) {
        loggedInUsername = "hi";
    }

    // Check if user data is already cached in sessionStorage
    let user = JSON.parse(sessionStorage.getItem("user"));

    // If the user is not cached or the cached user does not match the logged-in username, fetch the data
    if (!user || user.Username !== loggedInUsername) {
        try {
            // 1st API
            // const userResponse = await fetch(`https://fedassignment2-eef5.restdb.io/rest/account?q={"Username":"${loggedInUsername}"}`, {
            //     headers: { "x-apikey": "678b1d1a19b96a08c0af6336" } // Replace with your actual API key
            // });

            // 2nd API
            const userResponse = await fetch(`https://fedassg-78fe.restdb.io/rest/account?q={"Username":"${loggedInUsername}"}`, {
                headers: { "x-apikey": "67a6f93e76011910f95afd4b" } // Replace with your actual API key
            });

            // 3rd API 
            // const userResponse = await fetch(`https://fedassg2-cd74.restdb.io/rest/account?q={"Username":"${loggedInUsername}"}`, {
            //     headers: { "x-apikey": "67a76d364d8744a119828030" } // Replace with your actual API key
            // });

            if (!userResponse.ok) {
                throw new Error("Failed to fetch user data");
            }

            // Parse the response to get the user data
            const users = await userResponse.json();

            // Check if a user with the logged-in username exists in the response
            if (users.length === 0) {
                console.error("Logged-in user not found.");
                return { user: null };
            }

            // Store the fetched user data in sessionStorage for future use
            user = users[0];  // Assuming the response contains an array with the user object

            sessionStorage.setItem("user", JSON.stringify(user));  // Cache user data in sessionStorage
            console.log("User data fetched:", user);

            return { user };  // Return the logged-in user's data

        } catch (error) {
            console.error("Error fetching user data:", error);
            return { user: null };  // Return null if there's an error
        }
    }

    // If user is already cached in sessionStorage and matches the logged-in username, return the cached user
    return { user };
}
