import { GRID_HEIGHT } from "./variables.js";

export const getRandomArrElem = (arr) => {
    const random_index = Math.floor(Math.random() * arr.length);
    return arr[random_index];
}

export const reverseArray = (arr) => {
    const reversed = [];
    for (let i = arr.length - 1; i >= 0; --i)
        reversed.push(arr[i]);
    for (let j = 0; j < arr.length; ++j)
        arr[j] = reversed[j];
}

export const mirrorMatrix = (matrix) => {
    for (let i = 0; i < GRID_HEIGHT; ++i)
        reverseArray(matrix[i]);
}

// Transpose rows into columns and vice versa
export const transposeMatrix = (matrix) => {
    const size = matrix.length;
    for (let i = 0; i < size; i++) {
        for (let j = i + 1; j < size; j++) {
            const temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
}