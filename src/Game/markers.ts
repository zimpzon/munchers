import * as PIXI from 'pixi.js'
import * as Custom from './CustomBufferResource'
import globals from "./globals"

export class sampleResult {
    public x : number = 0
    public y : number = 0
    public max: number = 0
}

class markers {
    values: Float32Array
    baseTex: PIXI.BaseTexture
    tex: PIXI.Texture
    sprite: PIXI.Sprite
    w: number
    h: number
    decayMs: number
    scaleWorldToX: number
    scaleWorldToY: number
    uniforms: any

    constructor(w: number, h: number, decayMs: number) {
        this.values = new Float32Array(w * h)
        this.initValues()

        this.w = w
        this.h = h
        this.decayMs = decayMs
        this.scaleWorldToX = w / globals.sceneW
        this.scaleWorldToY = h / globals.sceneH

        const resource = new Custom.CustomBufferResource(this.values, {
            width: w,
            height: h,
            internalFormat: 'R32F',
            format: 'RED',
            type: 'FLOAT'
          })
        
        // var b = new BufferResource(this.values, { width: w, height: h})
        this.baseTex = new PIXI.BaseTexture(resource, { scaleMode: PIXI.SCALE_MODES.NEAREST })
        this.tex = new PIXI.Texture(this.baseTex)
        
        this.sprite = new PIXI.Sprite(this.tex)
        this.sprite.width = globals.sceneW
        this.sprite.height = globals.sceneH
        this.sprite.x = 0
        this.sprite.y = 0

        this.uniforms = {
            gameTimeMs: 0,
            decayTimeMs: decayMs
        }

        const shaderCode = document.getElementById('markerShader') as HTMLScriptElement
        if (!shaderCode)
            throw new Error('shaderCode not found');

        this.sprite.blendMode = PIXI.BLEND_MODES.NONE
        const markerFilter = new PIXI.Filter(undefined, shaderCode.innerText, this.uniforms);
        const a = new PIXI.filters.AlphaFilter();
        this.sprite.filters = [markerFilter, a]

        // var p = new PIXI.SimplePlane(this.tex)
        // p.shader
    }

    private initValues() {
        for (let i = 0; i < this.values.length; i++) {
            this.values[i] = -1
        }
    }

    private calcIdx(worldX: number, worldY: number): number {
        const x = Math.round(worldX * this.scaleWorldToX)
        const y = Math.round(worldY * this.scaleWorldToY)
        return y * this.w + x
    }

    public updateDebug() {
        this.uniforms.gameTimeMs = globals.gameTimeMs
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

    public set(worldX: number, worldY: number, timestamp: number) {
        const idx = this.calcIdx(worldX, worldY)
        this.values[idx] = timestamp
    }
}

export default markers
