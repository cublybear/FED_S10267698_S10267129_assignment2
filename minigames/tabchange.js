export function changetab() {
    // Reset the URL by removing the 'id' query parameter
    const url = new URL(window.location);
    url.searchParams.delete('id'); // Delete the 'id' query parameter
    history.pushState(null, '', url.toString()); // Update the URL in the browser

    // Show the main game list (make the list visible again and hide game content)
    const nonGameElements = document.querySelectorAll('.minigame-list');
    nonGameElements.forEach(element => {
        element.style.display = 'grid'; // Make sure the game list is visible
        element.classList.add("active");
    });

    // Hide all game content sections
    const gameContents = document.querySelectorAll('.game-content');
    gameContents.forEach(content => {
        content.style.display = 'none';
        content.classList.remove("active");
    });
}


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