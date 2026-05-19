export const gameOfLifeSketch = (p) => {
  let cols, rows;
  let resolution = 10;
  let grid;
  let framesPerUpdate = 5;
  let counter = 0;

  p.updateParams = (params) => {
    if (params.resolution) {
      resolution = params.resolution;
      p.restart();
    }
    if (params.speed) {
      framesPerUpdate = params.speed;
    }
  };

  p.restart = () => {
    p.setup();
    p.loop();
  };

  const make2DArray = (cols, rows) => {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
      arr[i] = new Array(rows).fill(0);
    }
    return arr;
  };

  const countNeighbors = (grid, x, y) => {
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
  };

  const nextGeneration = (grid) => {
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
  };

  p.setup = () => {
    p.createCanvas(1600, 800);
    cols = p.width / resolution;
    rows = p.height / resolution;
    grid = make2DArray(cols, rows);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = p.floor(p.random(2));
      }
    }
    p.background(20);
  };

  p.draw = () => {
    p.background(20);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * resolution;
        let y = j * resolution;

        if (grid[i][j] === 1) {
          p.fill(255);
          p.noStroke();
          p.rect(x, y, resolution, resolution);
        }
      }
    }

    counter++;
    if (counter % framesPerUpdate === 0) {
      grid = nextGeneration(grid);
    }
  };
};
