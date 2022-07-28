import * as PIXI from 'pixi.js'
import globals from "./globals"

class field {
    values: number[]
    debug: Uint8Array
    debugTex: PIXI.Texture
    debugSprite: PIXI.Sprite
    w: number
    h: number
    decayMs: number
    scaleWorldToX: number
    scaleWorldToY: number
    name: string

    constructor(w: number, h: number, decayMs: number, name: string) {
        this.values = new Array(w * h).fill(-10000000)
        this.w = w
        this.h = h
        this.decayMs = decayMs
        this.scaleWorldToX = w / globals.sceneW
        this.scaleWorldToY = h / globals.sceneH
        this.debug = new Uint8Array(w * h * 4)
        this.debugTex = PIXI.Texture.fromBuffer(this.debug, w, h)
        this.debugTex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this.debugSprite = new PIXI.Sprite(this.debugTex)
        this.debugSprite.width = globals.sceneW
        this.debugSprite.height = globals.sceneH
        this.debugSprite.x = 0
        this.debugSprite.y = 0
        this.name = name
    }

    private calcIdx(worldX: number, worldY: number): number {
        const x = Math.round(worldX * this.scaleWorldToX)
        const y = Math.round(worldY * this.scaleWorldToY)
        // console.log(`x = ${x}, y = ${y}, idx: ${y * this.w +}`)
        return y * this.w + x
    }

    public updateDebug() {
        for (let y = 0; y < this.h; ++y) {
            for (let x = 0; x < this.w; ++x) {
                const idx = y * this.w + x
                const val = this.values[idx]
                const dbgIdx = idx * 4
                const res = Math.max(0, (this.decayMs - (globals.gameTimeMs - val)))
                this.debug[dbgIdx + 0] = 0
                this.debug[dbgIdx + 1] = res > 0 ? 255 : 0
                this.debug[dbgIdx + 2] = 0
                this.debug[dbgIdx + 3] = (res / this.decayMs) * 255 * 0.5
            }
        }
        this.debugTex.update()
    }

    public sample(worldX: number, worldY: number): number {
        const idx = this.calcIdx(worldX, worldY)
        const val = this.values[idx]
        return Math.max(0, (this.decayMs - (globals.gameTimeMs - val)))
    }

    public set(worldX: number, worldY: number, timestamp: number) {
        const idx = this.calcIdx(worldX, worldY)
        if (timestamp > this.values[idx])
            this.values[idx] = timestamp
    }
}

export default field
