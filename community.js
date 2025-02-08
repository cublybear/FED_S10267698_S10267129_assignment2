let accountstring = localStorage.getItem("user")
let account = JSON.parse(accountstring)
const APIKEY = "678b1d1a19b96a08c0af6336";
console.log(account)
const container = document.querySelector(".post-con"); // The main container for all posts
const images = [
    "https://i.pinimg.com/originals/e3/24/f7/e324f790cfe0a51d76f98356475cc408.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBjBL9T_P9pY8ritWs7nP3MBc-X_wyIVZABA&s",
    "https://img.freepik.com/premium-photo/funny-black-white-cat-with-green-eyes-open-mouth-talking-cat_72594-2307.jpg?semt=ais_hybrid",
    "https://images.ctfassets.net/ub3bwfd53mwy/5WFv6lEUb1e6kWeP06CLXr/acd328417f24786af98b1750d90813de/4_Image.jpg?w=750"
];

function getRandomImage() {
    return images[Math.floor(Math.random() * images.length)];
}

console.log(getRandomImage()); // Call this function to get a random image URL
let numberpost = 0
let postcontent = await getposts();

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
    const data = await response.json()
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    console.log(data); //for debugging
    return data
}
// const postcontent = [
//     { Username: "user1", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9LqoCR8_bxqKCRc_1i1Gs8QY6f6UuVhcsXg&s", description: "some example of post description wow this is so cool", likes: 0 },
//     { Username: "user2", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9LqoCR8_bxqKCRc_1i1Gs8QY6f6UuVhcsXg&s", description: "Post description 2 dawbhjdadwhadsbhjawjd", likes: 0 },
//     { Username: "user3", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9LqoCR8_bxqKCRc_1i1Gs8QY6f6UuVhcsXg&s", description: "Post description 3 awlkdhwadhwahdawkjdbkajdk abdjhawbdjhaw hawdghawask", likes: 0 },
//     { Username: "user4", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9LqoCR8_bxqKCRc_1i1Gs8QY6f6UuVhcsXg&s", description: "Post description 2 awkjdhawukd hasgdhwu asjhdg lweh kuasjhdkqwwujh adsku", likes: 0 },
//     { Username: "user5", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9LqoCR8_bxqKCRc_1i1Gs8QY6f6UuVhcsXg&s", description: "Post description 2 awldjawldhawhdkjwabd bkjawbdjasvsbjd", likes: 0 },
//     // Add more posts here if needed
// ];


