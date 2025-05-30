let currentLevel = 1;
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
