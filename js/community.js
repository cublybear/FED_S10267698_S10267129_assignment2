let accountString = sessionStorage.getItem("user");
let account = accountString ? JSON.parse(accountString) : null;

// If account is null (meaning the user is not logged in yet), handle login or fetch user info
if (!account) {
    // Set account details here when the user logs in or is fetched
    account = {
        username: "exampleUser",
        email: "user@example.com",
        // Add any other necessary fields
    };
    sessionStorage.setItem("user", JSON.stringify(account));  // Store the account info in sessionStorage
}

const APIKEY = "678b1d1a19b96a08c0af6336";
console.log(account)
const container = document.querySelector(".community-post-container"); // The main container for all posts
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
        console.log(e.target);
        let post = postcontent[postnum];
        post["Likes"] = parseInt(e.target.closest(".indivcon").querySelector(".likebutton").querySelector(".count").textContent);
        sessionStorage.setItem("post", JSON.stringify(post));
        console.log(post);
        const url = `post.html`;
        window.location.href = url;
    }
}

let numberpost = 0;
let postcontent = await getposts();
postcontent.forEach(element => {
    element["Image"] = getRandomImage()
});
// The post content array
async function getposts() {
    // wait for response
    const response = await fetch("https://fedassignment2-eef5.restdb.io/rest/community", {
        method: "GET",
        headers: {
            "x-apikey": APIKEY,
        },
    });
    //wait for reponse to finish parsing
    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    console.log(data); //for debugging
    return data;
}

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
    postheader.style.display = "flex";
    postheader.style.flexWrap = "wrap";
    postheader.style.maxWidth = "70%";
    postheader.style.color = "#757575";

    const postimage = document.createElement("div");
    const image = document.createElement("img");
    image.classList.add("image");
    image.src = postData.Image;
    image.style.width = "100%";
    image.style.height = "auto";
    image.style.objectFit = "contain";
    postimage.appendChild(image);

    const postdesc = document.createElement("div");
    postdesc.classList.add("postdesc");
    postdesc.style.width = "85%";
    postdesc.textContent = postData.Title;
    postdesc.style.fontSize = "16px";
    postdesc.style.fontWeight = "semi-bold";
    postdesc.style.color = "black";

    const likes = document.createElement("div");
    likes.classList.add("likes");

    const reactivelike = document.createElement("div");
    reactivelike.style.maxWidth = "15%";
    reactivelike.classList.add("likebutton");
    reactivelike.style.display = "flex";
    reactivelike.style.justifyContent = "space-between";
    reactivelike.style.gap = "10px";
    likes.style.width = "85%";
    reactivelike.style.display = "flex";
    reactivelike.style.justifyContent = "flex-start";

    const reactivelikebutton = document.createElement("i");
    let heart = postData["_id"] in (account.LikedPosts ? account.LikedPosts.posts : {}) ? "fas" : "far";
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
            e.target.classList.remove("far");
            e.target.classList.add("fas");
            e.target.style.color = "red";
            likePost(postid, count);
            updateliked(postid, 1); // Mark post as liked
        } else {
            count--;
            e.target.classList.remove("fas");
            e.target.classList.add("far");
            e.target.style.color = "black";
            likePost(postid, count);
            updateliked(postid, 0); // Remove the like
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
    const numCols = postcontent.length < 4 ? postcontent.length : 4;
    const masonryCon = document.querySelector('.community-post-container');
    const thearray = [...Array(numCols).keys()];
    const themainarray = [];

    const timesBy = Math.ceil(postcontent.length / numCols);
    for (let j = 0; j < timesBy; j++) {
        themainarray.push(...thearray);
    }

    let cols = document.querySelectorAll('.sub');
    cols.forEach(element => {
        element.remove();
    });

    for (let i = 1; i <= numCols; i++) {
        const subCol = document.createElement('div');
        subCol.classList.add('sub');
        subCol.classList.add('box' + i);
        subCol.style.maxWidth = "13%";
        subCol.style.minWidth = "243.5px";
        masonryCon.appendChild(subCol);
    }

    const subs = document.querySelectorAll('.sub');
    let postIndex = 0;
    postcontent.forEach(post => {
        const colIndex = themainarray[postIndex];
        createpost(post, subs[colIndex]);
        postIndex++;
    });
}

async function addpost(username, description, title) {
    let jsondata = {
        "Username": username,
        "Description": description,
        "Likes": 0,
        "Comments": {},
        "Title": title
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
    let response = await fetch("https://fedassignment2-eef5.restdb.io/rest/community", settings);
    let data = await response.json();
    console.log(data);
    return data;
}

function alllikes() {
    allcount = document.querySelectorAll(".count");
    eachcount = [];
    allcount.forEach(element => {
        eachcount.push({ "post": parseInt(element.closest(".indivcon").id.slice(-1)), "likes": parseInt(element.textContent) });
    });
    return eachcount;
}

distributePosts();

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

    fetch(`https://fedassignment2-eef5.restdb.io/rest/community/${postId}`, {
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

    fetch(`https://fedassignment2-eef5.restdb.io/rest/community/${account["_id"]}`, settings)
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