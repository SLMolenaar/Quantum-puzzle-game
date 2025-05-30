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
    KEY: '#FFD700',  // Gold
    DOOR: '#8B4513'  // Brown
};

// Reset items for a new level
export function resetItems(maze, isMazeA) {
    const items = [];
    const currentLevel = getCurrentLevel();
    
    // Only add keys and doors for level 8 and above
    if (currentLevel >= 5) {
        // First find a key position that's reachable from start without going through a door
        const keyPos = findReachableSpot(maze);
        if (!keyPos) {
            console.warn("Could not find valid position for key.");
            return [];
        }
        
        // Then find a door position that's on the path to target but not blocking the key
        const doorPos = findDoorPosition(maze, keyPos);
        if (!doorPos) {
            console.warn("Could not find valid position for door.");
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

// Find a reachable spot from start (BFS)
function findReachableSpot(maze) {
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
            reachableSpots.push({x, y});
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
function findDoorPosition(maze, keyPos) {
    const targetX = maze[0].length - 2;
    const targetY = maze.length - 2;
    
    // First find the shortest path from key to target
    const pathFromKey = findShortestPath(maze, keyPos.x, keyPos.y, targetX, targetY);
    if (pathFromKey.length === 0) return null;
    
    // Then find the shortest path from start to target that doesn't go through the key
    const pathFromStart = findShortestPath(
        maze, 
        1, 
        1, 
        targetX, 
        targetY,
        [{x: keyPos.x, y: keyPos.y}]
    );
    
    if (pathFromStart.length === 0) return null;
    
    // Find intersection points between the two paths
    const pathFromKeySet = new Set(pathFromKey.map(p => `${p.x},${p.y}`));
    const intersectionPoints = pathFromStart.filter(pos => {
        return pathFromKeySet.has(`${pos.x},${pos.y}`);
    });
    
    // Filter out points too close to start/target
    const validDoors = intersectionPoints.filter(pos => {
        const distToStart = Math.abs(pos.x - 1) + Math.abs(pos.y - 1);
        const distToTarget = Math.abs(pos.x - targetX) + Math.abs(pos.y - targetY);
        return distToStart > 2 && distToTarget > 2;
    });
    
    return validDoors.length > 0 
        ? validDoors[Math.floor(Math.random() * validDoors.length)]
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
