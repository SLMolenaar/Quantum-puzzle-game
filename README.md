# Quantum Maze Puzzle

A challenging puzzle game where you control two quantum-entangled players simultaneously through interconnected mazes. Navigate through increasingly complex levels, solve puzzles, and master the art of quantum movement!

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://quantum-maze-game.netlify.app)

## 🌟 Features

- **Quantum Entanglement Mechanics**: Control two players simultaneously in separate but connected mazes
- **Progressive Difficulty**: Mazes grow larger with each level (3x3 blocks per level)
- **Puzzle Elements**:
  - Keys & Doors (Level 3+)
  - Rotating maze mechanics
  - Increasingly complex level design
- **Modern UI**: Clean, responsive interface with intuitive controls
- **Level Progression**: Automatic saving of progress

## 🎮 How to Play

### Controls
- **Arrow Keys**: Move both players simultaneously
- **Space**: Rotate the right maze 90 degrees

### Game Rules
1. Guide both players (red and blue) to their respective targets
2. Players move in the same direction but are affected by maze rotation
3. Collect keys to unlock doors (Level 3+)
4. Complete each level to progress to a larger, more challenging maze

## 🚀 Live Demo

Play the game online: [Quantum Maze Puzzle](https://quantum-maze-game.netlify.app)

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Quantum-puzzle-game.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Quantum-puzzle-game
   ```
3. Open `src/index.html` in your preferred web browser

## 🧠 Technical Details

### Built With
- Vanilla JavaScript (ES6+)
- HTML5 Canvas
- CSS3 (with modern features like CSS Variables and Flexbox)

### Key Algorithms
- **Maze Generation**: Recursive Backtracking
- **Pathfinding**: Breadth-First Search (BFS)
- **Collision Detection**: Grid-based system
- **State Management**: Custom implementation

## 📂 Project Structure

```
src/
├── index.html          # Main HTML file
├── style.css           # Global styles
├── game.js            # Main game loop and logic
├── maze.js            # Maze generation and management
├── player.js          # Player movement and controls
├── items.js           # Game items (keys, doors)
├── level.js          # Level management
└── utils.js          # Utility functions
```

## 🔧 Future Improvements

- [ ] Add a level reset button
- [ ] Implement step counter and optimal move counter
- [ ] Add sound effects and background music

---

🎮 Happy Puzzling! 🧩
