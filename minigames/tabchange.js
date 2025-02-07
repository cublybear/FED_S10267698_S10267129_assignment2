export function changetab() {
    const nonGameElements = document.querySelectorAll('.minigame-list');
    nonGameElements.forEach(element => {
        element.style.display = 'grid';
        element.classList.add("active")
    });

    // Hide all game content sections initially
    const gameContents = document.querySelectorAll('.game-content');
    gameContents.forEach(content => {
        content.style.display = 'none';
        content.classList.remove("active")
    });
}
// Function to show the corresponding game based on the game ID in the URL

export function showGameById(gameId) {
    // Hide all non-game content
    const nonGameElements = document.querySelectorAll('.minigame-list');
    nonGameElements.forEach(element => {
        element.style.display = 'none';
        element.classList.remove("active")
    });

    // Hide all game content sections initially
    const gameContents = document.querySelectorAll('.game-content');
    gameContents.forEach(content => {
        content.style.display = 'none';
        content.classList.remove("active")
    });

    // Show the selected game content
    const selectedGameContent = document.getElementById(gameId);
    if (selectedGameContent) {
        selectedGameContent.style.display = 'block';
        selectedGameContent.classList.add("active")
    } else {
        console.error("Game content not found:", gameId);
    }
}