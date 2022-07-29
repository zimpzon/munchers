import * as PIXI from 'pixi.js'
import globals from "./globals"

export class sampleResult {
    public x : number = 0
    public y : number = 0
    public max: number = 0
}

class markers {
    values: Float32Array
    tex: PIXI.Texture
    sprite: PIXI.Sprite
    w: number
    h: number
    decayMs: number
    scaleWorldToX: number
    scaleWorldToY: number

    constructor(w: number, h: number, decayMs: number) {
        this.values = new Float32Array(w * h * 4).fill(-10000000)
        this.initValues()

        this.w = w
        this.h = h
        this.decayMs = decayMs
        this.scaleWorldToX = w / globals.sceneW
        this.scaleWorldToY = h / globals.sceneH

        this.tex = PIXI.Texture.fromBuffer(this.values, w, h)
        this.tex.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

        this.sprite = new PIXI.Sprite(this.tex)
        this.sprite.width = globals.sceneW
        this.sprite.height = globals.sceneH
        this.sprite.x = 0
        this.sprite.y = 0

        const shaderCode = document.getElementById('markerShader') as HTMLScriptElement
        if (!shaderCode)
            throw new Error('shaderCode not found');

        const markerFilter = new PIXI.Filter(undefined, shaderCode.innerText);
        this.sprite.filters = [markerFilter]
    }

    private initValues() {
        for (let i = 0; i < this.values.length; i += 4) {
            this.values[i + 0] = -10000000
            this.values[i + 1] = -10000000
            this.values[i + 2] = -10000000
            this.values[i + 3] = 1
        }
    }

    private calcIdx(worldX: number, worldY: number): number {
        const x = Math.round(worldX * this.scaleWorldToX)
        const y = Math.round(worldY * this.scaleWorldToY)
        return y * this.w + x
    }

    public updateDebug() {
        this.tex.update()
    }

    public sample(worldX: number, worldY: number, result: sampleResult) {
        const idx = this.calcIdx(worldX, worldY)
        let max = -99999999999
        const d = 4
        for (let y = -d; y <= d; ++y) {
            for (let x = -d; x <= d; ++x) {
                const v = this.values[idx + y * this.w + x]
                if (v > max) {
                    result.x = x
                    result.y = y
                    max = v
                }
            }
        }
        result.max = max
        return Math.max(0, (this.decayMs - (globals.gameTimeMs - max)))
    }

    public setHome(worldX: number, worldY: number, timestamp: number) {
        const idx = this.calcIdx(worldX, worldY) * 4 + 1
        if (timestamp > this.values[idx]) {
            this.values[idx] = timestamp
        }
    }

    public setFood(worldX: number, worldY: number, timestamp: number) {
        const idx = this.calcIdx(worldX, worldY) * 4 + 2
        if (timestamp > this.values[idx]) {
            this.values[idx] = timestamp
        }
    }
}

export default markers
