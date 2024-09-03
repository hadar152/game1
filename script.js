const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const COLORS = [
    'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
];

const tetrominos = [
    [
        [1, 1, 1, 1]
    ], // I
    [
        [1, 1],
        [1, 1]
    ], // O
    [
        [0, 1, 1],
        [1, 1, 0]
    ], // Z
    [
        [1, 1, 0],
        [0, 1, 1]
    ], // S
    [
        [1, 1, 1],
        [0, 1, 0]
    ], // T
    [
        [1, 1, 1],
        [1, 0, 0]
    ], // L
    [
        [1, 1, 1],
        [0, 0, 1]
    ] // J
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentTetromino, currentColor, currentRow, currentCol;
let interval;

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c]) {
                ctx.fillStyle = COLORS[board[r][c] - 1];
                ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#000';
                ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawTetromino() {
    ctx.fillStyle = currentColor;
    for (let r = 0; r < currentTetromino.length; r++) {
        for (let c = 0; c < currentTetromino[r].length; c++) {
            if (currentTetromino[r][c]) {
                ctx.fillRect((currentCol + c) * BLOCK_SIZE, (currentRow + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#000';
                ctx.strokeRect((currentCol + c) * BLOCK_SIZE, (currentRow + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function rotateTetromino() {
    const rotated = currentTetromino[0].map((_, i) => currentTetromino.map(row => row[i])).reverse();
    if (!collides(currentRow, currentCol, rotated)) {
        currentTetromino = rotated;
    }
}

function collides(row, col, tetromino) {
    for (let r = 0; r < tetromino.length; r++) {
        for (let c = 0; c < tetromino[r].length; c++) {
            if (tetromino[r][c] && (
                    col + c < 0 ||
                    col + c >= COLS ||
                    row + r >= ROWS ||
                    board[row + r][col + c]
                )) {
                return true;
            }
        }
    }
    return false;
}

function mergeTetromino() {
    for (let r = 0; r < currentTetromino.length; r++) {
        for (let c = 0; c < currentTetromino[r].length; c++) {
            if (currentTetromino[r][c]) {
                board[currentRow + r][currentCol + c] = COLORS.indexOf(currentColor) + 1;
            }
        }
    }
}

function removeFullRows() {
    board = board.filter(row => row.some(cell => cell === 0));
    while (board.length < ROWS) {
        board.unshift(Array(COLS).fill(0));
    }
}

function dropTetromino() {
    if (!collides(currentRow + 1, currentCol, currentTetromino)) {
        currentRow++;
    } else {
        mergeTetromino();
        removeFullRows();
        generateTetromino();
    }
}

function handleInput(event) {
    switch (event.key) {
        case 'ArrowLeft':
            if (!collides(currentRow, currentCol - 1, currentTetromino)) {
                currentCol--;
            }
            break;
        case 'ArrowRight':
            if (!collides(currentRow, currentCol + 1, currentTetromino)) {
                currentCol++;
            }
            break;
        case 'ArrowDown':
            dropTetromino();
            break;
        case 'ArrowUp':
            rotateTetromino();
            break;
    }
    drawBoard();
    drawTetromino();
}

function generateTetromino() {
    const index = Math.floor(Math.random() * tetrominos.length);
    currentTetromino = tetrominos[index];
    currentColor = COLORS[index];
    currentRow = 0;
    currentCol = Math.floor(COLS / 2) - Math.floor(currentTetromino[0].length / 2);
    if (collides(currentRow, currentCol, currentTetromino)) {
        clearInterval(interval);
        alert('Game Over');
    }
}

function startGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    generateTetromino();
    interval = setInterval(() => {
        dropTetromino();
        drawBoard();
        drawTetromino();
    }, 500);
}

document.addEventListener('keydown', handleInput);
startGame();