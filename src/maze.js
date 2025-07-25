import { getMapSize, getCurrentLevel } from './level.js';
import { resetItems } from './items.js';

// Fisher-Yates Shuffle to randomize array elements (O(n) time complexity)
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // ES6 swap
    }
}

/**
 * Generates a randomized maze using Recursive Backtracking.
 * @param {number} height The height of the maze (including borders).
 * @param {number} width The width of the maze (including borders).
 * @returns {number[][]} A 2D array representing the maze (0 for path, 1 for wall).
 */
function generateRandomizedMaze(height, width) {
    if (height < 3 || width < 3) {
        throw new Error("Maze dimensions must be at least 3x3 to have inner space.");
    }

    // Initialize the maze with all walls
    let maze = Array.from({ length: height }, () => Array(width).fill(1));

    // Stack for DFS
    let stack = [];

    // Choose a random starting cell for carving.
    const startR = Math.floor(Math.random() * Math.floor((height - 1) / 2)) * 2 + 1;
    const startC = Math.floor(Math.random() * Math.floor((width - 1) / 2)) * 2 + 1;

    maze[startR][startC] = 0; // Mark starting cell as path
    stack.push([startR, startC]);

    // Directions: [delta_row, delta_col]
    // These move 2 cells away to find the next potential cell.
    const directions = [
        [-2, 0], // Up
        [2, 0],  // Down
        [0, -2], // Left
        [0, 2]   // Right
    ];


    while (stack.length > 0) {
        let [r, c] = stack[stack.length - 1]; // Get current cell (peek)


        let unvisitedNeighbors = [];

        // Shuffle directions to ensure randomness in path generation
        shuffleArray(directions);

        for (let [dr, dc] of directions) {
            let nr = r + dr; // Neighbor row
            let nc = c + dc; // Neighbor col

            // Check if neighbor is within maze boundaries (not the outermost border)
            // and is currently a wall (i.e., unvisited by the carving process)
            if (nr > 0 && nr < height - 1 && nc > 0 && nc < width - 1 && maze[nr][nc] === 1) {
                unvisitedNeighbors.push({
                    nr: nr,
                    nc: nc,
                    wallR: r + dr / 2, // Row of the wall to break
                    wallC: c + dc / 2  // Column of the wall to break
                });
            }
        }


        if (unvisitedNeighbors.length > 0) {
            // Choose a random unvisited neighbor
            const chosenNeighbor = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];

            // Carve path:
            maze[chosenNeighbor.wallR][chosenNeighbor.wallC] = 0; // Knock down the wall
            maze[chosenNeighbor.nr][chosenNeighbor.nc] = 0;       // Mark neighbor cell as path

            stack.push([chosenNeighbor.nr, chosenNeighbor.nc]); // Move to the neighbor
        } else {
            // No unvisited neighbors, backtrack
            stack.pop();
        }
    }


    return maze;
}

// Initialize map size from level system
export let mapSize = getMapSize();

// Generate the initial mazes
export let mazeA = generateRandomizedMaze(mapSize, mapSize);
export let mazeB = generateRandomizedMaze(mapSize, mapSize);

let mazeBRotation = 0;

export function rotateMazeBData() {
    mazeBRotation = (mazeBRotation + 90) % 360;
}

export function getMazeBRotation() {
    return mazeBRotation;
}

// Reset mazes for a new level
export function resetMazes() {
    mapSize = getMapSize();
    mazeA = generateRandomizedMaze(mapSize, mapSize);
    mazeB = generateRandomizedMaze(mapSize, mapSize);
    mazeBRotation = 0;
    
    // Reset items for both mazes
    resetItems(mazeA, true);
    resetItems(mazeB, false);
    
    return { mazeA, mazeB };
}
