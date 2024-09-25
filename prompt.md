## Game Title: Core-Based Puzzle Alignment Game

## Game Description:
A Tetris-like puzzle game where pieces originate from a central "core" and move outward in four possible directions (up, down, left, right). The goal is to complete lines of pieces across the grid. Lines can be cleared in any direction, and multiple lines cleared simultaneously will earn bonus points. Unsupported lines will descend by one grid square when a line is cleared, based on the direction of their resting wall. The game becomes progressively faster as the player advances in level or spends more time in the same level.

## Game Engine and Grid Layout:

### Grid:
The playing field is a grid-based layout. The number of rows and columns should be flexible and based on the screen size to ensure responsiveness.
Core Origin: Pieces originate from the center of the grid and are moved outward in one of four directions, chosen by the player.

### Grid Size:
The grid will automatically resize to fit the device screen, ensuring a responsive layout on different devices (mobile, tablet, desktop).

## Piece Movement:

### Directional Control:
Players can move pieces in four directions—up, down, left, or right—using the arrow keys. The first directional keypress initiates movement, and the piece will continue moving in that direction.

### Constant Motion:
 Once a direction is chosen, pieces will move at a constant speed, determined by the current level’s difficulty. As the player advances levels, piece speed will increase.

### Level Progression: Speed increases based on:
Time played at the current level (after a threshold is crossed).

Moving to the next level after completing a required number of lines.

## Line Completion and Scoring:

### Line Clearing:
A line is cleared when all squares from one edge of the grid to the other are filled with pieces. This can happen in any direction (horizontal, vertical, or diagonal).

### Multi-Line Bonus: 
Bonuses will be awarded for clearing multiple lines simultaneously, with extra multipliers if lines are cleared in multiple directions at once.

### Line Collapse:
When a line is cleared, unsupported pieces (those not connected to any other filled spaces) will descend one row toward the wall where they were placed.

## Shapes (Tetromino-Like):
The game will feature several basic shapes, each fitting into a grid layout. The following shapes will be available:

### Plus Shape:
A cross shape, covering 5 grid squares.
⬜
⬜⬜⬜
⬜

### Short Line:
A straight line covering 3 grid squares horizontally or vertically.
⬜⬜⬜

### Long Line:
A straight line covering 5 grid squares.
⬜⬜⬜⬜⬜

### Square Shape:
A 2x2 block.
⬜⬜
⬜⬜

### T Shape:
A T-shaped block.
⬜⬜⬜
  ⬜

### L Shape:
An L-shaped block.
⬜
⬜⬜⬜

### Z Shape:
A zigzag block.
⬜⬜
  ⬜⬜

## Game Mechanics:

### Piece Speed:
Each piece will have a speed that can increase based on level difficulty or time thresholds. This speed governs how quickly the piece moves across the grid.

## Bonuses:
* Clearing 2 lines = 2x score multiplier.
* Clearing 3 lines = 4x score multiplier.
* Clearing 2 or more lines in multiple directions = 8x score multiplier.

## Responsive Design:
### Responsive Layout:
The game will be responsive and adjust the grid size based on device screen size. The game should work on both mobile devices and desktops using HTML5 and JavaScript.

### CSS:
Use CSS media queries to ensure proper scaling on devices of different screen sizes. The pieces and grid will resize dynamically to ensure smooth gameplay on any screen size.

## Input Handling:
### Arrow Keys:
Controls will be via the arrow keys, allowing the player to move pieces in the desired direction. The first arrow keypress after a piece appears will determine the piece’s direction of movement.

### Device Input:
For mobile devices, swipe gestures can be used to control piece movement in place of the arrow keys.

## Game Over Condition:
The game will end if the grid becomes fully blocked with pieces and no additional piece can be placed.

Technical Requirements:

## JavaScript Framework:
Vanilla JavaScript with HTML5 for rendering the grid and controlling gameplay. CSS for styling and responsive design.

## Grid Representation:
Use a 2D array to represent the grid, where each cell can either be empty or filled with a piece block.

## Piece Handling:
Each piece should be represented as an object with a shape, rotation state, and position within the grid.

## Animation:
Piece movement should be animated at a smooth frame rate (e.g., using requestAnimationFrame).
