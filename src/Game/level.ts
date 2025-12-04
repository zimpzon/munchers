import * as PIXI from 'pixi.js';
import { Vector } from 'vector2d';
import collision from './collision';
import game from './game';
import globals from './globals';
import sprites from './sprites';
import { distanceSqr } from './util';
import { Ant } from './ant';

// Base reference dimensions (800x600)
const BASE_WIDTH = 800;
const BASE_HEIGHT = 600;

// Helper functions to scale coordinates relative to base size
function scaleX(baseX: number): number {
  return (baseX * globals.sceneW) / BASE_WIDTH;
}

function scaleY(baseY: number): number {
  return (baseY * globals.sceneH) / BASE_HEIGHT;
}

function scaleRadius(baseRadius: number): number {
  return baseRadius;
  // Use the average of width and height scaling to maintain proportions
  const scaleFactorX = globals.sceneW / BASE_WIDTH;
  const scaleFactorY = globals.sceneH / BASE_HEIGHT;
  return baseRadius * ((scaleFactorX + scaleFactorY) / 2);
}

export class level {
  static phase: Phase;
  static home1: Home;

  backgroundSprite: PIXI.Sprite | undefined;
  foodLayerSprite: PIXI.Sprite | undefined;
  foodCircleSprite: PIXI.Sprite | undefined;

  static homes: Home[] = [];
  static foods: Food[] = [];

  public static getAntDefaultPos() {
    return new Vector(this.home1.x, this.home1.y);
  }

  public static loadCollisionMap(levelData: { pixels: Uint8Array; w: number; h: number }) {
    const total = levelData.w * levelData.h;
    let min: number = 9999;
    let max: number = -9999;
    let sum = 0;
    console.log('w: ' + levelData.w);
    console.log('h: ' + levelData.h);

    const map = new Uint8Array(total);
    for (let idx = 0; idx < total * 4; idx += 4) {
      let r = levelData.pixels[idx + 0];
      let g = levelData.pixels[idx + 1];
      let b = levelData.pixels[idx + 2];
      let a = levelData.pixels[idx + 3];
      if (g < min) min = g;
      if (g > max) max = g;
      map[idx / 4] = a > 32 ? 255 : 0;
    }
    return map;
  }

  public static isOnHome(x: number, y: number): boolean {
    for (const element of level.homes) {
      const home = element;
      if (
        x < home.x - home.radius ||
        x > home.x + home.radius ||
        y < home.y - home.radius ||
        y > home.y + home.radius
      )
        continue;

      return distanceSqr(x, y, home.x, home.y) < home.radius * home.radius;
    }
    return false;
  }

  public static isOnFood(ant: Ant, x: number, y: number): Food | null {
    for (const element of level.foods) {
      const food = element;
      if (
        x < food.x - food.radius ||
        x > food.x + food.radius ||
        y < food.y - food.radius ||
        y > food.y + food.radius ||
        food.amount <= 0
      ) {
        continue;
      }

      const dx = x - food.x;
      const dy = y - food.y;
      const signX = Math.sign(dx);
      const signY = Math.sign(dy);

      const isAtFood = dx * dx + dy * dy <= food.radius * food.radius;
      if (isAtFood) {
        return food;
      }

      const isCloseToFood = dx * dx + dy * dy < food.originalRadius * food.originalRadius * 1.5;

      if (isCloseToFood) {
        ant.SetDir(new Vector(-signX, -signY).normalize());
        return null;
      }
    }

    return null;
  }

  public loadLevel() {
    level.phase = phase1;
    collision.level = collision.level_phase1;
    this.backgroundSprite = sprites.level1Background;
    this.backgroundSprite.width = globals.sceneW;
    this.backgroundSprite.height = globals.sceneH;

    // this.foodLayerSprite = sprites.foodLayer;
    // this.foodLayerSprite.width = globals.sceneW;
    // this.foodLayerSprite.height = globals.sceneH;

    game.app.stage.addChild(this.backgroundSprite);
    // game.app.stage.addChild(this.foodLayerSprite);
    game.app.stage.addChild(collision.foodMarkers.sprite);
    game.app.stage.addChild(collision.homeMarkers.sprite);

    level.home1 = createHome(67, 133, 30);
    level.homes = [level.home1];

    level.foods = [];
    // startup
    level.foods.push(createFood(363, 130, 20, 10));
    level.foods.push(createFood(80, 233, 20, 10));
    level.foods.push(createFood(173, 123, 20, 10));
    level.foods.push(createFood(320, 240, 20, 15));
    level.foods.push(createFood(80, 353, 20, 15));
    level.foods.push(createFood(200, 367, 20, 15));
    level.foods.push(createFood(693, 113, 20, 15));
    level.foods.push(createFood(667, 313, 20, 15));
    level.foods.push(createFood(467, 307, 20, 25));
    level.foods.push(createFood(560, 500, 20, 25));
    level.foods.push(createFood(60, 487, 20, 25));
    level.foods.push(createFood(313, 520, 20, 25));
    level.foods.push(createFood(767, 567, 20, 50));
  }
}

