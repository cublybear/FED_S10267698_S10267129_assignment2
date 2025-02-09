let accountString = sessionStorage.getItem("user");
let account = accountString ? JSON.parse(accountString) : null;
const APIKEY = "67a6f93e76011910f95afd4b";
const container = document.querySelector(".community-post-container");
const images = [
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747239/m-beigeshirt_zgkhmn.jpg",
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747239/m-washedhoodie_oxlezq.jpg",
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747238/m-cargodenimtrousers_pnysyx.jpg",
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747239/w-waistcoatdress1_haoz5s.jpg",
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747239/w-softcheckminiskirt_dvt19o.jpg",
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747238/w-denimtrousers_kw3z2y.jpg",
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747239/w-straplessmididress_y8zctm.jpg",
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747239/w-beltedribbedshirt_ipisyy.jpg",
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747239/w-denimeffectjacket_okaxkc.jpg",
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747238/w-ribbedtop_zo36sl.jpg",
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747238/k-heartcollardress_i8bmou.jpg",
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747238/k-kidsprintedshirt_ux6k8g.jpg",
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747237/a-elegantgoldnecklace_xhtjsi.jpg",
    "https://res.cloudinary.com/dqgaw5bri/image/upload/v1738747237/a-blackleatherbelt_nwzppg.jpg"
];

function getRandomImage() {
    return images[Math.floor(Math.random() * images.length)];
}

function gotopost(e) {
    if (e.target.closest(".likes") == null) {
        let postnum = parseInt(e.target.closest(".indivcon").id) - 1;
        let post = postcontent[postnum];
        post["Likes"] = parseInt(e.target.closest(".indivcon").querySelector(".likebutton .count").textContent);
        sessionStorage.setItem("post", JSON.stringify(post));
        window.location.href = `post.html`;
    }
}

// Function to check if session storage data is expired
function isDataExpired() {
    const expiryTime = 10 * 60 * 1000; // 10 minutes
    const storedTimestamp = sessionStorage.getItem("posts_timestamp");
    return !storedTimestamp || (Date.now() - storedTimestamp > expiryTime);
}

// Function to fetch posts from API
async function fetchPosts() {
    const response = await fetch("https://fedassg-78fe.restdb.io/rest/community", {
        method: "GET",
        headers: { "x-apikey": APIKEY },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    sessionStorage.setItem("posts", JSON.stringify(data));  // Save data
    sessionStorage.setItem("posts_timestamp", Date.now());  // Save timestamp
    return data;
}

// Function to get posts (from session storage if available)
async function getposts() {
    let storedData = sessionStorage.getItem("posts");

    if (storedData && !isDataExpired()) {
        console.log("Using cached posts from session storage");
        return JSON.parse(storedData);
    } else {
        console.log("Fetching posts from API");
        return await fetchPosts();
    }
}

let postcontent = await getposts();
postcontent.forEach(element => element["Image"] = getRandomImage());

function createpost(postData, container) {
    const postdiv = document.createElement("div");
    postdiv.classList.add("indivcon");
    postdiv.id = `${postcontent.indexOf(postData) + 1}`;
    postdiv.style.display = "flex";
    postdiv.style.flexDirection = "column";
    postdiv.style.alignItems = "center";

    const postheader = document.createElement("div");
    postheader.classList.add("postheader");
    postheader.textContent = postData.Username;
    postheader.style.fontSize = "12px";
    postheader.style.color = "#757575";

    const postimage = document.createElement("div");
    const image = document.createElement("img");
    image.classList.add("image");
    image.src = postData.Image;
    postimage.appendChild(image);

    const postdesc = document.createElement("div");
    postdesc.classList.add("postdesc");
    postdesc.textContent = postData.Title;

    const likes = document.createElement("div");
    likes.classList.add("likes");

    const reactivelike = document.createElement("div");
    reactivelike.classList.add("likebutton");

    const reactivelikebutton = document.createElement("i");
    let heart = postData["_id"] in account.LikedPosts.posts ? "fas" : "far";
    reactivelikebutton.classList.add(heart, "fa-heart");

    const reactivelikecount = document.createElement("p");
    reactivelikecount.textContent = parseInt(postData.Likes);
    reactivelikecount.classList.add("count");

    reactivelike.appendChild(reactivelikebutton);
    reactivelike.appendChild(reactivelikecount);
    likes.appendChild(postheader);
    likes.appendChild(reactivelike);

    reactivelikebutton.addEventListener("click", (e) => {
        const counter = e.target.closest(".likebutton").querySelector(".count");
        let count = parseInt(counter.textContent);
        let postid = postcontent[e.target.closest(".indivcon").id - 1]["_id"];

        if (e.target.classList.contains("far")) {
            count++;
            e.target.classList.replace("far", "fas");
            e.target.style.color = "red";
        } else {
            count--;
            e.target.classList.replace("fas", "far");
            e.target.style.color = "black";
        }
        counter.textContent = count;
    });

    postdiv.appendChild(postimage);
    postdiv.appendChild(postdesc);
    postdiv.appendChild(likes);
    postdiv.addEventListener("click", gotopost);
    container.appendChild(postdiv);
}

function distributePosts() {
    document.querySelector(".community-post-container").innerHTML = ""; // Clear previous posts
    postcontent.forEach(post => createpost(post, container));
}

distributePosts();

// Popup event listeners
document.getElementById("blur").addEventListener("click", () => {
    document.getElementById("blur").style.display = "none";
    document.querySelector(".popup-box").style.display = "none";
});
document.getElementById("create-post-btn").addEventListener("click", () => {
    document.getElementById("blur").style.display = "flex";
    document.getElementById("popupbox").style.display = "flex";
});
document.getElementById("closepopup").addEventListener("click", () => {
    document.querySelector(".popup-box").style.display = "none";
    document.getElementById("blur").style.display = "none";
});


function likePost(postId, likes) {
    const data = JSON.stringify({
        Likes: likes
    });

    fetch(`https://fedassg-78fe.restdb.io/rest/community/${postId}`, {
        method: "PATCH",
        body: data,
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache"
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("Post updated successfully", data);
    })
    .catch(error => {
        console.error("Error occurred:", error);
    });
}

function updateliked(postId, plus) {
    let posts = account.LikedPosts.posts;

    if (plus) {
        posts[postId] = 1; // Mark post as liked
    } else {
        delete posts[postId]; // Remove the like
    }

    let jsondata = {
        "LikedPosts": { "posts": posts }
    };

    console.log(jsondata);
    let settings = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
            "Cache-Control": "no-cache"
        },
        body: JSON.stringify(jsondata)
    };

    fetch(`https://fedassg-78fe.restdb.io/rest/community/${account["_id"]}`, settings)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("User liked status updated successfully", data);
    })
    .catch(error => {
        console.error("Error occurred:", error);
    });
}

window.addpost = addpost;

async function submit(){
    let title = document.getElementById("post-title").value;
    let desc = document.getElementById("post-description").value;
    let x = await addpost(account["Username"],desc,title);
    console.log(x)
    document.getElementById("post-title").value = ""
    document.getElementById("post-description").value = ""
    document.querySelector(".popup-box").style.display = "none";
    document.getElementById("blur").style.display = "none";
    x["Image"] = getRandomImage()
    console.log(x)
    postcontent.push(x)

    distributePosts()
}
document.getElementById("submit").addEventListener("click",submit)
