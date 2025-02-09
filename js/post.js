const APIKEY = "67a76d364d8744a119828030";

// Get user data from sessionStorage
let accountstring = sessionStorage.getItem("user");
let account = accountstring ? JSON.parse(accountstring) : null;  // Check if account exists

// Check if account object exists
if (account === null || !account.LikedPosts) {
    console.error("Account or LikedPosts data not found in sessionStorage.");
    // You can handle this case further (e.g., redirect to login or show a message)
} else {
    console.log(account);
    let postcontentstring = sessionStorage.getItem("post");
    let postcontent = postcontentstring ? JSON.parse(postcontentstring) : null;

    if (postcontent === null) {
        console.error("Post content not found in sessionStorage.");
        // Handle this case (e.g., redirect to the previous page)
    } else {
        console.log(postcontent);

        // Check if the post is liked by the user
        let heart = postcontent["_id"] in account["LikedPosts"]["posts"] ? "fas" : "far";

        // Create the like button and set up event listener
        const reactivelikebutton = document.createElement("i");
        reactivelikebutton.classList.add(heart, "fa-heart");

        reactivelikebutton.addEventListener("click", (e) => {
            const counter = e.target.closest(".Likes").querySelector(".likecounter");
            let count = parseInt(counter.textContent);
            let postid = postcontent["_id"];

            // Handle like/unlike logic
            if (e.target.classList.contains("far")) {
                count++;
                e.target.classList.remove("far");
                e.target.classList.add("fas");
                likePost(postid, count);
                updateliked(postid, 1);
                e.target.style.color = "red";
                counter.textContent = count;
                postcontent["Likes"] = count;
                console.log(postcontent);
            } else {
                count--;
                e.target.classList.remove("fas");
                e.target.classList.add("far");
                e.target.style.color = "black";
                likePost(postid, count);
                updateliked(postid, 0);
                counter.textContent = count;
                postcontent["Likes"] = count;
                console.log(postcontent);
            }
        });

        // Append the like button to the Likes container
        document.querySelector(".Likes").appendChild(reactivelikebutton);

        // Loop through the post content and display it dynamically
        Object.keys(postcontent).forEach(key => {
            const validKeys = ["Description", "Image", "Comments", "Title", "Likes", "Username"];

            if (validKeys.includes(key)) {
                console.log(key);

                // Handle image
                if (key == "Image") {
                    let image = document.createElement("img");
                    image.src = postcontent["Image"];
                    document.querySelector(`.${key}`).appendChild(image);
                }
                // Handle comments
                else if (key == "Comments") {
                    let nocom = Object.keys(postcontent[key]).length;
                    document.querySelector(".count").textContent = nocom == 1 ? `${nocom} Comment` : `${nocom} Comments`;
                    let container = document.querySelector(".Comments");
                    Object.keys(postcontent[key]).forEach(element => {
                        let newdiv = document.createElement("div");
                        newdiv.classList.add("comment");
                        console.log(newdiv);

                        // Create and append username
                        let username = document.createElement("div");
                        username.classList.add("Username");
                        username.textContent = postcontent[key][element]["Username"];

                        // Create and append comment text
                        let text = document.createElement("div");
                        text.classList.add("text");
                        text.textContent = postcontent[key][element]["Contents"];

                        // Append comment elements
                        newdiv.appendChild(username);
                        newdiv.appendChild(text);
                        container.appendChild(newdiv);
                    });
                }
                // Handle likes
                else if (key == "Likes") {
                    let count = document.createElement("div");
                    count.classList.add("likecounter");
                    count.textContent = postcontent[key];
                    document.querySelector(`.${key}`).appendChild(count);
                }
                // Handle other fields like Title, Description, Username
                else {
                    document.querySelector(`.${key}`).textContent = postcontent[key];
                }
            }
        });

        // Adjust the textarea height dynamically based on input
        const textarea = document.getElementById("comment-input");

        textarea.addEventListener("input", function () {
            this.style.height = "auto";  // Reset height to recalculate
            this.style.height = this.scrollHeight + "px";  // Expand based on content
        });

        // Function to update likes on the server
        function likePost(postId, likes) {
            const data = JSON.stringify({
                Likes: likes  // The field you want to update
            });

            // Send the request with custom headers (including the API key)
            fetch(`https://fedassg2-cd74.restdb.io/rest/community/${postId}`, {
                method: "PATCH",  
                body: data,
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,  // API key in the header
                    "Cache-Control": "no-cache"  // Optional, prevents caching
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();  // Parse the response as JSON
            })
            .then(data => {
                console.log("Post updated successfully", data);
            })
            .catch(error => {
                console.error("Error occurred:", error);
            });
        }

        // Function to update the liked posts in the user's account
        function updateliked(postId, plus) {
            let posts = account["LikedPosts"]["posts"];
            console.log(typeof postId);
            
            // Update liked posts
            if (plus) {
                posts[postId] = 1;
            } else {
                delete posts[postId];
            }

            let jsondata = {
                "LikedPosts": { "posts": posts }
            };

            console.log(jsondata);

            // Send the updated data to the server
            let settings = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify(jsondata)
            };

            fetch(`https://fedassg2-cd74.restdb.io/rest/account/${account["_id"]}`, settings)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log("Liked posts updated successfully", data);
            })
            .catch(error => {
                console.error("Error occurred:", error);
            });

            // Update the account in session storage
            account["LikedPosts"]["posts"] = posts;
            sessionStorage.setItem("user", JSON.stringify(account));
        }
    }
}
