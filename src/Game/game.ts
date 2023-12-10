import * as PIXI from 'pixi.js';
import { Ant, IAntState, MotivationState } from './ant';
import globals from './globals';
import { level } from './level';
import { RandomUnitVector } from './math';

interface IGameState {
  phaseIdx: number;
  antStates: IAntState[];
  money: number;
  homeScentMax: number;
  foodScentMax: number;
  pickupFoodMs: number;
  dropFoodMs: number;
}

class GameState implements IGameState {
  phaseIdx: number = 0;
  antStates: IAntState[] = [];
  money: number = 0;
  homeScentMax: number = globals.homeDecayTime;
  foodScentMax: number = globals.foodDecayTime;
  pickupFoodMs: number = 2000;
  dropFoodMs: number = 1800;
}

class game {
  static app: PIXI.Application;
  static gameState: IGameState;
  static level: level;
  static moneyLabel: HTMLLabelElement;
  static money: number = 0;
  static ants: Ant[] = [];

  static antBuyPrice(count: number): number {
    return count;
  }

  static stop() {
    console.log('Stopping game...');
    const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    gameCanvas.removeChild(this.app.view);
    this.app.destroy();
  }

  static addMoney(amount: number) {
    this.money += amount;
    const txt: string = this.ants.length === 1 ? 'ant' : 'ants';
    this.moneyLabel.textContent = `You have $${(Math.round(this.money * 100) / 100).toFixed(
      2
    )} and ${this.ants.length} ${txt}`;
  }

  private static newAntState(): IAntState {
    const dir = RandomUnitVector();
    const pos = level.getAntDefaultPos();
    return {
      dirX: dir.x,
      dirY: dir.y,
      foodScent: 0,
      homeScent: 0,
      motivationState: MotivationState.lookForFood,
      posX: pos.x,
      posY: pos.y,
      pickUpFoodStartMs: 0,
      dropFoodStartMs: 0,
    };
  }

  public static expandMap() {}

  public static resetGame() {
    window.location.href = window.location.href;
  }

  public static loadGame() {
    this.gameState = new GameState();
    this.addAnt();
    this.addAnt();
    this.addMoney(0);
  }

  static run(tick: () => void) {
    console.log('Starting game...');

    this.moneyLabel = document.getElementById('moneyLabel') as HTMLLabelElement;

    const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!gameCanvas) throw new Error('gameCanvas not found');

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
    PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2;

    this.app = new PIXI.Application({
      backgroundColor: 0xc0a0a0,
      width: globals.sceneW,
      height: globals.sceneH,
    });
    gameCanvas.appendChild(this.app.view);

    this.level = new level();
    this.level.loadLevel();

    this.loadGame();

    this.app.ticker.add(tick);
  }

  static tickGame() {
    for (let ant of this.ants) {
      ant.update();
    }
  }

  static addAnt() {
    const antState: IAntState = this.newAntState();
    const ant = new Ant(antState);
    this.ants.push(ant);
  }
}

export default game;
