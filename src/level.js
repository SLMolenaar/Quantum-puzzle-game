let currentLevel = 2;
let mapSize = 7; // Base size for level 1

export function getMapSize() {
    return mapSize;
}

export function getCurrentLevel() {
    return currentLevel;
}

export function nextLevel() {
    currentLevel++;
    mapSize = (7 + (currentLevel - 1) * 5) | 1;

    // Update level display
    document.getElementById('level').textContent = `Level ${currentLevel}`;
    
    // Show tutorial popup when reaching level 3
    if (currentLevel === 3) {
        const tutorialPopup = document.getElementById('tutorial-popup');
        const closeTutorial = document.getElementById('close-tutorial');
        
        // Show the popup after a short delay to let the level load
        setTimeout(() => {
            tutorialPopup.classList.add('visible');
            tutorialPopup.classList.remove('hidden');
        }, 500);
        
        // Close button handler
        const closeHandler = () => {
            tutorialPopup.classList.remove('visible');
            setTimeout(() => {
                tutorialPopup.classList.add('hidden');
            }, 500);
            closeTutorial.removeEventListener('click', closeHandler);
        };
        
        closeTutorial.addEventListener('click', closeHandler);
    }
    
    return currentLevel;
}

export function resetLevels() {
    currentLevel = 1;
    mapSize = 7; // Reset size
    document.getElementById('level').textContent = 'Level 1';
    return mapSize;
}

// Initialize level display on load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('level').textContent = `Level ${currentLevel}`;
});
