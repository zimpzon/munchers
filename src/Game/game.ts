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
}

class GameState implements IGameState {
  phaseIdx: number = 0;
  antStates: IAntState[] = [];
  money: number = 0;
  homeScentMax: number = globals.homeDecayTime;
  foodScentMax: number = globals.foodDecayTime;
  pickupFoodMs: number = 2000;
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

  private static saveKey: string = 'antsim-pwe-savegame-01';

  public static saveGame() {
    this.gameState.antStates = this.ants.map((a) => a.state);
    const json: string = JSON.stringify(this.gameState);
    localStorage.setItem(game.saveKey, json);
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
    };
  }

  public static expandMap() {}

  public static resetGame() {
    localStorage.removeItem(game.saveKey);
    window.location.href = window.location.href;
  }

  public static loadGame() {
    const firstAnt: IAntState = this.newAntState();
    this.gameState = new GameState();
    this.gameState.antStates.push(firstAnt);

    for (const antState of this.gameState.antStates) {
      const ant = new Ant(antState);
      this.ants.push(ant);
    }
  }

  static run(tick: () => void) {
    console.log('Starting game...');

    this.moneyLabel = document.getElementById('moneyLabel') as HTMLLabelElement;

    const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!gameCanvas) throw new Error('gameCanvas not found');

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2;

    this.app = new PIXI.Application({
      backgroundColor: 0x606060,
      width: globals.sceneW,
      height: globals.sceneH,
    });
    gameCanvas.appendChild(this.app.view);

    this.level = new level();
    this.level.loadLevel();

    this.loadGame();
    this.addMoney(3);

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
