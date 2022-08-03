import * as PIXI from 'pixi.js'
import { Vector } from 'vector2d'
import collision from './collision'
import game from './game'
import globals from './globals'
import sprites from './sprites'
import { distanceSqr } from './util'

export class level {
    static phase: Phase
    static home1: Home
    static food1: Food
    static food2: Food

    backgroundSprite: PIXI.Sprite | undefined
    foodCircleSprite: PIXI.Sprite | undefined

    static homes: Home[] = []
    static foods: Food[] = []

    public static getAntDefaultPos() {
        return new Vector(580, 120)
    }

    public static loadCollisionMap(levelData: { pixels: Uint8Array; w: number; h: number }) {
      const total = levelData.w * levelData.h;
  
      const map = new Uint8Array(total)
      for (let idx = 0; idx < total * 4; idx += 4) {
        let g = levelData.pixels[idx + 1]
        let b = levelData.pixels[idx + 2]
        let a = levelData.pixels[idx + 3]
        if (g === 255) {
          a = 0
        } else if (b === 255) {
          a = 0
        }
        map[idx / 4] = a
      }
      return map
    }
    
    public static isOnHome(x: number, y: number): boolean {
      for (let i = 0; i < level.homes.length; ++i) {
        const home = level.homes[i]
        if (x < home.x - home.radius ||
          x > home.x + home.radius ||
          y < home.y - home.radius ||
          y > home.y + home.radius)
            continue

          return distanceSqr(x, y, home.x, home.y) < home.radius * home.radius
      }
      return false
    }

    public static isOnFood(x: number, y: number): Food | null {
      for (let i = 0; i < level.foods.length; ++i) {
        const food = level.foods[i]
        if (x < food.x - food.radius ||
          x > food.x + food.radius ||
          y < food.y - food.radius ||
          y > food.y + food.radius ||
          food.amount <= 0)
            continue

          return distanceSqr(x, y, food.x, food.y) < food.radius * food.radius ? food : null
      }
      return null
    }

    public loadLevel() {
        level.phase = phase1
        collision.level = collision.level_phase1
        this.backgroundSprite = sprites.level1Background
        this.backgroundSprite.width = globals.sceneW
        this.backgroundSprite.height = globals.sceneH
        game.app.stage.addChild(this.backgroundSprite);
        game.app.stage.addChild(collision.foodMarkers.sprite);
        game.app.stage.addChild(collision.homeMarkers.sprite);

        level.home1 = createHome(580, 120, 30)
        level.food1 = createFood(670, 740, 30, 1000)
        level.food2 = createFood(380, 400, 30, 1000)
        level.homes = [level.home1]
        level.foods = [level.food1, level.food2]
    }
}

function createHome(xPos: number, yPos: number, radius: number): Home {
  const home: Home = {
    x: xPos,
    y: yPos,
    radius: radius,
    sprite: new PIXI.Sprite(sprites.whiteCircle.texture),
  }

  home.sprite.anchor.set(0.0, 0.0)
  home.sprite.width = radius * 2
  home.sprite.height = radius * 2
  home.sprite.anchor.set(0.5, 0.5)
  home.sprite.x = xPos
  home.sprite.y = yPos
  home.sprite.tint = 0xa0c0a0
  const icon = new PIXI.Sprite(sprites.homeIcon.texture)
  icon.width = 28
  icon.height = 28
  icon.anchor.set(0.5, 0.5)
  icon.tint = 0xa0e0a0
  home.sprite.addChild(icon)
  game.app.stage.addChild(home.sprite)
  return home
}

function createFood(xPos: number, yPos: number, radius: number, amount: number): Food {
  const food: Food = {
    x: xPos,
    y: yPos,
    maxRadius: radius,
    radius: radius,
    maxAmount: amount,
    amount: amount,
    sprite: new PIXI.Sprite(sprites.whiteCircle.texture),
    text: new PIXI.Text(0, { fontFamily : 'Verdana', fontSize: 16, fill : 0x101010, align : 'center' }),
    claim: () => {
      food.amount--
      if (food.amount <= 0) {
        food.sprite.visible = false
        return
      }

      food.text.text = food.amount
      const scale = (1 - ((food.maxAmount - food.amount) / food.maxAmount)) * 0.7 + 0.3
      food.radius = food.maxRadius * scale
      food.sprite.width = food.radius * 2 * scale
      food.sprite.height = food.radius * 2 * scale
    }
  }

  food.sprite.anchor.set(0.5, 0.5)
  food.sprite.width = radius * 2
  food.sprite.height = radius * 2
  food.sprite.x = xPos
  food.sprite.y = yPos
  food.sprite.tint = 0xa0a0c0
  food.text.anchor.set(0.5, 0.5)
  food.sprite.addChild(food.text)
  food.text.text = food.amount
  game.app.stage.addChild(food.sprite)
  return food
}

interface Home {
    x: number
    y: number
    radius: number
    sprite: PIXI.Sprite
}

interface Food {
  x: number
  y: number
  maxRadius: number
  radius: number
  maxAmount: number
  amount: number
  sprite: PIXI.Sprite
  text: PIXI.Text
  claim: () => void
}

interface Phase {
    imageName: string
    unlockNextPhasePrice: number
    btnShowBuy10: boolean
    btnShowBuy100: boolean
    homes: Home[]
}

const phase1: Phase = {
    imageName: 'gfx/level_phase1.png',
    unlockNextPhasePrice: 50,
    btnShowBuy10: true,
    btnShowBuy100: true,
    homes: level.homes,
}

export default level