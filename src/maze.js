// Helper function: Fisher-Yates Shuffle to randomize array elements
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

    // Initialize maze with all walls (1)
    // 0 represents a path, 1 represents a wall
    let maze = Array.from({ length: height }, () => Array(width).fill(1));

    // Stack for DFS
    let stack = [];

    // Choose a random starting cell for carving.
    // It must be an "odd" cell to ensure walls can exist between cells.
    // We also want to stay away from the outermost border initially.
    // Valid start rows: 1, 3, 5, ... height-2
    // Valid start cols: 1, 3, 5, ... width-2
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

export let mapSize = 11;

// Generate the 10x10 maze as requested
export let mazeA = generateRandomizedMaze(mapSize, mapSize);
export let mazeB = generateRandomizedMaze(mapSize, mapSize);

// --- Example of how to use and print (optional, for testing) ---
// function printMaze(maze) {
//   maze.forEach(row => console.log(row.join(' ')));
// }

// console.log("Generated Maze (mazeA):");
// printMaze(mazeA);

// // You can also generate mazes of other sizes:
// let mazeB = generateRandomizedMaze(15, 21); // Example: 15 rows, 21 columns
// console.log("\nGenerated Maze (15x21):");
// printMaze(mazeB);


let mazeBRotation = 0;

export function rotateMazeBData() {
    mazeBRotation = (mazeBRotation + 90) % 360;
}

export function getMazeBRotation() {
    return mazeBRotation;
}