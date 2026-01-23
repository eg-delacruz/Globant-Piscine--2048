import { TOTAL_CELLS } from './variables.js';
import { number } from './number.js';

export const grid = {
  // Attributes
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

  // Methods
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

  // As long as there is at least one empty cell, return a random empty cell index
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
    // i loops through each root
    for (let i = 0; i < roots.length; i++) {
      const root = roots[i];

      // increment or decrement through grid from root
      // j starts from 1 bc no need to check root cell
      // J and k are used to check cells relative to root
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
              // the cell has same number, move, merge and stop to prevent further merges in one slide
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

    // Update score display
    const scoreElem = document.getElementById('score');
    scoreElem.innerText = this.score;

    // Won game check (user reaches 2048 number)
    if (!this.gameWon) {
      for (let i = 1; i < this.cells.length; i++) {
        const cell = this.cells[i];
        if (cell.number !== null && cell.number.dataset.value == 2048) {
          this.gameWon = true;
          this.playable = false;

          const game_won_modal = document.querySelector('.game_won_container');
          game_won_modal.classList.add('show');
          const final_score_elem = document.getElementById('won-score');
          final_score_elem.innerText = this.score;
          break;
        }
      }
    }

    // spawn a new number and make game playable
    setTimeout(function () {
      if (number.spawn()) {
        grid.playable = true;
      } else {
        const game_over_modal = document.querySelector('.game_over_container');
        game_over_modal.classList.add('show');
        grid.gameOver = true;

        const scoreElem = document.getElementById('final-score');
        scoreElem.innerText = grid.score;
      }
    }, 500);
  },

  restart: function () {
    // Remove all number elements from grid
    for (let i = 1; i < this.cells.length; i++) {
      const cell = this.cells[i];
      if (cell.number !== null) {
        this.gridElem.removeChild(cell.number);
        cell.number = null;
      }
    }

    // reset attributes
    this.playable = false;
    this.score = 0;
    this.gameOver = false;
    this.gameWon = false;

    // spawn first numbers and start game
    number.spawn();
    number.spawn();
    this.playable = true;

    // reset score display
    const scoreElem = document.getElementById('score');
    scoreElem.innerText = this.score;

    // hide modals
    const game_over_modal = document.querySelector('.game_over_container');
    game_over_modal.classList.remove('show');

    const game_won_modal = document.querySelector('.game_won_container');
    game_won_modal.classList.remove('show');
  },
};
