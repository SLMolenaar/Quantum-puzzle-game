import { BOX_SIZE, MAZE_COLORS } from './config.js';
import { getTargetPosition } from './target.js';

export function drawMaze(maze, player, canvas, rotation = 0) {
    const ctx = canvas.getContext('2d');
    const width = maze[0].length;
    const height = maze.length;

    canvas.width = width * BOX_SIZE;
    canvas.height = height * BOX_SIZE;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    if (rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? MAZE_COLORS.WALL : MAZE_COLORS.PATH;
            ctx.fillRect(x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE);
        }
    }

    // Draw player
    ctx.fillStyle = MAZE_COLORS.PLAYER;
    ctx.fillRect(player.x * BOX_SIZE, player.y * BOX_SIZE, BOX_SIZE, BOX_SIZE);

    // Draw target using the shared target position logic
    const targetPos = getTargetPosition(maze);
    ctx.fillStyle = MAZE_COLORS.TARGET;
    ctx.fillRect(targetPos.x * BOX_SIZE, targetPos.y * BOX_SIZE, BOX_SIZE, BOX_SIZE);

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
