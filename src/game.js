import { mazeA, mazeB, rotateMazeBData, getMazeBRotation } from './maze.js';
import { playerA, playerB, movePlayers } from './player.js';
import { drawMaze } from './utils.js';

const canvasA = document.getElementById('mazeA');
const canvasB = document.getElementById('mazeB');
const size = 40; // Zorg dat dit overeenkomt met de grootte in utils.js

document.addEventListener('keydown', (e) => {
    movePlayers(e.key);
    render();
});

window.rotateMazeB = () => {
    rotateMazeBData();
    render();
};

function render() {
    // Teken de doolhoven

    // Teken Maze A
    const ctxA = canvasA.getContext('2d');
    drawMaze(mazeA, playerA, canvasA);

    // Teken Maze B met rotatie
    const ctxB = canvasB.getContext('2d');
    const rotation = getMazeBRotation();
    drawMaze(mazeB, playerB, canvasB, rotation);

    // Teken de spelers
    ctxA.fillStyle = 'red';
    ctxA.fillRect(playerA.x * size, playerA.y * size, size, size);

    ctxB.save();
    if (rotation !== 0) {
        ctxB.translate(canvasB.width / 2, canvasB.height / 2);
        ctxB.rotate((rotation * Math.PI) / 180);
        ctxB.translate(-canvasB.width / 2, -canvasB.height / 2);
    }
    ctxB.fillStyle = 'blue';
    ctxB.fillRect(playerB.x * size, playerB.y * size, size, size);
    ctxB.restore();
}

render();
