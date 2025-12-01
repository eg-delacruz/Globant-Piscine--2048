import { GRID_HEIGHT, GRID_WIDTH } from './variables.js'
import { getRandomArrElem, mirrorMatrix, transposeMatrix } from './utils.js';

export const printGrid = (board) => {
    const grid_container = document.getElementById("grid-container");

    // Clear previous grid
    grid_container.innerHTML = '';

    for (let i = 0; i < GRID_HEIGHT; ++i) {
        for (let j = 0; j < GRID_WIDTH; ++j) {
            const div = document.createElement('div');
            div.id = `tile_${i}_${j}`;
            div.className = 'tile';
            grid_container.append(div);
            div.setAttribute('data-value', board[i][j]);
            if (board[i][j] != 0)
                div.textContent = board[i][j];
            else
                div.textContent = '';
        }
    }
}

export const generateTile = (board) => {
    const empty_cells = [];

    for (let i = 0; i < GRID_HEIGHT; ++i) {
        for (let j = 0; j < GRID_WIDTH; ++j) {
            if (board[i][j] == 0)
                empty_cells.push([i, j]);
        }
    }

    if (empty_cells.length > 0) {
        const random_cell = getRandomArrElem(empty_cells);
        board[random_cell[0]][random_cell[1]] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Row should go from where the move starts
const compressRow = (row) => {
    const non_zeros = [];
    const zeros = []; //I could count how many zeros I still have if needed in the future

    for (let i = 0; i < row.length; ++i) {
        if (row[i] != 0)
            non_zeros.push(row[i]);
        else
            zeros.push(0);
    }

    for (let j = 0; j < non_zeros.length; ++j)
        row[j] = non_zeros[j];

    for (let k = non_zeros.length; k < row.length; k++)
        row[k] = 0;

}

const mergeRow = (row) => {
    compressRow(row);

    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            i++; // skip next cell because it can't merge again in same move
        }
    }

    compressRow(row);
};


export const handleKeyDown = (event, board) => {
    const { key } = event;

    // Return in case key is not any of the four allowed keys
    if (key != "ArrowUp" && key != "ArrowDown" && key != "ArrowLeft" && key != "ArrowRight")
        return;

    if (key == "ArrowUp") {
        transposeMatrix(board);

        for (let i = 0; i < GRID_WIDTH; ++i)
            mergeRow(board[i]);

        transposeMatrix(board);
    }
    else if (key == "ArrowDown") {
        // Transpose matrix
        transposeMatrix(board);

        // Mirror matrix
        mirrorMatrix(board);

        for (let i = 0; i < GRID_WIDTH; ++i)
            mergeRow(board[i]);

        // Mirror matrix back
        mirrorMatrix(board);

        // Transpose matrix back
        transposeMatrix(board);
    }
    else if (key == "ArrowLeft") {
        for (let i = 0; i < GRID_WIDTH; ++i)
            mergeRow(board[i]);
    }
    else if (key == "ArrowRight") {
        // Mirror matrix
        mirrorMatrix(board);

        for (let i = 0; i < GRID_WIDTH; ++i)
            mergeRow(board[i]);

        // Mirror matrix back
        mirrorMatrix(board);
    }

    generateTile(board);
    printGrid(board);
}
