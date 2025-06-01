export function getTargetPosition(maze) {
    const targetX = Math.max(1, maze[0].length - 2);
    const targetY = Math.max(1, maze.length - 2);
    
    // If calculated position is a wall, find nearest path cell above it
    if (maze[targetY][targetX] === 1) {
        for (let y = targetY; y >= 0; y--) {
            if (maze[y][targetX] === 0) {
                return { x: targetX, y: y };
            }
        }
    }
    
    return { x: targetX, y: targetY };
}
