import { mapSize } from './maze.js';
import { boxSize } from './game.js';

export function drawMaze(maze, player, canvas, rotation = 0) {
    const ctx = canvas.getContext('2d');
    const width = maze[0].length;
    const height = maze.length;

    canvas.width = width * boxSize;
    canvas.height = height * boxSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    if (rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? '#333' : '#fff';
            ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize);
        }
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(player.x * boxSize, player.y * boxSize, boxSize, boxSize);

    ctx.fillStyle = 'green';
    ctx.fillRect((mapSize-2) * boxSize, (mapSize-2) * boxSize, boxSize, boxSize);

    ctx.restore();
}

export function rotateDirection(dir, rotation) {
    let { x, y } = dir;
    switch (rotation) {
        case 90: return { x: y, y: -x };
        case 180: return { x: -x, y: -y };
        case 270: return { x: -y, y: x };
        default: return dir;
    }
}