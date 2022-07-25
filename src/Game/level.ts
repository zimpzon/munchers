import * as PIXI from 'pixi.js'
import game from './game'
import globals from './globals'
import sprites from './sprites'

export class level {
    homeMarkers: number[] = []
    foodMarkers: number[] = []
    collMap: Uint8Array = new Uint8Array()
    static homeX: number = 0
    static homeY: number = 0
    static worldToCollScale: number

    backgroundSprite: PIXI.Sprite | undefined

    public loadLevel() {
        var levelDef = Level1
        this.backgroundSprite = sprites.level1Background
        this.backgroundSprite.width = globals.sceneW
        this.backgroundSprite.height = globals.sceneH

        level.homeX = levelDef.homeX
        level.homeY = levelDef.homeY

        game.app.stage.addChild(this.backgroundSprite);
    }
}

class LevelDef {
    public path: string = ''
    public homeX: number = 0
    public homeY: number = 0
}

const Level1: LevelDef = {
    path: '/gfx/map-test-2.png',
    homeX: 150,
    homeY: 250,
}

export default level