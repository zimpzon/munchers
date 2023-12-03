import * as PIXI from 'pixi.js';
import { Vector } from 'vector2d';
import collision from './collision';
import game from './game';
import globals from './globals';
import level from './level';
import sprites from './sprites';

export enum MotivationState {
  Wander,
  KillOther,
  GiveUp,
}

export interface IAntState {
  motivationState: MotivationState;
  posX: number;
  posY: number;
  dirX: number;
  dirY: number;
  killOtherStartMs: number;
}

export class Ant {
  public static counter: number = 0;
  id: number = Ant.counter++;
  idx: number = -1;
  splitCounter: number = 0;
  splitCounterMax: number = 0;

  container: PIXI.Container; // A sprite is actually also a container, so no need for this parent container.
  pointFwd: PIXI.Point = new PIXI.Point();
  prefLeft: number = 0.2;
  prefRight: number = 0.2;
  turnAngle: number = 0;
  individualSpeed: number = 120;
  skip: number = 0;
  state: IAntState;
  sugarSize: number = 2;
  prevIdxHomeSet: number = -1;
  prevIdxFoodSet: number = -1;
  autonomousEnd: number = -1;
  public isDead: boolean = false;
  public isQueen: boolean = false;
  public isKiller: boolean = false;
  starveCounter: number = 0;

  mySprite: PIXI.Sprite;

  constructor(state: IAntState, isQueen: boolean = false) {
    this.isQueen = isQueen;
    this.state = state;
    this.container = new PIXI.Container();
    this.container.x = state.posX;
    this.container.y = state.posY;

    this.splitCounterMax = isQueen ? globals.queenSpawnCounter : globals.antSpawnCounter;

    const ant = new PIXI.Sprite(sprites.antDefault.texture);
    this.mySprite = ant;
    ant.tint = this.isQueen ? 0x1010ff : 0x000000;
    ant.width = this.isQueen ? 15 : 10;
    ant.height = this.isQueen ? 15 : 10;
    ant.anchor.set(0.5, 0.5);
    this.container.addChild(ant);
    this.pointFwd.x = ant.width * 0.6;

    this.container.pivot.x = 0;
    this.container.pivot.y = 0;

    game.app.stage.addChild(this.container);
  }

  public setKiller() {
    this.isKiller = true;
    this.mySprite.tint = 0xff0000;
  }

  public setAlone(isAlone: boolean) {
    if (this.isQueen) return;
    if (this.isKiller) return;

    // if (isAlone) {
    //   this.mySprite.tint = 0x00ff00;
    // } else {
    //   this.mySprite.tint = 0xff00ff;
    // }
  }

  public Kill() {
    this.isDead = true;
    game.app.stage.removeChild(this.container);
  }

  private getDirVec(): Vector {
    return new Vector(this.state.dirX, this.state.dirY);
  }

  private SetDir(vec: Vector) {
    this.state.dirX = vec.x;
    this.state.dirY = vec.y;
  }

  private killingOther() {
    if (globals.gameTimeMs > this.state.killOtherStartMs + 500) {
      this.state.motivationState = MotivationState.Wander;
    }
  }

  private wander() {
    this.explore(1);
  }

  private explore(modulus: number) {
    if (Math.abs(this.turnAngle) > 0) {
      this.turnAngle *= 0.99;
    }

    const rndSwitch = Math.random() / modulus < 0.1;
    if (rndSwitch) {
      const turn = Math.random() * 4 + 1;
      const rnd = Math.random();
      if (rnd < this.prefLeft) this.turnAngle = turn;
      else if (rnd > 1 - this.prefRight) this.turnAngle = -turn;
      else this.turnAngle = 0;
    }
  }

  public gotKill(other: Ant) {
    this.starveCounter = 0;
    if (Math.random() < globals.killerCloneChance) other.setKiller();
    else game.killAnt(other);
  }

  private common() {
    const vec = this.getDirVec();
    vec.rotate(PIXI.DEG_TO_RAD * this.turnAngle * globals.simStep * this.individualSpeed);
    this.SetDir(vec);
    this.container.rotation = Math.atan2(this.state.dirY, this.state.dirX);

    const fwd = this.container.toGlobal(this.pointFwd);

    const newPos = new PIXI.Point(
      this.container.position.x + this.state.dirX * globals.simStep * this.individualSpeed,
      this.container.position.y + this.state.dirY * globals.simStep * this.individualSpeed
    );

    this.state.posX = fwd.x;
    this.state.posY = fwd.y;

    const s = collision.sample(fwd.x, fwd.y);
    if (s === 255) {
      const vec = new Vector(
        (this.state.dirX *= Math.random() * 0.8 - 1),
        (this.state.dirY *= Math.random() * 0.8 - 1)
      );
      vec.normalise();
      this.SetDir(vec);
      return;
    }

    this.container.position = newPos;
  }

  public update() {
    this.wander();
    this.common();
    if (this.isKiller && this.starveCounter++ > globals.killerStarveTime) {
      game.killAnt(this);
    }
  }
}
