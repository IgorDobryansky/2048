document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 6;
    let score = 0;
    let board = initialize();
    let emptyTiles = [];

    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');

    function initialize(size = boardSize) {
        return Array(size)
            .fill(null)
            .map(() => Array(size).fill(0));
    }

    const setGridColumns = (size = boardSize) => {
        gameBoard.style.gridTemplateColumns = `repeat(${size}, var(--cell-size))`;
    };

    const updateScore = (value = 0) => {
        score += value;
        scoreElement.textContent = `Score: ${score}`;
    };

    const createBoard = () => {
        gameBoard.innerHTML = '';

        board.flat().forEach((value) => {
            const cell = createCell(value);
            gameBoard.appendChild(cell);
        });
    };

    const createCell = (value) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = value !== 0 ? value : '';
        return cell;
    };

    const updateEmptyTiles = () => {
        emptyTiles = [];

        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (board[row][col] === 0) {
                    emptyTiles.push([row, col]);
                }
            }
        }
    };

    const addRandomTile = () => {
        if (emptyTiles.length === 0) {
            return;
        }

        const emptyTileCount = emptyTiles.length;
        const randomIndex = Math.floor(Math.random() * emptyTileCount);
        const [row, col] = emptyTiles[randomIndex];

        board[row][col] = Math.random() < 0.9 ? 2 : 4;

        emptyTiles.splice(randomIndex, 1);
    };

    const slide = (row) => {
        let newRow = row.filter((val) => val !== 0);

        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;

                updateScore(newRow[i]);

                newRow[i + 1] = 0;
            }
        }

        newRow = newRow.filter((val) => val !== 0);

        while (newRow.length < boardSize) {
            newRow.push(0);
        }

        return newRow;
    };

    const rotateBoard = (times) => {
        for (let t = 0; t < times; t++) {
            const newBoard = initialize(boardSize);
            for (let i = 0; i < boardSize; ++i) {
                for (let j = 0; j < boardSize; ++j) {
                    newBoard[j][boardSize - 1 - i] = board[i][j];
                }
            }
            board = newBoard;
        }
    };

    const isGameOver = () => {
        if (emptyTiles.length > 0) return false;

        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (
                    (row < boardSize - 1 &&
                        board[row][col] === board[row + 1][col]) ||
                    (col < boardSize - 1 &&
                        board[row][col] === board[row][col + 1])
                ) {
                    return false;
                }
            }
        }
        return true;
    };

    const move = (dir) => {
        const rotationCount = getRotationCount(dir);

        rotateBoard(rotationCount);

        const changed = moveTiles();

        rotateBoard((4 - rotationCount) % 4);

        if (changed) {
            addRandomTile();
            createBoard();

            if (isGameOver()) {
                alert(`Game Over! Score: ${score}`);
            }
        }
    };

    const getRotationCount = (dir) => {
        switch (dir) {
            case 'ArrowUp':
                return 3;
            case 'ArrowRight':
                return 2;
            case 'ArrowDown':
                return 1;
            case 'ArrowLeft':
                return 0;
            default:
                return 0;
        }
    };

    const moveTiles = () => {
        let changed = false;

        for (let i = 0; i < boardSize; i++) {
            const originalRow = [...board[i]];

            board[i] = slide(board[i]);

            if (board[i].toString() !== originalRow.toString()) {
                changed = true;
            }
        }
        updateEmptyTiles();
        return changed;
    };

    document.addEventListener('keydown', (e) => {
        const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

        if (arrows.includes(e.key)) {
            move(e.key);
        }
    });

    setGridColumns();
    updateEmptyTiles();
    addRandomTile();
    addRandomTile();
    createBoard();
    updateScore();
});
