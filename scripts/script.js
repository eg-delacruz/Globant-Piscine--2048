import {
  printGrid,
  generateTile,
  handleKeyDown,
  restartGame,
  createEmptyTile,
} from "./game.js";

import { GRID_HEIGHT, GRID_WIDTH, tileId } from "./variables.js";

const board = Array(GRID_HEIGHT)
  .fill(0)
  .map(() => Array(GRID_WIDTH).fill(0).map(createEmptyTile));

let state = { score: 0, gameOver: false };

generateTile(board);
generateTile(board);

printGrid(board, state.score);

// Event listeners
document.addEventListener("keydown", (event) =>
  handleKeyDown(event, board, state)
);

const reset_btn = document.getElementById("restart-btn");
reset_btn.addEventListener("click", () => restartGame(board, state));

const reset_btn_2 = document.getElementById("restart-btn-2");
reset_btn_2.addEventListener("click", () => restartGame(board, state));