function createHome(baseX: number, baseY: number, baseRadius: number): Home {
  const scaledX = scaleX(baseX);
  const scaledY = scaleY(baseY);
  const scaledRadius = scaleRadius(baseRadius);

  const home: Home = {
    x: scaledX,
    y: scaledY,
    radius: scaledRadius,
    sprite: new PIXI.Sprite(sprites.whiteCircle.texture),
  };

  home.sprite.anchor.set(0.0, 0.0);
  home.sprite.width = scaledRadius * 2;
  home.sprite.height = scaledRadius * 2;
  home.sprite.anchor.set(0.5, 0.5);
  home.sprite.x = scaledX;
  home.sprite.y = scaledY;
  home.sprite.tint = 0xaaaaaa;
  const icon = new PIXI.Sprite(sprites.homeIcon.texture);
  const iconSize = scaleRadius(36);
  icon.width = iconSize;
  icon.height = iconSize;
  icon.anchor.set(0.5, 0.5);
  home.sprite.addChild(icon);
  game.app.stage.addChild(home.sprite);
  return home;
}

function createFood(baseX: number, baseY: number, baseRadius: number, amount: number): Food {
  const scaledX = scaleX(baseX);
  const scaledY = scaleY(baseY);
  const scaledRadius = scaleRadius(baseRadius);

  const food: Food = {
    x: scaledX,
    y: scaledY,
    maxRadius: scaledRadius,
    radius: scaledRadius,
    originalRadius: scaledRadius,
    maxAmount: amount,
    amount: amount,
    sprite: new PIXI.Sprite(sprites.whiteCircle.texture),
    text: new PIXI.Text(0, {
      fontFamily: 'Verdana',
      fontSize: scaleRadius(16),
      fill: 0xffffff,
      align: 'center',
    }),
    claim: () => {
      food.amount -= globals.foodValue;
      if (food.amount <= 0) {
        food.sprite.visible = false;
        return;
      }

      food.text.text = (Math.round(food.amount * 100) / 100).toFixed(1);
      const scale = (1 - (food.maxAmount - food.amount) / food.maxAmount) * 0.7 + 0.3;
      food.radius = food.maxRadius * scale;
      food.sprite.width = food.radius * 2 * scale;
      food.sprite.height = food.radius * 2 * scale;
    },
  };

  food.sprite.anchor.set(0.5, 0.5);
  food.sprite.width = scaledRadius * 2;
  food.sprite.height = scaledRadius * 2;
  food.sprite.x = scaledX;
  food.sprite.y = scaledY;
  food.sprite.tint = 0x9f1020;
  food.text.anchor.set(0.5, 0.5);
  food.sprite.addChild(food.text);
  food.text.text = (Math.round(food.amount * 100) / 100).toFixed(1);
  game.app.stage.addChild(food.sprite);
  return food;
}

interface Home {
  x: number;
  y: number;
  radius: number;
  sprite: PIXI.Sprite;
}

interface Food {
  x: number;
  y: number;
  maxRadius: number;
  originalRadius: number;
  radius: number;
  maxAmount: number;
  amount: number;
  sprite: PIXI.Sprite;
  text: PIXI.Text;
  claim: () => void;
}

interface Phase {
  imageName: string;
  unlockNextPhasePrice: number;
  btnShowBuy10: boolean;
  btnShowBuy100: boolean;
  homes: Home[];
}

const phase1: Phase = {
  imageName: 'gfx/level_phase1.png',
  unlockNextPhasePrice: 50,
  btnShowBuy10: true,
  btnShowBuy100: true,
  homes: level.homes,
};

export default level;
