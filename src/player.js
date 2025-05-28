import { mazeA, mazeB, getMazeBRotation } from './maze.js';
import { rotateDirection } from './utils.js';
import { mapSize } from './maze.js';

export let playerA = { x: 1, y: 1 };
export let playerB = { x: 1, y: 1 };

const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
};

let points = 0;

export function movePlayers(key) {
    const dir = directions[key];
    if (!dir) return;

    const newA = { x: playerA.x + dir.x, y: playerA.y + dir.y };
    const rot = getMazeBRotation();
    const dirB = rotateDirection(dir, rot);
    const newB = { x: playerB.x + dirB.x, y: playerB.y + dirB.y };

    if (mazeA[newA.y]?.[newA.x] === 0) playerA = newA;
    else setPoints(points-1);
    if (mazeB[newB.y]?.[newB.x] === 0) playerB = newB;
    else  setPoints(points-1);

    if (playerA.x === mapSize-2 && playerA.y === mapSize-2 && playerB.x === mapSize-2 && playerB.y === mapSize-2) {
        alert('You won!');
    }
}

export function setPoints(value) {
    points = value;
    document.getElementById('points').textContent = points;
    return points;
}