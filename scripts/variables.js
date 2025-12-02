export const GRID_HEIGHT = 4;
export const GRID_WIDTH = 4;
export const CELL_SIZE = 80;
export const GAP_SIZE = 10;
export let tileId = 0;

export const getNextTileId = () => {
  return `tile_${tileId++}`;
};
