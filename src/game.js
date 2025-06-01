import { mazeA, mazeB, rotateMazeBData, getMazeBRotation, resetMazes } from './maze.js';
import { playerA, playerB, movePlayers } from './player.js';
import { drawMaze } from './utils.js';
import { getCurrentLevel, getMapSize } from './level.js';
import { BOX_SIZE } from './config.js';

const canvasA = document.getElementById('mazeA');
const canvasB = document.getElementById('mazeB');

// level display
const levelElement = document.getElementById('level');
levelElement.textContent = `Level ${getCurrentLevel()}`;


document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        rotateMazeBData();
    } else {
        movePlayers(e.key);
    }
    render();
});


export function render() {
    // Draw Maze A
    const ctxA = canvasA.getContext('2d');
    drawMaze(mazeA, playerA, canvasA);

    // Draw maze B with rotation
    const ctxB = canvasB.getContext('2d');
    const rotation = getMazeBRotation();
    drawMaze(mazeB, playerB, canvasB, rotation);
}

render();
