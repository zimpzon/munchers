import * as PIXI from 'pixi.js'
import * as Custom from './CustomBufferResource'
import globals from "./globals"

export class sampleResult {
    public markerX : number = 0
    public markerY : number = 0
    public dirX: number = 0
    public dirY: number = 0
    public success: boolean = false
}

class markers {
    timestamps: Float32Array
    directions: Uint8Array
    baseTex: PIXI.BaseTexture
    tex: PIXI.Texture
    sprite: PIXI.Sprite
    w: number
    h: number
    decayMs: number
    scaleWorldToX: number
    scaleWorldToY: number
    uniforms: any

    constructor(w: number, h: number, decayMs: number, isHome: boolean) {
        this.timestamps = new Float32Array(w * h)
        this.directions = new Uint8Array(w * h)
        this.initValues()

        this.w = w
        this.h = h
        this.decayMs = decayMs
        this.scaleWorldToX = w / globals.sceneW
        this.scaleWorldToY = h / globals.sceneH

        const resource = new Custom.CustomBufferResource(this.timestamps, {
            width: w,
            height: h,
            internalFormat: 'R32F',
            format: 'RED',
            type: 'FLOAT'
          })
        
        // var b = new BufferResource(this.values, { width: w, height: h})
        this.baseTex = new PIXI.BaseTexture(resource, { scaleMode: PIXI.SCALE_MODES.NEAREST })
        this.baseTex.alphaMode = PIXI.ALPHA_MODES.PREMULTIPLY_ALPHA
        this.tex = new PIXI.Texture(this.baseTex)
        
        this.sprite = new PIXI.Sprite(this.tex)
        this.sprite.width = globals.sceneW
        this.sprite.height = globals.sceneH
        this.sprite.x = 0
        this.sprite.y = 0

        this.uniforms = {
            gameTimeMs: 0,
            decayTimeMs: decayMs,
            mulR: isHome ? 0.0 : 0.1,
            mulG: isHome ? 0.1 : 0.05,
            mulB: isHome ? 0.0 : 0.5,
        }

        const shaderCode = document.getElementById('markerShader') as HTMLScriptElement
        if (!shaderCode)
            throw new Error('shaderCode not found');

        const markerFilter = new PIXI.Filter(undefined, shaderCode.innerText, this.uniforms);
        markerFilter.blendMode = PIXI.BLEND_MODES.ADD
        this.sprite.filters = [markerFilter]
    }

    private initValues() {
        for (let i = 0; i < this.timestamps.length; i++) {
            this.timestamps[i] = -1
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
        let newest: number = 9999999
        let idxNewest: number = -1
        let dirByteNewest: number = 0
        const d = 4
        for (let y = -d; y <= d; ++y) {
            for (let x = -d; x <= d; ++x) {
                const subIdx = idx + y * this.w + x
                const stamp = this.timestamps[subIdx]
                if (stamp < 0)
                    continue

                const age = globals.gameTimeMs - stamp
                if (age < newest) {
                    idxNewest = subIdx
                    newest = age
                    dirByteNewest = this.directions[subIdx]
                    result.success = true
                }
            }
        }

        if (result.success) {
            let theta = (dirByteNewest / 255.0) * (Math.PI * 2) - Math.PI
            result.dirX = Math.cos(theta)
            result.dirY = Math.sin(theta)
        }
    }

    tauToByteScale: number = (Math.PI * 2) / 255
    
    public set(worldX: number, worldY: number, scentValue: number, dirX: number, dirY: number) {
        const idx = this.calcIdx(worldX, worldY)
        this.timestamps[idx] = globals.gameTimeMs + scentValue
        
        // atan2 returns radians in the range -PI to PI.
        const radians = Math.atan2(dirY, dirX)

        // Translate to 0 to TAU, then scale to 0 to 1, then multiply by 255.
        this.directions[idx] = (radians + Math.PI) * this.tauToByteScale
    }
}

export default markers
