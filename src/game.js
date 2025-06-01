import { mazeA, mazeB, rotateMazeBData, getMazeBRotation } from './maze.js';
import { playerA, playerB, movePlayers } from './player.js';
import { drawMaze } from './utils.js';
import { getCurrentLevel } from './level.js';

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
    drawMaze(mazeA, playerA, canvasA);

    const rotation = getMazeBRotation();
    drawMaze(mazeB, playerB, canvasB, rotation);
}

render();
