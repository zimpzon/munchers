import * as PIXI from 'pixi.js';
import { Vector } from 'vector2d';
import collision from './collision';
import game from './game';
import globals from './globals';
import level from './level';
import { distanceSqr } from './util';
import markers, { sampleResult } from './markers';
import sprites from './sprites';

export enum MotivationState {
  lookForFood,
  pickingUpFood,
  deliverFood,
  droppingFood,
}

export interface IAntState {
  motivationState: MotivationState;
  posX: number;
  posY: number;
  dirX: number;
  dirY: number;
  homeScent: number;
  foodScent: number;
  pickUpFoodStartMs: number;
  dropFoodStartMs: number;
}

export class Ant {
  public static counter: number = 0;
  id: number = Ant.counter++;

  container: PIXI.Container; // A sprite is actually also a container, so no need for this parent container.
  scanFwd: PIXI.Sprite;
  pointFwd: PIXI.Point = new PIXI.Point();
  prefLeft: number = 0.2;
  prefRight: number = 0.2;
  turnAngle: number = 0;
  individualSpeed: number = 120;
  skip: number = 0;
  state: IAntState;
  sugarSize: number = 2;
  foodScanId: number;
  homeScanId: number;
  prevIdxHomeSet: number = -1;
  prevIdxFoodSet: number = -1;
  public autonomousEnd: number = -1;
  latestMarkersSample: sampleResult = new sampleResult();
  nextStuckCheckMs: number = 0;
  stuckCheckX: number = -9999;
  stuckCheckY: number = -9999;

  // Globals initialized in top of update()
  isOnHome: boolean = false;

  constructor(state: IAntState) {
    this.state = state;
    this.container = new PIXI.Container();
    this.container.x = state.posX;
    this.container.y = state.posY;

    const ant = new PIXI.Sprite(sprites.antDefault.texture);
    ant.tint = 0xffffff;
    ant.width = 10;
    ant.height = 10;
    ant.anchor.set(0.5, 0.5);
    this.container.addChild(ant);

    this.pointFwd.x = ant.width * 0.6;

    const dotFwd = new PIXI.Sprite(sprites.white_2x2.texture);
    dotFwd.width = state.motivationState === MotivationState.deliverFood ? this.sugarSize : 0;
    dotFwd.height = state.motivationState === MotivationState.deliverFood ? this.sugarSize : 0;
    dotFwd.position = this.pointFwd;
    dotFwd.anchor.set(0.5, 0.5);
    dotFwd.tint = 0x10edef;
    this.scanFwd = dotFwd;
    this.container.addChild(this.scanFwd);

    this.container.pivot.x = 0;
    this.container.pivot.y = 0;

    this.foodScanId = this.id % globals.foodScanModulus;
    this.homeScanId = this.id % globals.homeScanModulus;

    game.app.stage.addChild(this.container);
  }

  private getDirVec(): Vector {
    return new Vector(this.state.dirX, this.state.dirY);
  }

  public SetDir(vec: Vector) {
    this.state.dirX = vec.x;
    this.state.dirY = vec.y;
  }

  private lookForFood() {
    if (globals.updateCounter % globals.homeMarkerModulus === 0)
      this.prevIdxHomeSet = collision.homeMarkers.set(
        this.state.posX,
        this.state.posY,
        this.state.homeScent,
        this.prevIdxHomeSet
      );

    this.sample(collision.foodMarkers);
    this.explore(1);

    if (globals.updateCounter % globals.foodScanModulus !== this.foodScanId) return;

    const food = level.isOnFood(this, this.state.posX, this.state.posY);
    if (food !== null) {
      this.state.foodScent = game.gameState.foodScentMax;
      this.state.motivationState = MotivationState.pickingUpFood;
      this.state.pickUpFoodStartMs = globals.gameTimeMs - Math.random() * 500.0;
      food.claim();
      const vec = new Vector(
        (this.state.dirX *= Math.random() * 0.8 - 1),
        (this.state.dirY *= Math.random() * 0.8 - 1)
      );
      vec.normalise();
      this.SetDir(vec);

      this.prevIdxFoodSet = collision.foodMarkers.set(
        this.state.posX,
        this.state.posY,
        this.state.foodScent,
        this.prevIdxFoodSet
      );

      return;
    }
  }

  private pickingUpFood() {
    if (globals.gameTimeMs > this.state.pickUpFoodStartMs + game.gameState.pickupFoodMs) {
      this.state.motivationState = MotivationState.deliverFood;
      this.scanFwd.width = this.sugarSize;
      this.scanFwd.height = this.sugarSize;
      this.stuckCheckX = -9999;
      this.stuckCheckY = -9999;
    }
  }

