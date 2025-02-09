import * as memory from "../minigames/memorygame.js";
import * as snake from "../minigames/snakegame.js";
import {changetab,showGameById} from "../minigames/tabchange.js";
document.addEventListener('DOMContentLoaded', function () {

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
    // When the "back" button is clicked, reset the URL and show the main game list
    document.getElementById("minigame-back").addEventListener("click", changetab);
});
