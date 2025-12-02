import {
  GRID_HEIGHT,
  GRID_WIDTH,
  CELL_SIZE,
  GAP_SIZE,
  getNextTileId,
  tileId,
} from "./variables.js";
import { getRandomArrElem, mirrorMatrix, transposeMatrix } from "./utils.js";

export const createEmptyTile = () => ({
  value: 0,
  previousPos: { r: -1, c: -1 },
  mergedFrom: null,
  moved: false,
  id: null,
  game_won: false,
});

const setTilePosition = (tile, row, col) => {
  const x = col * (CELL_SIZE + GAP_SIZE);
  const y = row * (CELL_SIZE + GAP_SIZE);

  // tile.style.left = `${x}px`;
  // tile.style.top = `${y}px`;

  tile.style.transform = `translate(${x}px, ${y}px)`;
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
      div.className = "tile";
      div.id = board[i][j].id;
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
  const game_over_container = document.querySelector(".game_over_container");
  game_over_container.classList.remove("show");
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

        if (key_value === "ArrowLeft") {
          cell_coordinates = { r: coordinates.r, c: i };
        } else if (key_value === "ArrowRight") {
          cell_coordinates = { r: coordinates.r, c: row.length - 1 - i };
        } else if (key_value === "ArrowUp") {
          cell_coordinates = { r: i, c: coordinates.c };
        } else if (key_value === "ArrowDown") {
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
        tile_div.style.transition = "none";
        setTilePosition(tile_div, tile.previousPos.r, tile.previousPos.c);
        tile_div.offsetHeight;
        tile_div.style.transition =
          "top 0.15s ease-in-out, left 0.15s ease-in-out";
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
    (key != "ArrowUp" &&
      key != "ArrowDown" &&
      key != "ArrowLeft" &&
      key != "ArrowRight") ||
    state.gameOver
  )
    return;

  switch (key) {
    case "ArrowUp":
      transposeMatrix(board);
      for (let i = 0; i < GRID_WIDTH; ++i)
        mergeRow(board[i], state, { r: -1, c: i }, key);
      transposeMatrix(board);
      break;
    case "ArrowDown":
      transposeMatrix(board);
      mirrorMatrix(board);
      for (let i = 0; i < GRID_WIDTH; ++i)
        mergeRow(board[i], state, { r: -1, c: i }, key);
      mirrorMatrix(board);
      transposeMatrix(board);
      break;
    case "ArrowLeft":
      for (let i = 0; i < GRID_WIDTH; ++i)
        mergeRow(board[i], state, { r: i, c: -1 }, key);
      break;
    case "ArrowRight":
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
  if (!state.game_won) checkGameOver(board, state);
  if (state.gameOver) printGameOver(state.score);
};
