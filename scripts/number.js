import { grid } from './game.js';

export const number = {
  spawn: function () {
    const emptyCellIndex = grid.randomEmptyCellIndex();

    if (emptyCellIndex === false) {
      return false;
    }

    const numberElement = document.createElement('div');
    const numberValue = Math.random() < 0.9 ? 2 : 4;

    numberElement.innerText = numberValue;
    numberElement.dataset.value = numberValue;
    numberElement.classList.add('number');

    numberElement.style.top = `${grid.cells[emptyCellIndex].top}px`;
    numberElement.style.left = `${grid.cells[emptyCellIndex].left}px`;

    grid.cells[emptyCellIndex].number = numberElement;

    grid.gridElem.append(numberElement);

    return true;
  },

  // Move number from one cell to another
  moveTo: function (fromCell, toCell) {
    const number = fromCell.number;

    if (toCell.number === null) {
      // target cell is empty fill with number
      number.style.top = `${toCell.top}px`;
      number.style.left = `${toCell.left}px`;

      toCell.number = number;
      fromCell.number = null;
    } else if (number.dataset.value === toCell.number.dataset.value) {
      // target cell has same number
      // merge both cell

      number.style.top = `${toCell.top}px`;
      number.style.left = `${toCell.left}px`;
      number.style.opacity = '0';

      // remove number DOM element after transition
      setTimeout(() => {
        grid.gridElem.removeChild(number);
      }, 500);

      // double target cell's number
      const newNumberValue = toCell.number.dataset.value * 2;
      toCell.number.dataset.value = newNumberValue;
      toCell.number.innerText = newNumberValue;

      // update score
      grid.score += newNumberValue;

      fromCell.number = null;
    }
  },
};
