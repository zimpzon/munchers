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

    backgroundSprite: PIXI.Sprite | undefined
    
    static homes: Home[] = []

    public static getAntDefaultPos() {
        return new Vector(this.home1.x, this.home1.y)
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

    public loadLevel() {
        level.phase = phase1
        collision.level = collision.level_phase1
        this.backgroundSprite = sprites.level1Background
        this.backgroundSprite.width = globals.sceneW
        this.backgroundSprite.height = globals.sceneH
        game.app.stage.addChild(this.backgroundSprite);

        level.home1 = createHome(580, 210, 30)
        level.homes = [level.home1]
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

interface Home {
    x: number
    y: number
    radius: number
    sprite: PIXI.Sprite
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