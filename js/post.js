const APIKEY = "67a76d364d8744a119828030";
let accountstring = localStorage.getItem("user")
let account = JSON.parse(accountstring);
console.log(account)
let postcontentstring = sessionStorage.getItem("post")
let postcontent = JSON.parse(postcontentstring)
console.log(postcontent)
let heart = postcontent["_id"] in account["LikedPosts"]["posts"] ? "fas" : "far"
const reactivelikebutton = document.createElement("i");
reactivelikebutton.classList.add(heart, "fa-heart");
reactivelikebutton.addEventListener("click", (e) => {
    const counter = e.target.closest(".Likes").querySelector(".likecounter");
    let count = parseInt(counter.textContent);
    let postid = postcontent["_id"]
    if (e.target.classList.contains("far")) {
        count++;
        e.target.classList.remove("far");
        e.target.classList.add("fas");
        likePost(postid, count)
        updateliked(postid,1)
        e.target.style.color = "red";
        counter.textContent = count
        postcontent["Likes"] = count
        console.log(postcontent)

    } else {
        count--;
        e.target.classList.remove("fas");
        e.target.classList.add("far");
        e.target.style.color = "black";
        likePost(postid, count)
        updateliked(postid,0)
        counter.textContent = count
        postcontent["Likes"] = count
        console.log(postcontent)
    }
})
document.querySelector(".Likes").appendChild(reactivelikebutton)
Object.keys(postcontent).forEach(key => {
    const validKeys = ["Description", "Image", "Comments", "Title", "Likes", "Username"];
    if (validKeys.includes(key) ) {
        console.log(key)
        if (key == "Image") {
            let image = document.createElement("img")
            image.src = postcontent["Image"]
            document.querySelector(`.${key}`).appendChild(image)
        }
        else if (key == "Comments") {
            let nocom = Object.keys(postcontent[key]).length
            document.querySelector(".count").textContent = nocom == 1 ?`${nocom} Comment` : `${nocom} Comments` 
            let container = document.querySelector(".Comments")
            Object.keys(postcontent[key]).forEach(element => {
                let newdiv = document.createElement("div")
                newdiv.classList.add("comment")
                console.log(newdiv)
                let username = document.createElement("div")
                username.classList.add("Username")
                username.textContent = postcontent[key][element]["Username"]
                let text = document.createElement("div")
                text.classList.add("text")
                text.textContent = postcontent[key][element]["Contents"]
                newdiv.appendChild(username)
                newdiv.appendChild(text)
                container.appendChild(newdiv)
            })
        }
        else if(key == "Likes"){
            let count = document.createElement("div")
            count.classList.add("likecounter")
            count.textContent = postcontent[key]
            document.querySelector(`.${key}`).appendChild(count)
        }
        else {
            document.querySelector(`.${key}`).textContent = postcontent[key]
        }
    }
});
const textarea = document.getElementById("comment-input");

textarea.addEventListener("input", function () {
    this.style.height = "auto";  // Reset height to recalculate
    this.style.height = this.scrollHeight + "px";  // Expand based on content
});
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
            // If the response status isn't OK, throw an error
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();  // Parse the response as JSON
    })
    .then(data => {
        console.log("Post updated successfully", data);
    })
    .catch(error => {
        console.error("Error occurred:", error);
        // Handle errors here, for example, display an error message to the user
    });

}
function updateliked(postId,plus){
    let posts = account["LikedPosts"]["posts"]
    console.log(typeof postId)
    if(plus){
    posts[postId] = 1
    }
    else{
        delete posts[postId]
    }
    let jsondata = {
        "LikedPosts": {"posts":posts}
    };

    console.log(jsondata)
    let settings = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache"
        },
        body: JSON.stringify(jsondata)
    }
    fetch(`https://fedassg2-cd74.restdb.io/rest/account/${account["_id"]}`, settings)
    .then(response => {
        if (!response.ok) {
            // If the response status isn't OK, throw an error
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();  // Parse the response as JSON
    })
    .then(data => {
        console.log("liked posts updated successfully", data);
    })
    .catch(error => {
        console.error("Error occurred:", error);
        // Handle errors here, for example, display an error message to the user
    });
    account["LikedPosts"]["posts"] = posts
    localStorage.setItem("user",JSON.stringify(account));

}
