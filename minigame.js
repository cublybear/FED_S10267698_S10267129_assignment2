import { changetab, showGameById } from "./minigames/tabchange.js";

document.addEventListener('DOMContentLoaded', function () {
    //---------------------------------------- Game Tab and Display Logic ----------------------------------------
    // Function to show the corresponding game based on the game ID in the URL
    function showGameById(gameId) {
        // Hide all non-game content
        const nonGameElements = document.querySelectorAll('.minigame-list');
        nonGameElements.forEach(element => {
            element.style.display = 'none';
        });

        // Hide all game content sections initially
        const gameContents = document.querySelectorAll('.game-content');
        gameContents.forEach(content => {
            content.style.display = 'none';
        });

        // Show the selected game content
        const selectedGameContent = document.getElementById(gameId);
        if (selectedGameContent) {
            selectedGameContent.style.display = 'block';
        } else {
            console.error("Game content not found:", gameId);
        }
    }

    // Extract game ID from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const gameIdFromURL = urlParams.get('id');

    // If there's a game ID in the URL, display the corresponding game
    if (gameIdFromURL) {
        showGameById(gameIdFromURL);
    }

    // Add click event listeners to game items
    const gameItems = document.querySelectorAll('.minigame');
    gameItems.forEach(item => {
        item.addEventListener('click', function () {
            const gameId = item.getAttribute('data-game-id');

            // Update the URL to reflect the game ID
            history.pushState(null, '', '?id=' + gameId);

            // Show the corresponding game content
            showGameById(gameId);
        });
    });

    document.getElementById("minigame-back").addEventListener("click", changetab)

    //---------------------------------------- Minigame 1 - Memory Game ----------------------------------------

    const cards = document.querySelectorAll(".card");
    let matchCard = 0;
    let cardOne, cardTwo;
    let disableDeck = false;
    let moves = 0;

    function flipCard(e) {
        let clickedCard = e.target.closest(".card");
        if (clickedCard !== cardOne && !disableDeck) {
            clickedCard.classList.add("flip");
            if (!cardOne) {
                return cardOne = clickedCard;
            }
            cardTwo = clickedCard;
            disableDeck = true;
            let cardOneImg = cardOne.querySelector(".back-view").querySelector("img").src;
            let cardTwoImg = cardTwo.querySelector(".back-view").querySelector("img").src;
            moves++;
            matchCards(cardOneImg, cardTwoImg);
        }
    }

    function matchCards(img1, img2) {
        if (img1 === img2) {
            matchCard++;
            if (matchCard === 8) {
                setTimeout(() => {
                    console.log(`You won in ${moves} moves!`);
                    return shuffleCard();
                }, 1000);
            }
            cardOne.removeEventListener("click", flipCard);
            cardTwo.removeEventListener("click", flipCard);
            cardOne = "";
            cardTwo = "";
            return disableDeck = false;
        }
        setTimeout(() => {
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake");
        }, 400);
        setTimeout(() => {
            cardOne.classList.remove("shake", "flip");
            cardTwo.classList.remove("shake", "flip");
            cardOne = "";
            cardTwo = "";
            disableDeck = false;
        }, 1200);
    }

    function shuffleCard() {
        matchCard = 0;
        cardOne = "";
        cardTwo = "";
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

        let arr = [...imgUrls, ...imgUrls];
        arr.sort(() => Math.random() > 0.5 ? 1 : -1);
        cards.forEach((card, index) => {
            let imgTag = card.querySelector("img");
            imgTag.src = arr[index];
            card.addEventListener("click", flipCard);
        });
        setTimeout(() => {
            cards.forEach(card => card.classList.remove("flip"));
        }, 2000);
    }

    shuffleCard();
    cards.forEach(card => {
        card.classList.add("flip");
        card.addEventListener("click", flipCard);
    });

    //---------------------------------------- Minigame 2 - Snake Game ----------------------------------------

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
    let highScore = localStorage.getItem("snake-game-high-score") || 0;

    const changeFoodPosition = () => {
        blockX = Math.floor(Math.random() * 30) + 1;
        blockY = Math.floor(Math.random() * 30) + 1;
    };

    const handleGameOver = () => {
        clearInterval(setInterValid);
        alert("Game over! Press OK to replay.");
        location.reload();
    };

    const changeDirection = (e) => {
        if (e.key === "ArrowUp" && velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
        } else if (e.key === "ArrowDown" && velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (e.key === "ArrowRight" && velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
        } else if (e.key === "ArrowLeft" && velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
        }
        initGame();
    };

    const initGame = () => {
        if (gameOver) return handleGameOver();
        let htmlMarkup = `<div class="block" style="grid-area: ${blockY}/${blockX}"></div>`;

        if (snakeX === blockX && snakeY === blockY) {
            changeFoodPosition();
            snakeBody.push({ x: blockX, y: blockY });
            score++;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("snake-game-high-score", highScore);
            }
            scoreElement.innerText = `Score: ${score}`;
            highScoreElement.innerText = `High score: ${highScore}`;
        }

        for (let i = snakeBody.length - 1; i > 0; i--) {
            snakeBody[i] = snakeBody[i - 1];
        }

        snakeBody[0] = { x: snakeX, y: snakeY };
        snakeX += velocityX;
        snakeY += velocityY;

        if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
            gameOver = true;
        }

        for (let i = 1; i < snakeBody.length; i++) {
            if (snakeBody[0].x === snakeBody[i].x && snakeBody[0].y === snakeBody[i].y) {
                gameOver = true;
            }
        }

        for (let i = 0; i < snakeBody.length; i++) {
            htmlMarkup += `<div class="snake" style="grid-area: ${snakeBody[i].y}/${snakeBody[i].x}"></div>`;
        }

        playBoard.innerHTML = htmlMarkup;
    };

    changeFoodPosition();
    setInterValid = setInterval(initGame, 125);
    document.addEventListener("keydown", changeDirection);

    //---------------------------------------- MokePoints ----------------------------------------
    // Function to check if user qualifies for MokePoints
    async function updateMokepoints(username) {
        const currentDate = new Date().toISOString().split('T')[0]; // Get today's date

        // Retrieve stored scores from localStorage
        let memoryScore = parseInt(localStorage.getItem("memory-game-score")) || 0;
        let snakeScore = parseInt(localStorage.getItem("snake-game-score")) || 0;

        // Calculate total score from both games
        let totalScore = memoryScore + snakeScore;

        // Retrieve last earned date for MokePoints
        let lastEarnedDate = localStorage.getItem("lastEarnedDate");
        let mokepoints = parseInt(localStorage.getItem("Moke Points")) || 0;

        // If the total score is greater than 50 and the user hasn't earned MokePoints today
        if (totalScore > 2 && currentDate !== lastEarnedDate) {
            mokepoints += 1; // Award 1 MokePoint
            localStorage.setItem("Moke Points", mokepoints); // Save updated mokepoints
            localStorage.setItem("lastEarnedDate", currentDate); // Update last earned date

            // Update MokePoints in RestDB (Assuming RestDB API update function is available)
            await updateRestDB(username, mokepoints);

            alert("Congratulations! You've earned 1 MokePoint!");
        } 
        else {
            if (currentDate === lastEarnedDate) {
                alert("You have already earned MokePoints today. Try again tomorrow!");
            } else {
                alert("You need a combined score greater than 50 to earn MokePoints.");
            }
        }

        // Update UI with the current MokePoints
        updateMokepointDisplay(); // Call this function to update the UI
    }

    // Function to update the UI with the current MokePoints
    function updateMokepointDisplay() {
        let mokepoints = localStorage.getItem("Moke Points") || 0;
        document.getElementById("mokepoint-display").textContent = `MokePoints: ${mokepoints}`;
    }

});
