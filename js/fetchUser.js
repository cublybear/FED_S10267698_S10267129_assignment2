export async function fetchUser() {
    // Default the logged-in username to "admin" (no need for length check)
    let loggedInUsername = sessionStorage.getItem("Username") || "admin";

    // Check if user data is already cached in sessionStorage
    let user = JSON.parse(sessionStorage.getItem("user"));

    // If the user is not cached or the cached user does not match the logged-in username, fetch the data
    if (!user || user.Username !== loggedInUsername) {
        try {
            // 1st API
            const userResponse = await fetch(`https://fedassignment2-eef5.restdb.io/rest/account?q={"Username":"${loggedInUsername}"}`, {
                headers: { "x-apikey": "678b1d1a19b96a08c0af6336" } // Replace with your actual API key
            });

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

