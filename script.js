const board = document.getElementById('game-board');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('resetBtn');
const pvpBtn = document.getElementById('pvpBtn');
const pvaiBtn = document.getElementById('pvaiBtn');

let gameBoard = ['', '', '', '', '', '', '', '', '']; // Empty board
let currentPlayer = 'X'; // X always starts
let isGameOver = false;
let gameMode = null; // 'pvp' or 'pvai'

// Initialize the board with clickable divs
function createBoard() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handlePlayerMove);
        board.appendChild(cell);
    }
}

// Handle player's move
function handlePlayerMove(event) {
    const index = event.target.getAttribute('data-index');
    if (gameBoard[index] !== '' || isGameOver) return; // Ignore if cell is filled or game is over

    gameBoard[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    
    if (checkWinner(currentPlayer)) {
        isGameOver = true;
        statusDisplay.textContent = `${currentPlayer} wins!`;
    } else if (gameBoard.every(cell => cell !== '')) {
        isGameOver = true;
        statusDisplay.textContent = 'It\'s a tie!';
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `${currentPlayer}'s turn`;
        if (gameMode === 'pvai' && currentPlayer === 'O') aiMove(); // AI plays automatically if it's 'O' turn in PvAI mode
    }
}

// Check if the current player has won
function checkWinner(player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winningCombinations.some(combination => 
        combination.every(index => gameBoard[index] === player)
    );
}

// AI Move
function aiMove() {
    const availableMoves = gameBoard
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);
    
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    
    gameBoard[randomMove] = 'O';
    document.querySelector(`[data-index="${randomMove}"]`).textContent = 'O';

    if (checkWinner('O')) {
        isGameOver = true;
        statusDisplay.textContent = 'AI (O) wins!';
    } else {
        currentPlayer = 'X';
        statusDisplay.textContent = "Player X's turn";
    }
}

// Reset the game
function resetGame() {
    isGameOver = false;
    currentPlayer = 'X';
    statusDisplay.textContent = "Player X's turn";
    createBoard();
}

// Start Player vs Player mode
function startPvPMode() {
    gameMode = 'pvp';
    statusDisplay.textContent = "Player X's turn";
    createBoard();
}

// Start Player vs AI mode
function startPvAIMode() {
    gameMode = 'pvai';
    statusDisplay.textContent = "Player X's turn";
    createBoard();
}

// Add event listener to reset button
resetButton.addEventListener('click', resetGame);

// Add event listeners to the game mode buttons
pvpBtn.addEventListener('click', startPvPMode);
pvaiBtn.addEventListener('click', startPvAIMode);

// Initialize by showing mode selection
statusDisplay.textContent = "Choose a game mode";
