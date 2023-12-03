import { Ant } from "./ant";
import { distanceSqr } from "./util";

export class Grid {
  cellSize: number;
  gridWidth: number;
  gridHeight: number;
  grid: Array<Array<Array<Ant>>>; // Assuming 'Ant' is the type for your ants

  constructor(worldWidth: number, worldHeight: number, cellSize: number) {
    this.cellSize = cellSize;
    this.gridWidth = Math.ceil(worldWidth / cellSize);
    this.gridHeight = Math.ceil(worldHeight / cellSize);
    this.grid = new Array(this.gridWidth);

    for (let x = 0; x < this.gridWidth; x++) {
      this.grid[x] = new Array(this.gridHeight);
      for (let y = 0; y < this.gridHeight; y++) {
        this.grid[x][y] = [];
      }
    }
  }

  clearGrid() {
    for (let x = 0; x < this.gridWidth; x++) {
      for (let y = 0; y < this.gridHeight; y++) {
        this.grid[x][y] = [];
      }
    }
  }

  addToGrid(ant: Ant) {
    const x = Math.floor(ant.state.posX / this.cellSize);
    const y = Math.floor(ant.state.posY / this.cellSize);

    if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
      this.grid[x][y].push(ant);
    }
  }

  getAntsInSameCell(ant: Ant): Ant[] {
    const x = Math.floor(ant.state.posX / this.cellSize);
    const y = Math.floor(ant.state.posY / this.cellSize);

    if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
      return this.grid[x][y];
    }

    return [];
  }

  getNearbyAnts(ant: Ant): Ant[] {
    const nearbyAnts: Ant[] = [];

    const x = Math.floor(ant.state.posX / this.cellSize);
    const y = Math.floor(ant.state.posY / this.cellSize);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const neighborX = x + dx;
        const neighborY = y + dy;

        if (
          neighborX >= 0 &&
          neighborX < this.gridWidth &&
          neighborY >= 0 &&
          neighborY < this.gridHeight
        ) {
          const others = this.grid[neighborX][neighborY];
          for(let i = 0; i < others.length; ++i)
          {
            const other = others[i]
            if (other.idx == ant.idx) continue;
            if (other.isDead) continue;

            const d = distanceSqr(ant.state.posX, ant.state.posY, other.state.posX, other.state.posY)
            const minD = 25
            if (d > minD * minD) continue;

            nearbyAnts.push(other);
          }
        }
      }
    }

    return nearbyAnts;
  }
}
