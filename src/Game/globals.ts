import { Grid } from './grid';

class globals {
  static sceneW: number = 1200;
  static sceneH: number = 900;
  static collW: number = 800;
  static collH: number = 600;
  static gameTimeMs: number = 0;
  static updateCounter: number = 0;
  static homeSize: number = 64;
  static homeRadius: number = this.homeSize * 0.5;
  static simStepMs: number = 30;
  static simFps: number = 1000 / this.simStepMs;
  static simStep: number = 1 / this.simFps;
  static turbo: boolean = false;
  static grid: Grid = new Grid(globals.sceneW, globals.sceneH, 40);
  static killerChance: number = 0.1;
  static killerStarveTime: number = 50;
  static antSpawnCounter: number = 30;
  static queenSpawnCounter: number = 200;
  static antDistTest: number = 10;
  static killerDistTest: number = 5;
  static killerCloneChance: number = 1.0;
}

export default globals;
