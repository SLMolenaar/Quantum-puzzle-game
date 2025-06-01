import { mazeA, mazeB, getMazeBRotation, resetMazes } from './maze.js';
import { rotateDirection } from './utils.js';
import { getMapSize, nextLevel, getCurrentLevel, resetLevels } from './level.js';
import { render } from './game.js';
import { getTargetPosition } from './target.js';
import { checkPlayerItems, canPassDoor, ITEM_TYPES } from './items.js';

let mapSize = getMapSize();

export let playerA = { x: 1, y: 1 };
export let playerB = { x: 1, y: 1 };

const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
};

export function movePlayers(key) {
    const dir = directions[key];
    if (!dir) return;

    const newA = { x: playerA.x + dir.x, y: playerA.y + dir.y };
    const rot = getMazeBRotation();
    const dirB = rotateDirection(dir, rot);
    const newB = { x: playerB.x + dirB.x, y: playerB.y + dirB.y };

    // Check if both target positions are valid (not walls and can pass doors)
    const canMoveA = mazeA[newA.y]?.[newA.x] === 0 && canPassDoor(newA.x, newA.y, true);
    const canMoveB = mazeB[newB.y]?.[newB.x] === 0 && canPassDoor(newB.x, newB.y, false);

    if (canMoveA && canMoveB) {
        // Check for key collection before moving
        checkPlayerItems(newA.x, newA.y, true);
        checkPlayerItems(newB.x, newB.y, false);

        // Update player positions
        playerA = newA;
        playerB = newB;
    }

    const targetA = getTargetPosition(mazeA);
    const targetB = getTargetPosition(mazeB);

    // Check if both players have reached the target
    if (playerA.x === targetA.x && playerA.y === targetA.y &&
        playerB.x === targetB.x && playerB.y === targetB.y) {

        const newLevel = nextLevel();

        // New level
        if (newLevel <= 10) {
            resetMazes();

            playerA = { x: 1, y: 1 };
            playerB = { x: 1, y: 1 };

            mapSize = getMapSize();

            if (typeof render === 'function') {
                render();
            }

        // Victory overlay
        } else {
            const victoryOverlay = document.getElementById('victory-overlay');
            const victoryMessage = document.querySelector('.victory-message h2');
            if (victoryMessage) {
                victoryMessage.textContent = 'Congratulations!';
            }
            const victoryText = document.querySelector('.victory-message p');
            if (victoryText) {
                victoryText.textContent = 'You\'ve completed all levels!';
            }

            if (victoryOverlay) {
                victoryOverlay.classList.remove('hidden');
                setTimeout(() => victoryOverlay.classList.add('visible'), 10);

                // Add click handler for the play again button
                const playAgainBtn = document.getElementById('play-again');
                if (playAgainBtn) {
                    const handlePlayAgain = () => {
                        playerA = { x: 1, y: 1 };
                        playerB = { x: 1, y: 1 };
                        resetLevels();

                        resetMazes();

                        mapSize = getMapSize();

                        // Hide overlay
                        victoryOverlay.classList.remove('visible');
                        setTimeout(() => victoryOverlay.classList.add('hidden'), 500);

                        if (typeof render === 'function') {
                            render();
                        }

                        // Remove event listener to prevent memory leaks
                        playAgainBtn.removeEventListener('click', handlePlayAgain);
                    };
                    playAgainBtn.addEventListener('click', handlePlayAgain);
                }
            }
        }
    }
}