  private droppingFood() {
    if (globals.gameTimeMs > this.state.dropFoodStartMs + game.gameState.dropFoodMs) {
      this.state.motivationState = MotivationState.lookForFood;
      this.scanFwd.width = 0;
      this.scanFwd.height = 0;
      this.stuckCheckX = -9999;
      this.stuckCheckY = -9999;
    }
  }

  private deliverFood() {
    if (globals.updateCounter % globals.foodMarkerModulus === 0) {
      this.prevIdxFoodSet = collision.foodMarkers.set(
        this.state.posX,
        this.state.posY,
        this.state.foodScent,
        this.prevIdxFoodSet
      );
    }

    if (this.isOnHome) {
      this.state.motivationState = MotivationState.droppingFood;
      this.state.dropFoodStartMs = globals.gameTimeMs - Math.random() * 500.0;
      const vec = new Vector(-1, -1);
      vec.normalise();
      this.SetDir(vec);
      game.addMoney(globals.foodValue);

      return;
    }

    this.sample(collision.homeMarkers);

    this.explore(1);
  }

  private sample(markers: markers) {
    if (globals.gameTimeMs < this.autonomousEnd) return;

    const fwd = this.container.toGlobal(this.scanFwd);
    markers.sample(fwd.x, fwd.y, this.latestMarkersSample);
    if (this.latestMarkersSample.success === true) {
      const coll = collision.sample(
        this.latestMarkersSample.targetX,
        this.latestMarkersSample.targetY
      );
      if (coll === 255) return;

      const dir = new Vector(
        this.latestMarkersSample.targetX - this.state.posX,
        this.latestMarkersSample.targetY - this.state.posY
      );
      dir.normalise();
      this.SetDir(dir);
      this.latestMarkersSample.success = false;
    }
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

  private common() {
    if (
      this.state.motivationState === MotivationState.deliverFood ||
      this.state.motivationState === MotivationState.lookForFood
    ) {
      if (globals.gameTimeMs > this.nextStuckCheckMs) {
        this.nextStuckCheckMs = globals.gameTimeMs + 500 + Math.random() * 250.0;
        const dist = distanceSqr(
          this.state.posX,
          this.state.posY,
          this.stuckCheckX,
          this.stuckCheckY
        );
        if (dist < 20 * 20) {
          this.autonomousEnd = globals.gameTimeMs + 100;
        }
        this.stuckCheckX = this.state.posX;
        this.stuckCheckY = this.state.posY;
      }
    }

    const vec = this.getDirVec();
    vec.rotate(PIXI.DEG_TO_RAD * this.turnAngle * globals.simStep * this.individualSpeed);
    this.SetDir(vec);
    this.container.rotation = Math.atan2(this.state.dirY, this.state.dirX);

    this.state.homeScent = Math.max(0, this.state.homeScent - globals.simStepMs);
    this.state.foodScent = Math.max(0, this.state.foodScent - globals.simStepMs);

    const fwd = this.container.toGlobal(this.pointFwd);

    const newPos = new PIXI.Point(
      this.container.position.x + this.state.dirX * globals.simStep * this.individualSpeed,
      this.container.position.y + this.state.dirY * globals.simStep * this.individualSpeed
    );

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

    if (this.isOnHome) {
      this.state.homeScent = game.gameState.homeScentMax;
    }
  }

  public update() {
    this.state.posX = this.container.position.x;
    this.state.posY = this.container.position.y;
    this.isOnHome = level.isOnHome(this.state.posX, this.state.posY);

    if (this.state.motivationState === MotivationState.lookForFood) {
      this.lookForFood();
    } else if (this.state.motivationState === MotivationState.pickingUpFood) {
      this.pickingUpFood();
    } else if (this.state.motivationState === MotivationState.droppingFood) {
      this.droppingFood();
    } else if (this.state.motivationState === MotivationState.deliverFood) {
      this.deliverFood();
      const dx = this.state.posX - level.home1.x;
      const dy = this.state.posY - level.home1.y;
      const signX = Math.sign(dx);
      const signY = Math.sign(dy);
      if (dx * dx + dy * dy < globals.homeRadius * globals.homeRadius * 2.0) {
        this.SetDir(new Vector(-signX, -signY).normalize());
      }
    }

    if (
      this.state.motivationState !== MotivationState.pickingUpFood &&
      this.state.motivationState !== MotivationState.droppingFood
    )
      this.common();
  }
}
