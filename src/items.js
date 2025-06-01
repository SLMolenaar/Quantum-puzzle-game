import { getCurrentLevel } from './level.js';

// Constants for item types
export const ITEM_TYPES = {
    KEY: 'key',
    DOOR: 'door'
};

// Store items for each maze
let itemsA = [];
let itemsB = [];

// Colors for items
export const ITEM_COLORS = {
    KEY: '#FFD700',
    DOOR: '#8B4513'
};

// Reset items for a new level
export function resetItems(maze, isMazeA) {
    const items = [];
    const currentLevel = getCurrentLevel();
    
    // Keys & doors for level 3+
    if (currentLevel >= 3) {
        // First find the path from start to target
        const targetX = maze[0].length - 2;
        const targetY = maze.length - 2;
        const pathToTarget = findShortestPath(maze, 1, 1, targetX, targetY);
        
        if (!pathToTarget || pathToTarget.length === 0) {
            console.warn("No valid path to target found");
            return [];
        }
        
        // Convert path to Set for quick lookup
        const pathSet = new Set(pathToTarget.map(p => `${p.x},${p.y}`));
        
        // Find a key position that's NOT on the path to target
        const keyPos = findReachableSpot(maze, (x, y) => !pathSet.has(`${x},${y}`));
        if (!keyPos) {
            console.warn("Could not find valid position for key");
            return [];
        }
        
        // Find a door position that IS on the path to target
        const doorPos = findDoorPosition(maze, pathToTarget, keyPos);
        if (!doorPos) {
            console.warn("Could not find valid position for door");
            return [];
        }
        
        // Add key first (must be reachable from start)
        items.push({ 
            type: ITEM_TYPES.KEY, 
            x: keyPos.x, 
            y: keyPos.y, 
            collected: false 
        });
        
        // Add door (on the path to target, but not blocking key)
        items.push({ 
            type: ITEM_TYPES.DOOR, 
            x: doorPos.x, 
            y: doorPos.y, 
            locked: true 
        });
    }
    
    if (isMazeA) {
        itemsA = items;
    } else {
        itemsB = items;
    }
    
    return items;
}

// Find the shortest path from start to target using BFS with optional position exclusion
function findShortestPath(maze, startX, startY, targetX, targetY, excludePositions = []) {
    const queue = [{ x: startX, y: startY, path: [{x: startX, y: startY}] }];
    const visited = new Set([`${startX},${startY}`]);
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const excludeSet = new Set(excludePositions.map(p => `${p.x},${p.y}`));
    
    while (queue.length > 0) {
        const { x, y, path } = queue.shift();
        
        // Check if we've reached the target
        if (x === targetX && y === targetY) {
            return path;
        }
        
        // Explore all four directions
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            const posKey = `${newX},${newY}`;
            
            // Check if the new position is valid, not visited, and not excluded
            if (newX >= 0 && newX < maze[0].length && 
                newY >= 0 && newY < maze.length && 
                maze[newY][newX] === 0 && 
                !visited.has(posKey) &&
                !excludeSet.has(posKey)) {
                
                visited.add(posKey);
                queue.push({
                    x: newX,
                    y: newY,
                    path: [...path, {x: newX, y: newY}]
                });
            }
        }
    }
    
    return [];
}

// Find a reachable spot from start (BFS) with optional filter function
function findReachableSpot(maze, filterFn = null) {
    const targetX = maze[0].length - 2;
    const targetY = maze.length - 2;
    const visited = new Set();
    const queue = [{x: 1, y: 1}];
    const reachableSpots = [];
    
    while (queue.length > 0) {
        const {x, y} = queue.shift();
        const posKey = `${x},${y}`;
        
        if (visited.has(posKey)) continue;
        visited.add(posKey);
        
        // Don't place key too close to start or target
        const distToStart = Math.abs(x - 1) + Math.abs(y - 1);
        const distToTarget = Math.abs(x - targetX) + Math.abs(y - targetY);
        
        if (distToStart > 2 && distToTarget > 2) {
            // Apply filter function if provided
            if (!filterFn || filterFn(x, y)) {
                reachableSpots.push({x, y});
            }
        }
        
        // Explore neighbors
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            const newPosKey = `${newX},${newY}`;
            
            if (newX > 0 && newX < maze[0].length - 1 &&
                newY > 0 && newY < maze.length - 1 &&
                maze[newY][newX] === 0 && 
                !visited.has(newPosKey)) {
                queue.push({x: newX, y: newY});
            }
        }
    }
    
    return reachableSpots.length > 0 
        ? reachableSpots[Math.floor(Math.random() * reachableSpots.length)]
        : null;
}

