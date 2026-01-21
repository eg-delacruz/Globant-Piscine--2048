import {
  GRID_HEIGHT,
  GRID_WIDTH,
  CELL_SIZE,
  GAP_SIZE,
  getNextTileId,
} from './variables.js';
import { getRandomArrElem, mirrorMatrix, transposeMatrix } from './utils.js';

export const createEmptyTile = () => ({
  value: 0,
  previousPos: { r: -1, c: -1 },
  mergedFrom: null,
  moved: false,
  id: null,
});

const setTilePosition = (tile, row, col) => {
  const x = col * (CELL_SIZE + GAP_SIZE);
  const y = row * (CELL_SIZE + GAP_SIZE);

  // tile.style.left = `${x}px`;
  // tile.style.top = `${y}px`;

  tile.style.transform = `translate(${x}px, ${y}px)`;
};

export const printGrid = (board, score) => {
  const grid_container = document.getElementById('grid-container');
  const score_span = document.getElementById('score');

  // Clear previous grid
  grid_container.innerHTML = '';

  // Set updated score
  score_span.innerHTML = score;

  // Render background grid
  for (let i = 0; i < GRID_HEIGHT; ++i) {
    for (let j = 0; j < GRID_WIDTH; ++j) {
      const div = document.createElement('div');
      div.className = 'bg-tile';
      grid_container.append(div);
    }
  }

  // Render tiles with values
  for (let i = 0; i < GRID_HEIGHT; ++i) {
    for (let j = 0; j < GRID_WIDTH; ++j) {
      if (board[i][j].value === 0) continue;
      const div = document.createElement('div');
      div.className = 'tile';
      div.id = board[i][j].id;
      grid_container.append(div);
      div.setAttribute('data-value', board[i][j].value);
      setTilePosition(div, i, j);
      if (board[i][j].value != 0) div.textContent = board[i][j].value;
      else div.textContent = '';
    }
  }
};

const printGameOver = (score) => {
  const game_over_container = document.querySelector('.game_over_container');
  game_over_container.classList.add('show');
  const final_score_span = document.getElementById('final-score');
  final_score_span.textContent = score;
};

const printGameWon = (score) => {
  const game_won_container = document.querySelector('.game_won_container');
  game_won_container.classList.add('show');
  const final_score_span = document.getElementById('won-score');
  final_score_span.textContent = score;
};

// Generate a random tile (2 or 4) in an empty cell
export const generateTile = (board) => {
  const empty_cells = [];

  for (let i = 0; i < GRID_HEIGHT; ++i) {
    for (let j = 0; j < GRID_WIDTH; ++j) {
      if (board[i][j].value == 0) empty_cells.push([i, j]);
    }
  }

  if (empty_cells.length > 0) {
    const random_cell = getRandomArrElem(empty_cells);
    const value = Math.random() < 0.9 ? 2 : 4;
    board[random_cell[0]][random_cell[1]] = {
      value: value,
      id: getNextTileId(),
      previousPos: null,
      mergedFrom: null,
      isNew: true,
    };
  }
};

export const restartGame = (board, state) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j].value = 0;
    }
  }
  state.score = 0;
  state.gameOver = false;
  generateTile(board);
  generateTile(board);
  printGrid(board, state.score);
  const game_over_container = document.querySelector('.game_over_container');
  game_over_container.classList.remove('show');
  const game_won_container = document.querySelector('.game_won_container');
  game_won_container.classList.remove('show');
};

// Row should go from where the move starts
// coordinates: could have the row or column index depending on the move direction
// The value that is null shuld be set inside compressRow
const compressRow = (row, coordinates, track_coordinates, key_value) => {
  const old_row = [...row];
  const non_zeros = [];
  const temp_row = [];

  for (let i = 0; i < row.length; ++i) {
    if (row[i].value !== 0) {
      const tileObject = row[i];

      if (track_coordinates) {
        let cell_coordinates;

        if (key_value === 'ArrowLeft') {
          cell_coordinates = { r: coordinates.r, c: i };
        } else if (key_value === 'ArrowRight') {
          cell_coordinates = { r: coordinates.r, c: row.length - 1 - i };
        } else if (key_value === 'ArrowUp') {
          cell_coordinates = { r: i, c: coordinates.c };
        } else if (key_value === 'ArrowDown') {
          cell_coordinates = { r: row.length - 1 - i, c: coordinates.c };
        }

        tileObject.previousPos = cell_coordinates;
      }
      non_zeros.push(tileObject);
    }
  }

  const newRow = [
    ...non_zeros,
    ...Array(row.length - non_zeros.length).fill(createEmptyTile()),
  ];

  for (let i = 0; i < row.length; i++) {
    if (track_coordinates && newRow[i] !== old_row[i]) newRow[i].moved = true;
    row[i] = newRow[i];
  }
};

