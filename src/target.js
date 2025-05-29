/**
 * Calculates the target position for a given maze
 * @param {number[][]} maze - The maze array
 * @returns {{x: number, y: number}} The target position
 */
export function getTargetPosition(maze) {
    // Place target near the bottom-right corner but ensure it's not on a wall
    const targetX = Math.max(1, maze[0].length - 2); // One cell away from the right edge
    const targetY = Math.max(1, maze.length - 2);    // One cell away from the bottom edge
    
    // If the calculated position is a wall, find the nearest path cell above it
    if (maze[targetY][targetX] === 1) {
        for (let y = targetY; y >= 0; y--) {
            if (maze[y][targetX] === 0) {
                return { x: targetX, y: y };
            }
        }
    }
    
    return { x: targetX, y: targetY };
}
