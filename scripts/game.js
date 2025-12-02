import { GRID_HEIGHT, GRID_WIDTH, CELL_SIZE, GAP_SIZE } from "./variables.js";
import { getRandomArrElem, mirrorMatrix, transposeMatrix } from "./utils.js";

export const createEmptyTile = () => ({
  value: 0,
  id: null, // Empty tiles don't need a unique ID
  previousPos: null,
  mergedFrom: null,
  isNew: false, // Useful flag for rendering
});

const setTilePosition = (tile, row, col) => {
  const x = col * (CELL_SIZE + GAP_SIZE);
  const y = row * (CELL_SIZE + GAP_SIZE);

  tile.style.left = `${x}px`;
  tile.style.top = `${y}px`;
};

export const printGrid = (board, score) => {
  const grid_container = document.getElementById("grid-container");
  const score_span = document.getElementById("score");

  // Clear previous grid
  grid_container.innerHTML = "";

  // Set updated score
  score_span.innerHTML = score;

  // Render background grid
  for (let i = 0; i < GRID_HEIGHT; ++i) {
    for (let j = 0; j < GRID_WIDTH; ++j) {
      const div = document.createElement("div");
      div.className = "bg-tile";
      grid_container.append(div);
    }
  }

  // Render tiles with values
  for (let i = 0; i < GRID_HEIGHT; ++i) {
    for (let j = 0; j < GRID_WIDTH; ++j) {
      if (board[i][j].value === 0) continue;
      const div = document.createElement("div");
      div.id = `tile_${i}_${j}`;
      div.className = "tile";
      grid_container.append(div);
      div.setAttribute("data-value", board[i][j].value);
      setTilePosition(div, i, j);
      if (board[i][j].value != 0) div.textContent = board[i][j].value;
      else div.textContent = "";
    }
  }
};

const printGameOver = (score) => {
  const game_over_container = document.querySelector(".game_over_container");
  game_over_container.classList.add("show");
  const final_score_span = document.getElementById("final-score");
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
      id: `tile_${Date.now()}`, // Unique ID based on timestamp
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
  const game_over_container = document.querySelector(".game_over_container");
  game_over_container.classList.remove("show");
};

// Row should go from where the move starts
const compressRow = (row) => {
  const non_zeros = [];
  const zeros = []; //I could count how many zeros I still have if needed in the future

  for (let i = 0; i < row.length; ++i) {
    if (row[i].value != 0) non_zeros.push(row[i]);
    else zeros.push(row[i]);
  }

  for (let j = 0; j < non_zeros.length; ++j) row[j] = non_zeros[j];

  for (let k = non_zeros.length; k < row.length; k++)
    row[k] = createEmptyTile();
};

const mergeRow = (row, state) => {
  compressRow(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i].value !== 0 && row[i].value === row[i + 1].value) {
      row[i].value *= 2;
      state.score += row[i + 1].value;
      row[i + 1] = createEmptyTile();
      i++; // skip next cell
    }
  }

  compressRow(row);
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

const checkGameOver = (board, state) => {
  let isBoardFull = true;

  for (let i = 0; i < GRID_HEIGHT; ++i) {
    for (let j = 0; j < GRID_HEIGHT; ++j) {
      if (board[i][j].value === 0) isBoardFull = false;
    }
  }

  if (isBoardFull && !canMerge(board)) state.gameOver = true;
};

// Used to add new top and left moves before printing the grid
// const compareBoards = (board1, board2) => {
//   for (let i = 0; i < GRID_HEIGHT; ++i) {
//     for (let j = 0; j < GRID_WIDTH; ++j) {
//       if (board1[i][j] !== board2[i][j]) {
//       }
//     }
//   }
// };

export const handleKeyDown = (event, board, state) => {
  const { key } = event;

  // Return in case key is not any of the four allowed keys
  if (
    (key != "ArrowUp" &&
      key != "ArrowDown" &&
      key != "ArrowLeft" &&
      key != "ArrowRight") ||
    state.gameOver
  )
    return;

  // Deep copy TODO: erase if not needed
  // const boardCopy = board.map((row) => row.slice());

  if (key == "ArrowUp") {
    transposeMatrix(board);

    for (let i = 0; i < GRID_WIDTH; ++i) mergeRow(board[i], state);

    transposeMatrix(board);
  } else if (key == "ArrowDown") {
    // Transpose matrix
    transposeMatrix(board);

    // Mirror matrix
    mirrorMatrix(board);

    for (let i = 0; i < GRID_WIDTH; ++i) mergeRow(board[i], state);

    // Mirror matrix back
    mirrorMatrix(board);

    // Transpose matrix back
    transposeMatrix(board);
  } else if (key == "ArrowLeft") {
    for (let i = 0; i < GRID_WIDTH; ++i) mergeRow(board[i], state);
  } else if (key == "ArrowRight") {
    // Mirror matrix
    mirrorMatrix(board);

    for (let i = 0; i < GRID_WIDTH; ++i) mergeRow(board[i], state);

    // Mirror matrix back
    mirrorMatrix(board);
  }

  generateTile(board);
  printGrid(board, state.score);
  checkGameOver(board, state);
  if (state.gameOver) printGameOver(state.score);
};
