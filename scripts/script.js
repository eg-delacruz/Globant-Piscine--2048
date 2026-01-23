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

  if (direction !== null && grid.playable && !grid.gameOver && !grid.gameWon) {
    grid.slide(direction);
  }

  return false;
});

const reset_btn = document.getElementById('restart-btn');
reset_btn.addEventListener('click', () => grid.restart());

const reset_btn_2 = document.getElementById('restart-btn-2');
reset_btn_2.addEventListener('click', () => grid.restart());

const reset_btn_3 = document.getElementById('restart-btn-3');
reset_btn_3.addEventListener('click', () => grid.restart());
