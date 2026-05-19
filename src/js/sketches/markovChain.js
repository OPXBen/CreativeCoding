export const markovChainSketch = (p) => {

let cols, rows;
let resolution = 10;
let grid;

let framesPerUpdate = 5; // 👈 higher = slower
let counter = 0;

function setup() {
  createCanvas(900, 900);
  cols = width / resolution;
  rows = height / resolution;

  grid = make2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }
}

function draw() {
  background(220);

  // draw grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;

      if (grid[i][j] === 1) {
        fill(0);
        stroke(200);
        rect(x, y, resolution, resolution);
      }
    }
  }

  // only update every N frames
  counter++;
  if (counter % framesPerUpdate === 0) {
    grid = nextGeneration(grid);
  }
}

function nextGeneration(grid) {
  let next = make2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      let neighbors = countNeighbors(grid, i, j);

      if (state === 0 && neighbors === 3) {
        next[i][j] = 1;
      } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0;
      } else {
        next[i][j] = state;
      }
    }
  }

  return next;
}

function countNeighbors(grid, x, y) {
  let sum = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }

  sum -= grid[x][y];
  return sum;
}

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}
}