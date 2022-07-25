import * as PIXI from 'pixi.js'
import game from './game'
import globals from './globals'
import sprites from './sprites'

export class level {
    public homeMarkers: number[] = new Array(globals.markersW * globals.markersH)
    public foodMarkers: number[] = new Array(globals.markersW * globals.markersH)
    static homeX: number = 0
    static homeY: number = 0
    static markerScaleX: number
    static markerScaleY: number
    static markerMax: number = 1000
    static markerDecayTime: number = 10000

    backgroundSprite: PIXI.Sprite | undefined

    public loadLevel() {
        var levelDef = Level1
        this.backgroundSprite = sprites.level1Background
        this.backgroundSprite.width = globals.sceneW
        this.backgroundSprite.height = globals.sceneH

        level.markerScaleX = globals.markersW / globals.sceneW
        level.markerScaleY = globals.markersH / globals.sceneH
        
        level.homeX = levelDef.homeX
        level.homeY = levelDef.homeY

        game.app.stage.addChild(this.backgroundSprite);
    }

    private static calcIdx(x: number, y: number): number {
        const x2 = Math.round(x * this.markerScaleX)
        const y2 = Math.round(y * this.markerScaleY)
        return y2 * globals.collW + x2
    }

    static sample(arr: number[], x: number, y: number): number {
        const idx = this.calcIdx(x, y)
        const val = arr[idx]
        return Math.max(0, (this.markerMax - (Date.now() - val)) * (this.markerMax / this.markerDecayTime))
    }

    static set(arr: number[], x: number, y: number) {
        const idx = this.calcIdx(x, y)
        arr[idx] = 255 // for debugging
        // arr[idx] = Date.now()
    }
}

class LevelDef {
    public path: string = ''
    public homeX: number = 0
    public homeY: number = 0
}

const Level1: LevelDef = {
    path: '/gfx/level1.png',
    homeX: 60,
    homeY: 80,
}

export default level