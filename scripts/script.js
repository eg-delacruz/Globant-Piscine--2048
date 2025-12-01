import { printGrid, generateTile, handleKeyDown } from './game.js';

const board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

generateTile(board);
generateTile(board);

printGrid(board);

// Event listeners
document.addEventListener("keydown", event => handleKeyDown(event, board));

// TODO: how often should I add a new tile during each iteration?

// console.log(board);