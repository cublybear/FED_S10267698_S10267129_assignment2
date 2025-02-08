export async function fetchUser() {
    // Retrieve the logged-in user ID from sessionStorage
    const loggedInUserId = sessionStorage.getItem("loggedInUserId");

    // If no logged-in user ID is found, return null
    if (!loggedInUserId) {
        console.error("No logged-in user ID found in session.");
        return { user: null };  // No user logged in
    }

    // Check if user data is already cached in sessionStorage
    let user = JSON.parse(sessionStorage.getItem("user"));

    // If the user is not cached or the cached user does not match the logged-in ID, fetch the data
    if (!user || user._id !== loggedInUserId) {
        try {
            // Fetch user data from the API, filtering by the logged-in user ID
            const userResponse = await fetch(`https://fedassg2-cd74.restdb.io/rest/account?q={"_id":"${loggedInUserId}"}`, {
                headers: { "x-apikey": "67a76d364d8744a119828030" } // Replace with your actual API key
            });

            if (!userResponse.ok) {
                throw new Error("Failed to fetch user data");
            }

            // Parse the response to get the user data
            const users = await userResponse.json();

            // Check if a user with the logged-in ID exists in the response
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

    // If user is already cached in sessionStorage and matches the logged-in user ID, return the cached user
    return { user };
}
