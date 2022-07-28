import * as PIXI from 'pixi.js'
import collision from './collision'
import game from './game'
import globals from './globals'
import sprites from './sprites'

export class level {
    static homeX: number = 0
    static homeY: number = 0

    backgroundSprite: PIXI.Sprite | undefined
    homeDebugSprite: PIXI.Sprite | undefined
    homeCircleSprite: PIXI.Sprite | undefined

    public loadLevel() {
        var levelDef = Level1
        this.backgroundSprite = sprites.level1Background
        this.backgroundSprite.width = globals.sceneW
        this.backgroundSprite.height = globals.sceneH
      
        this.homeCircleSprite = new PIXI.Sprite(sprites.whiteCircle.texture)
        this.homeCircleSprite.anchor.set(0.5, 0.5)
        this.homeCircleSprite.x = levelDef.homeX
        this.homeCircleSprite.y = levelDef.homeY
        this.homeCircleSprite.width = globals.homeSize
        this.homeCircleSprite.height = globals.homeSize
        this.homeCircleSprite.tint = 0xa0c0a0

        level.homeX = levelDef.homeX
        level.homeY = levelDef.homeY

        game.app.stage.addChild(this.backgroundSprite);
        game.app.stage.addChild(this.homeCircleSprite);
        game.app.stage.addChild(collision.homeMarkers.debugSprite);
    }
}

class LevelDef {
    public path: string = ''
    public homeX: number = 0
    public homeY: number = 0
}

const Level1: LevelDef = {
    path: '/gfx/level1.png',
    homeX: 80,
    homeY: 110,
}

export default level