// The function to create and append posts into the specific container
function createpost(postData, container) {
    const postdiv = document.createElement("div");
    postdiv.classList.add("indivcon");
    postdiv.id = `${++numberpost}`;
    postdiv.style.display = "flex";
    postdiv.style.flexDirection = "column";
    postdiv.style.alignItems = "center";

    const postheader = document.createElement("div");
    postheader.classList.add("postheader");
    postheader.textContent = postData.Username;  // Changed to Username
    postheader.style.fontSize = "12px";
    postheader.style.display = "flex"
    postheader.style.flexWrap = "wrap"
    postheader.style.maxWidth = "70%"
    postheader.style.color = "#757575"


    const postimage = document.createElement("div");
    const image = document.createElement("img");
    image.classList.add("image");
    image.src = getRandomImage();
    // postData.imageUrl;
    image.style.width = "100%";
    image.style.height = "auto";
    image.style.objectFit = "contain";
    postimage.appendChild(image);

    const postdesc = document.createElement("div");
    postdesc.classList.add("postdesc");
    postdesc.style.width = "85%";
    console.log(postData.Description)
    postdesc.textContent = postData.Description;  // Capitalized description
    postdesc.style.fontSize = "16px";
    postdesc.style.fontWeight = "semi-bold"
    postdesc.style.color = "black"

    const likes = document.createElement("div");
    likes.classList.add("likes");

    const reactivelike = document.createElement("div");
    reactivelike.style.maxWidth = "15%"
    reactivelike.classList.add("likebutton");
    reactivelike.style.display = "flex";
    reactivelike.style.justifyContent = "space-between"
    reactivelike.style.gap = "10px";
    likes.style.width = "85%";
    reactivelike.style.display = "flex";
    reactivelike.style.justifyContent = "flex-start";

    const reactivelikebutton = document.createElement("i");
    reactivelikebutton.classList.add("far", "fa-heart");
    const reactivelikecount = document.createElement("p");
    reactivelikecount.textContent = parseInt(postData.Likes);  // Using like count from post data
    reactivelikecount.classList.add("count");

    reactivelike.appendChild(reactivelikebutton);
    reactivelike.appendChild(reactivelikecount);
    likes.appendChild(postheader)
    likes.appendChild(reactivelike);

    reactivelikebutton.addEventListener("click", (e) => {
        const counter = e.target.closest(".likebutton").querySelector(".count");
        let count = parseInt(counter.textContent);
        let postid = postcontent[e.target.closest(".indivcon").id - 1]["_id"]
        console.log(postid)
        if (e.target.classList.contains("far")) {
            count++;
            e.target.classList.remove("far");
            e.target.classList.add("fas");
            e.target.style.color = "red";
            likePost(postid, count)

        } else {
            count--;
            e.target.classList.remove("fas");
            e.target.classList.add("far");
            e.target.style.color = "black";
            likePost(postid, count)
        }

        counter.textContent = count;
    });

    postdiv.appendChild(postimage);
    postdiv.appendChild(postdesc);
    postdiv.appendChild(likes);
    container.appendChild(postdiv);
}

// The masonry layout logic
function distributePosts() {
    const numCols = postcontent.length < 3 ? postcontent.length : 3; // variable columns, if too little posts dont put 3 but max is 3

    const masonryCon = document.querySelector('.post-con'); // The parent container
    const thearray = [...Array(numCols).keys()]; // Array for column distribution
    const themainarray = [];

    // Calculate how many times we need to repeat the columns
    const timesBy = Math.ceil(postcontent.length / numCols);

    // Populate the main array with column indices
    for (let j = 0; j < timesBy; j++) {
        themainarray.push(...thearray);
    }

    // Create sub-columns inside the main container
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

    // Distribute posts into columns
    postcontent.forEach(post => {
        const colIndex = themainarray[postIndex];
        createpost(post, subs[colIndex]);
        postIndex++;
    });
}

async function addpost(username, description) {
    let jsondata = {
        "Username": username,
        "Description": description,
        "Likes": 0
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
    let response = await fetch("https://fedassignment2-eef5.restdb.io/rest/community", settings)
    let data = await response.json()
    console.log(data)

}

function alllikes() {
    allcount = document.querySelectorAll(".count")
    eachcount = []
    allcount.forEach(element => {
        eachcount.push({ "post": parseInt(element.closest(".indivcon").id.slice(-1)), "likes": parseInt(element.textContent) })
    })
    return eachcount
}
distributePosts();

document.getElementById("blur").addEventListener("click", () => {
    document.getElementById("blur").style.display = "none";
    document.querySelector(".popup-box").style.display = "none";
})
document.getElementById("createpostbtn").addEventListener("click", () => {
    document.getElementById("blur").style.display = "flex";
    document.getElementById("popupbox").style.display = "flex"
})
document.getElementById("closepopup").addEventListener("click", () => {
    document.querySelector(".popup-box").style.display = "none";
    document.getElementById("blur").style.display = "none";
})
function likePost(postId, likes) {
    const data = JSON.stringify({
        Likes: likes  // The field you want to update
    });
    // Send the request with custom headers (including the API key)
    fetch(`https://fedassignment2-eef5.restdb.io/rest/community/${postId}`, {
        method: "PATCH",   // Use POST to simulate a PATCH request
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
window.addpost = addpost;
