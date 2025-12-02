import {
  printGrid,
  generateTile,
  handleKeyDown,
  restartGame,
  createEmptyTile,
} from "./game.js";

import { GRID_HEIGHT, GRID_WIDTH } from "./variables.js";

// Instead of having numbers in the matrix, each element should be a tile object like: [
//   {value: 2, id: 'A', previousPos: {r: 0, c: 0}, mergedFrom: null},
//   {value: 4, id: 'B', previousPos: {r: 0, c: 2}, mergedFrom: null},
//   {value: 0, ...},
//   {value: 0, ...}
// ]

const board = Array(GRID_HEIGHT)
  .fill(0)
  .map(() => Array(GRID_WIDTH).fill(0).map(createEmptyTile));

let state = { score: 0, gameOver: false };

generateTile(board);
generateTile(board);

printGrid(board, state.score);

console.log("Board before: ", board);

// Event listeners
document.addEventListener("keydown", (event) =>
  handleKeyDown(event, board, state)
);

const reset_btn = document.getElementById("restart-btn");
reset_btn.addEventListener("click", () => restartGame(board, state));

const reset_btn_2 = document.getElementById("restart-btn-2");
reset_btn_2.addEventListener("click", () => restartGame(board, state));
