const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const GRID_SIZE = 20;
const CELL_SIZE = 30;
let GRID_WIDTH, GRID_HEIGHT;
let grid = [];
let score = 0;
let currentPiece = null;
let gameInterval = null;
let gameSpeed = 500; // milliseconds
let lastMove = null; // Stores the last move direction


const SHAPES = {
    PLUS: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    SHORT_LINE: [
        [1, 1, 1]
    ],
    LONG_LINE: [
        [1, 1, 1, 1, 1]
    ],
    SQUARE: [
        [1, 1],
        [1, 1]
    ],
    T_SHAPE: [
        [1, 1, 1],
        [0, 1, 0]
    ],
    L_SHAPE: [
        [1, 0],
        [1, 0],
        [1, 1]
    ],
    Z_SHAPE: [
        [1, 1, 0],
        [0, 1, 1]
    ]
};

const PIECE_COLORS = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6c757d', '#343a40'];


function initGame() {
    resizeCanvas();
    initGrid();
    spawnPiece();
    gameInterval = setInterval(gameLoop, gameSpeed);
    document.addEventListener('keydown', handleKeyPress);
}

function resizeCanvas() {
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;
    GRID_WIDTH = Math.floor(maxWidth / CELL_SIZE);
    GRID_HEIGHT = Math.floor(maxHeight / CELL_SIZE);
    canvas.width = GRID_WIDTH * CELL_SIZE;
    canvas.height = GRID_HEIGHT * CELL_SIZE;
}

function initGrid() {
    grid = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(0));
}

function spawnPiece() {
    const shapeKeys = Object.keys(SHAPES);
    const randomShape = SHAPES[shapeKeys[Math.floor(Math.random() * shapeKeys.length)]];
    const centerX = Math.floor(GRID_WIDTH / 2) - Math.floor(randomShape[0].length / 2);
    const centerY = Math.floor(GRID_HEIGHT / 2) - Math.floor(randomShape.length / 2); // Center Y

    currentPiece = {
        shape: randomShape,
        x: centerX,
        y: centerY, // Start from center
        color: PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)]
    };
}

function gameLoop() {

    if (lastMove) {
        movePiece(lastMove);
    }


    clearLines();
    draw();
}

function movePiece(direction) {
    let newX = currentPiece.x;
    let newY = currentPiece.y;

    switch (direction) {
        case 'left':
            newX--;
            break;
        case 'right':
            newX++;
            break;
        case 'up':  // Added 'up' case
            newY--;
            break;
        case 'down':
            newY++;
            break;
    }

    if (isValidMove(newX, newY)) {
        currentPiece.x = newX;
        currentPiece.y = newY;
    } else {
        placePiece();
        spawnPiece(); // Spawn new piece immediately after placing
        lastMove = null;
    }
}


function isValidMove(x, y, shape = currentPiece.shape) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newX = x + col;
                const newY = y + row;
                if (newX < 0 || newX >= GRID_WIDTH || newY < 0 || newY >= GRID_HEIGHT || (grid[newY] && grid[newY][newX])) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placePiece() {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                const x = currentPiece.x + col;
                const y = currentPiece.y + row;
                if (y >= 0 && y < GRID_HEIGHT && x >= 0 && x < GRID_WIDTH) {
                    grid[y][x] = 1;
                }
            }
        }
    }
}

function clearLines() {
    let linesCleared = 0;
    let isMultiDirection = false;

    // Check horizontal lines
    for (let row = 0; row < GRID_HEIGHT; row++) {
        if (grid[row].every(cell => cell === 1)) {
            grid.splice(row, 1);
            grid.unshift(Array(GRID_WIDTH).fill(0));
            linesCleared++;
        }
    }

    // Check vertical lines
    for (let col = 0; col < GRID_WIDTH; col++) {
        if (grid.every(row => row[col] === 1)) {
            for (let row = 0; row < GRID_HEIGHT; row++) {
                grid[row][col] = 0;
            }
            linesCleared++;
            isMultiDirection = true;
        }
    }


    // Update score
    if (linesCleared > 0) {
        const multiplier = isMultiDirection ? 8 : (linesCleared >= 3 ? 4 : (linesCleared === 2 ? 2 : 1));
        score += linesCleared * 100 * multiplier;
        scoreElement.textContent = `Score: ${score}`;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.setLineDash([2, 2]);
    for (let x = 0; x <= GRID_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= GRID_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(canvas.width, y * CELL_SIZE);
        ctx.stroke();
    }
    ctx.setLineDash([]);


    // Draw placed pieces
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            if (grid[row][col]) {
                ctx.fillStyle = '#333'; // Or any color you want for placed pieces
                ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    // Draw current piece
    if (currentPiece) {
        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col]) {
                    const x = (currentPiece.x + col) * CELL_SIZE;
                    const y = (currentPiece.y + row) * CELL_SIZE;
                    ctx.fillStyle = currentPiece.color;
                    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                }
            }
        }
    }

        // Draw core
        const coreX = Math.floor(GRID_WIDTH / 2) * CELL_SIZE;
        const coreY = Math.floor(GRID_HEIGHT / 2) * CELL_SIZE;
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(coreX, coreY, CELL_SIZE / 4, 0, 2 * Math.PI);
        ctx.fill();
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowLeft':
            lastMove = 'left';
            movePiece('left'); // Move immediately on key press
            break;
        case 'ArrowRight':
            lastMove = 'right';
            movePiece('right'); // Move immediately on key press
            break;
        case 'ArrowUp': // Added ArrowUp case
            lastMove = 'up';
            movePiece('up'); // Move immediately on key press
            break;
        case 'ArrowDown':
            lastMove = 'down';
            movePiece('down'); // Move immediately on key press
            break;
        case ' ':
            rotatePiece();
            break;
    }
}


function rotatePiece() {
    const rotated = [];
    for (let i = 0; i < currentPiece.shape[0].length; i++) {
        const row = [];
        for (let j = currentPiece.shape.length - 1; j >= 0; j--) {
            row.push(currentPiece.shape[j][i]);
        }
        rotated.push(row);
    }

    if (isValidMove(currentPiece.x, currentPiece.y, rotated)) {
        currentPiece.shape = rotated;
    }
}


window.addEventListener('resize', () => {
    resizeCanvas();
    initGrid();
    draw();
});
