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
    // Call updateMokepoints function to award points
    updateMokepoints();

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

//---------------------------------------- MokePoints ----------------------------------------
async function updateMokepoints() {
    // Retrieve the user object from sessionStorage
    let user = JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
        console.error("User data not found in sessionStorage.");
        alert("User data not found. Please log in.");
        return;
    }

    let mokepoints = user["Moke Points"] || 0; // Ensure Moke Points exist
    console.log("Before update, Moke Points: " + mokepoints);

    let earnedPoints = 0; // Track the earned points

    // Adjust score condition to match your intention
    if (score > 50) { // If the score is greater than 50
        earnedPoints += 1; // Award Moke Point
        console.log("Earned 1 Moke Point from Snake Game!");
    }

    // Update Moke Points if any were earned
    if (earnedPoints > 0) {
        mokepoints += earnedPoints; // Increase Moke Points

        // Update user object and save it back to sessionStorage
        user["Moke Points"] = mokepoints;
        sessionStorage.setItem("user", JSON.stringify(user));

        console.log("Updated Moke Points:", mokepoints);
        alert(`🎉 You've earned ${earnedPoints} Moke Point${earnedPoints > 1 ? 's' : ''}!`);
    } else {
        alert("❌ You need a score greater than 50 to earn Moke Points.");
    }
}
