import * as PIXI from 'pixi.js';
import { Vector } from 'vector2d';
import collision from './collision';
import game from './game';
import globals from './globals';
import sprites from './sprites';
import { distanceSqr } from './util';
import { Ant } from './ant';

export class level {
  static phase: Phase;
  static home1: Home;

  backgroundSprite: PIXI.Sprite | undefined;
  foodLayerSprite: PIXI.Sprite | undefined;
  foodCircleSprite: PIXI.Sprite | undefined;

  static hohoText: PIXI.Text;

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

    level.home1 = createHome(100, 200, 30);
    level.homes = [level.home1];

    level.foods = [];
    // startup
    level.foods.push(createFood(545, 195, 20, 10));
    level.foods.push(createFood(120, 350, 20, 10));
    level.foods.push(createFood(260, 185, 20, 10));
    level.foods.push(createFood(480, 360, 20, 10));
    level.foods.push(createFood(120, 530, 20, 10));
    level.foods.push(createFood(300, 550, 20, 10));
    level.foods.push(createFood(1040, 170, 20, 10));
    level.foods.push(createFood(1000, 470, 20, 10));
    level.foods.push(createFood(700, 460, 20, 10));
    level.foods.push(createFood(840, 750, 20, 10));
    level.foods.push(createFood(90, 730, 20, 10));
    level.foods.push(createFood(470, 780, 20, 10));
    level.foods.push(createFood(1150, 850, 20, 10));
  }
}

function createHome(xPos: number, yPos: number, radius: number): Home {
  const home: Home = {
    x: xPos,
    y: yPos,
    radius: radius,
    sprite: new PIXI.Sprite(sprites.whiteCircle.texture),
  };

  home.sprite.anchor.set(0.0, 0.0);
  home.sprite.width = radius * 2;
  home.sprite.height = radius * 2;
  home.sprite.anchor.set(0.5, 0.5);
  home.sprite.x = xPos;
  home.sprite.y = yPos;
  home.sprite.tint = 0xaaaaaa;
  const icon = new PIXI.Sprite(sprites.homeIcon.texture);
  icon.width = 36;
  icon.height = 36;
  icon.anchor.set(0.5, 0.5);
  home.sprite.addChild(icon);
  game.app.stage.addChild(home.sprite);
  return home;
}

function createFood(xPos: number, yPos: number, radius: number, amount: number): Food {
  const food: Food = {
    x: xPos,
    y: yPos,
    maxRadius: radius,
    radius: radius,
    originalRadius: radius,
    maxAmount: amount,
    amount: amount,
    sprite: new PIXI.Sprite(sprites.whiteCircle.texture),
    text: new PIXI.Text(0, {
      fontFamily: 'Verdana',
      fontSize: 16,
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
  food.sprite.width = radius * 2;
  food.sprite.height = radius * 2;
  food.sprite.x = xPos;
  food.sprite.y = yPos;
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
