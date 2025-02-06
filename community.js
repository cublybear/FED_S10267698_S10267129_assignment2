let accountstring = localStorage.getItem("user")
let account = JSON.parse(accountstring)
const APIKEY = "678b1d1a19b96a08c0af6336";
console.log(account)
const container = document.querySelector(".post-con"); // The main container for all posts
const numCols = 4; // Define the number of columns
let numberpost = 0
let postcontent = await getposts();  
// The post content array
async function getposts(){
    // Wait for response
    const response = await fetch("https://fedassignment2-eef5.restdb.io/rest/community", {
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
    console.log(data); // For debugging
    return data
}
 
// Function to create and append posts into the specific container
function createpost(postData, container) {
    const postdiv = document.createElement("div");
    postdiv.classList.add("indivcon");
    postdiv.id = `post${++numberpost}`;
    postdiv.style.display = "flex";
    postdiv.style.flexDirection = "column";
    postdiv.style.alignItems = "center";

    const postheader = document.createElement("div");
    postheader.classList.add("postheader");
    postheader.textContent = postData.Username;

    const postimage = document.createElement("div");
    const image = document.createElement("img");
    image.classList.add("image");

    // Use Lorem Picsum for random images (dynamic size)
    // This will fetch random images with random dimensions each time
    image.src = `https://picsum.photos/seed/${Math.random() * 1000}/400/400`;  // Random image with random seed for variation
    image.style.width = "auto";  // Allow natural scaling of image width
    image.style.height = "auto"; // Allow natural scaling of image height
    image.style.objectFit = "contain";  // Ensures the image fits within its container
    image.style.maxWidth = "100%";  // Ensures it scales based on container's width
    image.style.maxHeight = "400px";  // Optional: Control maximum height

    postimage.appendChild(image);

    const postdesc = document.createElement("div");
    postdesc.classList.add("postdesc");
    postdesc.style.width = "85%";
    postdesc.textContent = postData.Description;

    const likes = document.createElement("div");
    likes.classList.add("likes");
    const reactivelike = document.createElement("div");
    reactivelike.classList.add("likebutton");
    reactivelike.style.gap = "10px";
    likes.style.width = "85%";
    reactivelike.style.display = "flex";
    reactivelike.style.justifyContent = "flex-start";

    const reactivelikebutton = document.createElement("i");
    reactivelikebutton.classList.add("far", "fa-heart");
    const reactivelikecount = document.createElement("p");
    reactivelikecount.textContent = parseInt(postData.Likes);
    reactivelikecount.classList.add("count");

    reactivelike.appendChild(reactivelikebutton);
    reactivelike.appendChild(reactivelikecount);
    likes.appendChild(reactivelike);

    reactivelikebutton.addEventListener("click", (e) => {
        const counter = e.target.closest(".likebutton").querySelector(".count");
        let count = parseInt(counter.textContent);

        if (e.target.classList.contains("far")) {
            count++;
            e.target.classList.remove("far");
            e.target.classList.add("fas");
            e.target.style.color = "red";
        } else {
            count--;
            e.target.classList.remove("fas");
            e.target.classList.add("far");
            e.target.style.color = "black";
        }

        counter.textContent = count;
    });

    postdiv.appendChild(postheader);
    postdiv.appendChild(postimage);
    postdiv.appendChild(postdesc);
    postdiv.appendChild(likes);

    container.appendChild(postdiv);
}

// The masonry layout logic
function distributePosts() {
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

function alllikes(){
    allcount = document.querySelectorAll(".count")
    eachcount = []
    allcount.forEach(element =>{
        eachcount.push({"post":parseInt(element.closest(".indivcon").id.slice(-1)),"likes":parseInt(element.textContent)})
    })
    return eachcount
}

distributePosts();
document.addEventListener("DOMContentLoaded", async function () {  
})
