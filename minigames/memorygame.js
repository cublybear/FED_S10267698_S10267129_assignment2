const cards = document.querySelectorAll(".memory-card");
let matchCard = 0;
let cardOne, cardTwo;
let disableDeck = false;
let moves = 0

function flipCard(e) {
    // use closest to go to the nearest card
    let clickedCard = e.target.closest(".memory-card");
    if (clickedCard !== cardOne && !disableDeck) {

        clickedCard.classList.add("flip");
        if (!cardOne) {
            // return cardOne value to clickedCard
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;
        disableDeck = true;
        // target each card's back-view's image tag
        let cardOneImg = cardOne.querySelector(".back-view").querySelector("img").src;
        let cardTwoImg = cardTwo.querySelector(".back-view").querySelector("img").src;
        moves++; // count number of moves
        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if (img1 === img2) {
        matchCard++; // increment matched value by 1
        // if user matched all cards, call shuffleCard function
        if (matchCard == 8) {
            setTimeout(() => {
                console.log(`you won in ${moves} moves!`)
                return shuffleCard();
            }, 1000);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        // set both card values to empty
        cardOne = "";
        cardTwo = "";
        return disableDeck = false;
    }
    // if both cards not matched
    setTimeout(() => {
        // add shake to both cards after 400ms
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);
    setTimeout(() => {
        // remove shake and flip to both cards after 1200ms
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        // set both card values to empty
        cardOne = "";
        cardTwo = "";
        disableDeck = false;
    }, 1200);
}

function shuffleCard() {
    let matchedCard = 0;
    let cardOne = "";
    let cardTwo = "";
    // Array of image urls
    const imgUrls = [
        "https://cdn-icons-png.flaticon.com/128/3534/3534312.png",
        "https://cdn-icons-png.flaticon.com/128/9752/9752702.png",
        "https://cdn-icons-png.flaticon.com/128/2957/2957307.png",
        "https://cdn-icons-png.flaticon.com/128/7223/7223124.png",
        "https://cdn-icons-png.flaticon.com/128/1785/1785388.png",
        "https://cdn-icons-png.flaticon.com/128/1012/1012573.png",
        "https://cdn-icons-png.flaticon.com/128/3089/3089623.png",
        "https://cdn-icons-png.flaticon.com/128/3751/3751526.png"
    ];

    // create an array of 16 items (2 of each image, 8 pairs)
    // duplicate the image array to get pairs
    // spread operator makes them individual elements >:D
    let arr = [...imgUrls, ...imgUrls];

    arr.sort(() => Math.random() > 0.5 ? 1 : -1); // sort array items randomly
    // remove flip from all cards and pass random image to each card
    cards.forEach((card, index) => {
        let imgTag = card.querySelector("img");
        imgTag.src = arr[index]
        card.addEventListener("click", flipCard);
    })
    setTimeout(() => {
        cards.forEach(card => card.classList.remove("flip"))
    }, 2000);//flip them all back after 2 seconds
};
//LISTENER FOR CLASS LIST CHANGES
let targetDiv = document.getElementById("moke-memory")
// Create a MutationObserver instance
const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            if (targetDiv.classList.contains("active")) {
                console.log("The 'active' class was added!");
                shuffleCard();

                // add event listener to all cards
                cards.forEach(card => {
                    card.classList.add("flip");
                    card.addEventListener("click", flipCard);
                });
            } else {
                console.log("The 'active' class was removed!");
            }
        }
    });
});

// Start observing the div for class attribute changes
observer.observe(targetDiv, { attributes: true });

//---------------------------------------- MokePoints ----------------------------------------
async function updateMokepoints() {
    // Get MokePoints from sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user"));
    let mokepoints = user["Moke Points"];

    console.log("Before update, MokePoints: " + mokepoints); // Log current MokePoints for debugging

    let earnedPoints = 0; // To track the points earned

    // Check matchCard score
    if (matchCard === 8) { // Check if 8 matched cards
        earnedPoints += 1; // Award MokePoint
        console.log("Memory Game - Earned MokePoints!"); // Debugging log
    }

    // Update MokePoints if any points were earned
    if (earnedPoints > 0) {
        mokepoints += earnedPoints;
        sessionStorage.setItem("Moke Points", mokepoints); // Save updated MokePoints
        console.log("Updated MokePoints to: " + mokepoints); // Debugging log
        alert(`Congratulations! You've earned ${earnedPoints} MokePoint${earnedPoints > 1 ? 's' : ''}!`);
    } 
    else {
        alert("You need to match 8 cards to earn MokePoints.");
    }
}

// Call the function to update MokePoints
updateMokepoints();
