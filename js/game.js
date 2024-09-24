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

const UNICODE_CHARS = ['□', '■', '▢', '▣', '▤', '▥', '▦', '▧', '▨', '▩'];

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
    const centerY = Math.floor(GRID_HEIGHT / 2) - Math.floor(randomShape.length / 2);
    currentPiece = {
        shape: randomShape,
        x: centerX,
        y: centerY,
        direction: null
    };
}

function gameLoop() {
    if (currentPiece.direction) {
        movePiece();
    }
    clearLines();
    draw();
}

function movePiece() {
    const newX = currentPiece.x + (currentPiece.direction === 'right' ? 1 : (currentPiece.direction === 'left' ? -1 : 0));
    const newY = currentPiece.y + (currentPiece.direction === 'down' ? 1 : (currentPiece.direction === 'up' ? -1 : 0));

    if (isValidMove(newX, newY)) {
        currentPiece.x = newX;
        currentPiece.y = newY;
    } else {
        placePiece();
        spawnPiece();
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
            grid[row].fill(0);
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

    // Draw grid
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const char = UNICODE_CHARS[grid[row][col]];
            ctx.fillStyle = grid[row][col] ? '#333' : '#eee';
            ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            ctx.fillStyle = grid[row][col] ? '#fff' : '#333';
            ctx.font = `${CELL_SIZE * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(char, col * CELL_SIZE + CELL_SIZE / 2, row * CELL_SIZE + CELL_SIZE / 2);
        }
    }

    // Draw current piece
    if (currentPiece) {
        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col]) {
                    const x = (currentPiece.x + col) * CELL_SIZE;
                    const y = (currentPiece.y + row) * CELL_SIZE;
                    ctx.fillStyle = '#007bff';
                    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                    ctx.fillStyle = '#fff';
                    ctx.font = `${CELL_SIZE * 0.8}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('■', x + CELL_SIZE / 2, y + CELL_SIZE / 2);
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
            currentPiece.direction = 'left';
            break;
        case 'ArrowRight':
            currentPiece.direction = 'right';
            break;
        case 'ArrowUp':
            currentPiece.direction = 'up';
            break;
        case 'ArrowDown':
            currentPiece.direction = 'down';
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

initGame();
