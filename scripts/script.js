import { printGrid, generateTile, handleKeyDown, restartGame } from "./game.js";

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

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