// Find a door position that's on the path to target but not blocking the key
function findDoorPosition(maze, pathToTarget, keyPos) {
    if (!pathToTarget || pathToTarget.length === 0) return null;
    
    const targetX = maze[0].length - 2;
    const targetY = maze.length - 2;
    const potentialDoors = [];
    
    // First, find the path from start to key that doesn't go through the door
    const pathToKey = findShortestPath(maze, 1, 1, keyPos.x, keyPos.y, []);
    if (!pathToKey || pathToKey.length === 0) {
        console.warn("No path to key found");
        return null;
    }
    
    // Create a set of positions that are on the path to key
    const pathToKeySet = new Set(pathToKey.map(p => `${p.x},${p.y}`));
    
    // Find valid door positions on the path to target
    for (const pos of pathToTarget) {
        // Skip positions that are on the path to key
        if (pathToKeySet.has(`${pos.x},${pos.y}`)) {
            continue;
        }
        
        // Skip positions too close to start, target, or key
        const distToStart = Math.abs(pos.x - 1) + Math.abs(pos.y - 1);
        const distToTarget = Math.abs(pos.x - targetX) + Math.abs(pos.y - targetY);
        const distToKey = Math.abs(pos.x - keyPos.x) + Math.abs(pos.y - keyPos.y);
        
        // Only consider positions that are at least 2 steps from start, target, and key
        if (distToStart >= 2 && distToTarget >= 2 && distToKey >= 2) {
            potentialDoors.push(pos);
        }
    }
    
    // If no valid doors found, try with relaxed constraints but still ensure key is reachable
    if (potentialDoors.length === 0) {
        for (const pos of pathToTarget) {
            // Still skip positions on the path to key
            if (pathToKeySet.has(`${pos.x},${pos.y}`)) {
                continue;
            }
            
            const distToStart = Math.abs(pos.x - 1) + Math.abs(pos.y - 1);
            const distToTarget = Math.abs(pos.x - targetX) + Math.abs(pos.y - targetY);
            
            if (distToStart >= 1 && distToTarget >= 1) {
                potentialDoors.push(pos);
            }
        }
    }
    
    // If we still don't have any valid doors, try to find any position that doesn't block the key
    if (potentialDoors.length === 0) {
        for (const pos of pathToTarget) {
            // Skip positions on the path to key
            if (pathToKeySet.has(`${pos.x},${pos.y}`)) {
                continue;
            }
            potentialDoors.push(pos);
        }
    }
    
    // Return a random valid door position, or null if none found
    return potentialDoors.length > 0 
        ? potentialDoors[Math.floor(Math.random() * potentialDoors.length)]
        : null;
}

// Check if player collected a key or opened a door
export function checkPlayerItems(playerX, playerY, isMazeA) {
    const items = isMazeA ? itemsA : itemsB;
    let hasKey = false;
    
    for (const item of items) {
        if (item.x === playerX && item.y === playerY) {
            if (item.type === ITEM_TYPES.KEY && !item.collected) {
                item.collected = true;
                hasKey = true;
            }
        }
    }
    
    return hasKey;
}

// Check if player can pass through a door
export function canPassDoor(x, y, isMazeA) {
    const items = isMazeA ? itemsA : itemsB;
    const door = items.find(item => 
        item.type === ITEM_TYPES.DOOR && 
        item.x === x && 
        item.y === y
    );
    
    if (!door) return true; // Not a door
    
    // Check if any key is collected in this maze
    const hasKey = items.some(item => 
        item.type === ITEM_TYPES.KEY && 
        item.collected
    );
    
    if (hasKey) {
        door.locked = false;
    }
    
    return !door.locked;
}

// Get items for rendering
export function getItems(isMazeA) {
    return isMazeA ? itemsA : itemsB;
}

// Draw items on the canvas
export function drawItems(ctx, items, boxSize) {
    for (const item of items) {
        if (item.type === ITEM_TYPES.KEY && !item.collected) {
            ctx.fillStyle = ITEM_COLORS.KEY;
            ctx.beginPath();
            ctx.arc(
                (item.x + 0.5) * boxSize,
                (item.y + 0.5) * boxSize,
                boxSize * 0.3, 0, Math.PI * 2
            );
            ctx.fill();
        } else if (item.type === ITEM_TYPES.DOOR && item.locked) {
            ctx.fillStyle = ITEM_COLORS.DOOR;
            ctx.fillRect(
                (item.x + 0.2) * boxSize,
                (item.y + 0.2) * boxSize,
                boxSize * 0.6,
                boxSize * 0.6
            );
        }
    }
}
