//---------------------------------------- Minigame 1 ----------------------------------------
const cards = document.querySelectorAll(".card");
let matchCard = 0;
let cardOne, cardTwo;
let disableDeck = false;
let moves = 0

function flipCard(e) {
    // use closest to go to the nearest card
    let clickedCard = e.target.closest(".card"); 
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
    matchedCard = 0;
    cardOne = "";
    cardTwo = "";
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
        cards.forEach(card => card.classList.remove("flip")); // flip them all back after 2 seconds
    }, 2000);
}

shuffleCard();

// add event listener to all cards
cards.forEach(card => {
    card.classList.add("flip");
    card.addEventListener("click", flipCard);
});

//---------------------------------------- Minigame 2 ----------------------------------------
const playBoard = document.querySelector(".snake-game-play-board");
const scoreElement = document.querySelector(".snake-game-score");
const highScoreElement = document.querySelector(".snake-game-high-score");

let gameOver = false;
let blockX, blockY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setInterValid;
let score = 0;
let highScore = localStorage.getItem("snake-game-high-score") || 0; // Get high score from local storage

const changeFoodPosition = () => {
    // Pass a random value from 0 to 30 as block position
    blockX = Math.floor(Math.random() * 30) + 1;
    blockY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Clear the timer and reload page on game over
    clearInterval(setInterValid);
    alert("Game over! Press OK to replay.");
    location.reload();
}

const changeDirection = (e) => {
    if(e.key === "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }
    else if(e.key === "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }
    else if(e.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
    else if(e.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }
    initGame();
}

const initGame = () => {
    if (gameOver) return handleGameOver();
    let htmlMarkup = `<div class="block" style="grid-area: ${blockY}/${blockX}"></div>`;  // food block

    // Check if snake touches the block
    // Check if snake touches the block
if (snakeX === blockX && snakeY === blockY){
    changeFoodPosition();
    snakeBody.push({ x: blockX, y: blockY }); // Push block to snake body array
    score++; // increment score by 1

    if (score > highScore) {  // Update the high score only if the current score is higher
        highScore = score;
        localStorage.setItem("snake-game-high-score", highScore); // Save new high score
    }

    // Update score and high score in the display
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High score: ${highScore}`;
    }


    // Move snake body forward
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }

    // Update snake's head position
    snakeBody[0] = { x: snakeX, y: snakeY };

    // Update snake's head position
    snakeX += velocityX;
    snakeY += velocityY;

    // Check if the snake's head is out of bounds
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }

    // Check if the snake head hits its body
    for(let i = 1; i < snakeBody.length; i++){
        if (snakeBody[0].x === snakeBody[i].x && snakeBody[0].y === snakeBody[i].y){
            gameOver = true;
        }
    }

    // Render the snake
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="snake" style="grid-area: ${snakeBody[i].y}/${snakeBody[i].x}"></div>`;  // Use the .snake class here
    }

    // Render the playboard with snake and food
    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setInterValid = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
