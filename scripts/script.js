import { restartGame } from './game.js';

import { GRID_HEIGHT, GRID_WIDTH } from './variables.js';

import { grid } from './game.js';

grid.init();

// Event listeners
document.addEventListener('keydown', ({ key }) => {
  let direction = null;

  if (key === 'ArrowUp') {
    direction = 'UP';
  } else if (key === 'ArrowRight') {
    direction = 'RIGHT';
  } else if (key === 'ArrowDown') {
    direction = 'DOWN';
  } else if (key === 'ArrowLeft') {
    direction = 'LEFT';
  }

  if (direction !== null) {
    grid.slide(direction);
  }

  return false;
});

const reset_btn = document.getElementById('restart-btn');
reset_btn.addEventListener('click', () => restartGame(board, state));

const reset_btn_2 = document.getElementById('restart-btn-2');
reset_btn_2.addEventListener('click', () => restartGame(board, state));

const reset_btn_3 = document.getElementById('restart-btn-3');
reset_btn_3.addEventListener('click', () => restartGame(board, state));