const mergeRow = (row, state, coordinates, key_value) => {
  compressRow(row, coordinates, true, key_value);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i].value !== 0 && row[i].value === row[i + 1].value) {
      row[i].mergedFrom = [
        { id: row[i].id, previousPos: row[i].previousPos },
        { id: row[i + 1].id, previousPos: row[i + 1].previousPos },
      ];

      row[i].value *= 2;
      state.score += row[i + 1].value;
      row[i + 1] = createEmptyTile();

      i++; // skip next cell
    }
  }

  compressRow(row, coordinates, false, key_value);
};

const canMerge = (board) => {
  for (let i = 0; i < GRID_HEIGHT; ++i) {
    for (let j = 0; j < GRID_WIDTH; ++j) {
      const current = board[i][j];

      // Check right neighbor
      if (j + 1 < GRID_WIDTH && board[i][j + 1] === current.value) return true;
      // Check down neighbor
      if (i + 1 < GRID_HEIGHT && board[i + 1][j] === current.value) return true;
      // Check left neighbor
      if (j - 1 >= 0 && board[i][j - 1] === current.value) return true;
      // Check up neighbor
      if (i - 1 >= 0 && board[i - 1][j] === current.value) return true;
    }
  }
  return false;
};

// Find all tiles that moved and animate them to their new position
const animateMove = (board) => {
  for (let i = 0; i < GRID_HEIGHT; ++i) {
    for (let j = 0; j < GRID_WIDTH; ++j) {
      const tile = board[i][j];
      const tile_div = document.getElementById(tile.id);
      if (
        tile.moved &&
        tile_div &&
        tile.previousPos.r !== -1 &&
        tile.previousPos.c !== -1
      ) {
        tile_div.style.transition = 'none';
        setTilePosition(tile_div, tile.previousPos.r, tile.previousPos.c);
        tile_div.offsetHeight;
        tile_div.style.transition =
          'top 0.15s ease-in-out, left 0.15s ease-in-out';
        setTilePosition(tile_div, i, j);
        tile.moved = false;
        tile.previousPos = { r: -1, c: -1 };
      }
    }
  }
};

const checkGameOver = (board, state) => {
  let isBoardFull = true;

  for (let i = 0; i < GRID_HEIGHT; ++i) {
    for (let j = 0; j < GRID_HEIGHT; ++j) {
      if (board[i][j].value === 0) isBoardFull = false;
    }
  }

  if (isBoardFull && !canMerge(board)) state.gameOver = true;
};

const checkGameWon = (board, state) => {
  for (let i = 0; i < GRID_HEIGHT; ++i) {
    for (let j = 0; j < GRID_WIDTH; ++j) {
      if (board[i][j].value === 2048) {
        state.game_won = true;
        return;
      }
    }
  }
};

export const handleKeyDown = (event, board, state) => {
  const { key } = event;

  // Return in case key is not any of the four allowed keys
  if (
    (key != 'ArrowUp' &&
      key != 'ArrowDown' &&
      key != 'ArrowLeft' &&
      key != 'ArrowRight') ||
    state.gameOver
  )
    return;

  switch (key) {
    case 'ArrowUp':
      transposeMatrix(board);
      for (let i = 0; i < GRID_WIDTH; ++i)
        mergeRow(board[i], state, { r: -1, c: i }, key);
      transposeMatrix(board);
      break;
    case 'ArrowDown':
      transposeMatrix(board);
      mirrorMatrix(board);
      for (let i = 0; i < GRID_WIDTH; ++i)
        mergeRow(board[i], state, { r: -1, c: i }, key);
      mirrorMatrix(board);
      transposeMatrix(board);
      break;
    case 'ArrowLeft':
      for (let i = 0; i < GRID_WIDTH; ++i)
        mergeRow(board[i], state, { r: i, c: -1 }, key);
      break;
    case 'ArrowRight':
      mirrorMatrix(board);
      for (let i = 0; i < GRID_WIDTH; ++i)
        mergeRow(board[i], state, { r: i, c: -1 }, key);
      mirrorMatrix(board);
      break;
  }

  animateMove(board);
  generateTile(board);
  printGrid(board, state.score);
  checkGameWon(board, state);
  if (state.game_won) printGameWon(state.score);
  else {
    checkGameOver(board, state);
    if (state.gameOver) printGameOver(state.score);
  }
};

