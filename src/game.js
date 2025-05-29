import { mazeA, mazeB, rotateMazeBData, getMazeBRotation, resetMazes } from './maze.js';
import { playerA, playerB, movePlayers } from './player.js';
import { drawMaze } from './utils.js';
import { getCurrentLevel, getMapSize } from './level.js';
import { BOX_SIZE } from './config.js';

const canvasA = document.getElementById('mazeA');
const canvasB = document.getElementById('mazeB');

// Initialize level display
const levelElement = document.getElementById('level');
if (levelElement) {
    levelElement.textContent = `Level ${getCurrentLevel()}`;
}

document.addEventListener('keydown', (e) => {
    movePlayers(e.key);
    render();
});

// Make rotateMazeB globally available
window.rotateMazeB = () => {
    rotateMazeBData();
    render();
};

// Export the render function so it can be used in other modules
export function render() {
    // Teken Maze A
    const ctxA = canvasA.getContext('2d');
    drawMaze(mazeA, playerA, canvasA);

    // Teken Maze B met rotatie
    const ctxB = canvasB.getContext('2d');
    const rotation = getMazeBRotation();
    drawMaze(mazeB, playerB, canvasB, rotation);

    // Draw players (already handled in drawMaze)
    // The drawMaze function now handles drawing both the maze and the player
}

render();
