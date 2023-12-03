import * as PIXI from 'pixi.js';
import { Ant, IAntState, MotivationState } from './ant';
import globals from './globals';
import { level } from './level';
import { RandomUnitVector } from './math';
import { Vector } from 'vector2d';

interface IGameState {
  phaseIdx: number;
  antStates: IAntState[];
  money: number;
}

type NUllableAnt = Ant | undefined;

class game {
  public static app: PIXI.Application;
  static gameState: IGameState;
  static level: level;
  static moneyLabel: HTMLLabelElement;
  static money: number = 0;
  static ants: Array<NUllableAnt> = new Array(50000);

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
  }

  private static newAntState(startPos: Vector): IAntState {
    const dir = RandomUnitVector();
    const pos = startPos;
    return {
      dirX: dir.x,
      dirY: dir.y,
      motivationState: MotivationState.Wander,
      posX: pos.x,
      posY: pos.y,
      killOtherStartMs: 0,
    };
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

    this.addAnt(level.getAntDefaultPos(), true);
    this.addMoney(0);

    this.app.ticker.add(tick);
  }

  static tickGame() {
    globals.grid.clearGrid();

    for (let ant of this.ants) {
      if (!ant) continue;

      globals.grid.addToGrid(ant);
    }

    for (let ant of this.ants) {
      if (!ant) continue;

      let near = globals.grid.getNearbyAnts(
        ant,
        ant.isKiller ? globals.killerDistTest : globals.antDistTest
      );
      const alone: boolean = near.length === 0;
      ant.setAlone(alone);
      if (alone) {
        ant.splitCounter++;
        if (!ant.isKiller && ant.splitCounter > ant.splitCounterMax) {
          // SPAWN NEW ANT
          ant.splitCounter = 0;
          const newAnt = this.addAnt(
            new Vector(ant.container.position.x, ant.container.position.y)
          );

          if (ant.isQueen && Math.random() < globals.killerChance) {
            console.log('New killer ant!');

            newAnt?.setKiller();
          }
        }
      } else if (!ant.isQueen) ant.splitCounter = 0;

      if (ant.isKiller && near.length > 0 && !near[0]!.isKiller) ant.gotKill(near[0]!);

      ant.update();
    }
  }

  static antCount: number = 0;

  static updateText() {
    const txt: string = this.ants.length === 1 ? 'ant' : 'ants';
    this.moneyLabel.textContent = `You have ${this.antCount} ${txt}`;
  }

  static killAnt(ant: Ant) {
    if (ant.isQueen) return;

    let lastAnt = this.ants[this.antCount - 1]!;
    this.ants[ant.idx] = lastAnt;
    this.ants[lastAnt.idx] = undefined;
    lastAnt.idx = ant.idx;
    ant.Kill();
    this.antCount--;
    this.updateText();
  }

  static addAnt(pos: Vector, isQueen: boolean = false): Ant | undefined {
    if (this.antCount >= this.ants.length) return undefined;

    const antState: IAntState = this.newAntState(pos);
    const ant = new Ant(antState, isQueen);
    ant.idx = this.antCount;
    this.ants[ant.idx] = ant;
    this.antCount++;
    this.updateText();
    return ant;
  }
}

export default game;