//////////////////// New code (start) ////////////////////

import { TOTAL_CELLS } from './variables.js';
import { number } from './number.js';

export const grid = {
  gridElem: document.getElementsByClassName('grid-container')[0],
  cells: [],
  playable: false,
  score: 0,
  gameOver: false,
  gameWon: false,
  // First row/column indexes for each direction
  directionRoots: {
    UP: [1, 2, 3, 4],
    DOWN: [13, 14, 15, 16],
    LEFT: [1, 5, 9, 13],
    RIGHT: [4, 8, 12, 16],
  },
  init: function () {
    // Create div cell elements in grid container
    for (let i = 0; i < TOTAL_CELLS; ++i) {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'cell';
      this.gridElem.append(cellDiv);
    }
    const cellElements = document.getElementsByClassName('cell');
    let cellIndex = 1;
    for (let cellElement of cellElements) {
      this.cells[cellIndex] = {
        element: cellElement, //Stores the cell DOM element
        top: cellElement.offsetTop, // position relative to grid
        left: cellElement.offsetLeft, // position relative to grid
        number: null, // Will store the number DOM element that will be placed on this cell
      };
      cellIndex++;
    }
    // spawn first numbers and start game
    number.spawn();
    number.spawn();
    this.playable = true;
  },
  randomEmptyCellIndex: function () {
    let emptyCells = [];

    for (let i = 1; i < this.cells.length; i++) {
      if (this.cells[i].number === null) {
        emptyCells.push(i);
      }
    }

    if (emptyCells.length === 0) {
      // no empty cell, game over
      return false;
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  },
  slide: function (direction) {
    if (!this.playable) {
      return false;
    }

    // set playable to false to prevent continous slides
    this.playable = false;

    // get direction's grid root indexes
    const roots = this.directionRoots[direction];

    // indexes increments or decrements depend on direction
    let increment = direction === 'RIGHT' || direction === 'DOWN' ? -1 : 1;

    // indexes moves by
    increment *= direction === 'UP' || direction === 'DOWN' ? 4 : 1;

    // start loop with root index
    for (let i = 0; i < roots.length; i++) {
      const root = roots[i];

      // increment or decrement through grid from root
      // j starts from 1 bc no need to check root cell
      for (let j = 1; j < 4; j++) {
        const cellIndex = root + j * increment;
        const cell = this.cells[cellIndex];

        if (cell.number !== null) {
          let moveToCell = null;

          // check if cells below(to root) this cell is empty or has same number
          // to decide to move or stay
          // k starts from j-1 first cell below j
          // k ends by 0 which is root cell
          for (let k = j - 1; k >= 0; k--) {
            const foreCellIndex = root + k * increment;
            const foreCell = this.cells[foreCellIndex];

            if (foreCell.number === null) {
              // the cell is empty, move to and check next cell
              moveToCell = foreCell;
            } else if (
              cell.number.dataset.value === foreCell.number.dataset.value
            ) {
              // the cell has same number, move, merge and stop
              moveToCell = foreCell;
              break;
            } else {
              // next cell is not empty and not same with moving number(number is possibly changing, cell is not)
              // number can't go further
              break;
            }
          }

          if (moveToCell !== null) {
            number.moveTo(cell, moveToCell);
          }
        }
      }
    }

    // spawn a new number and make game playable
    setTimeout(function () {
      if (number.spawn()) {
        grid.playable = true;
      } else {
        alert('GAME OVER!');
      }
    }, 500);
  },
};

//////////////////// New code (end) ////////////////////
