import * as PIXI from 'pixi.js';
import * as Custom from './CustomBufferResource';
import globals from './globals';
import collision from './collision';

export class sampleResult {
  public targetX: number = 0;
  public targetY: number = 0;
  public success: boolean = false;
}

class markers {
  timestamps: Float32Array;
  prevIdx: Uint32Array;
  scent: Float32Array;
  baseTex: PIXI.BaseTexture;
  tex: PIXI.Texture;
  sprite: PIXI.Sprite;
  w: number;
  h: number;
  decayMs: number;
  scaleWorldToX: number;
  scaleWorldToY: number;
  scaleXToWorld: number;
  scaleYToWorld: number;
  uniforms: any;

  constructor(w: number, h: number, decayMs: number, isHome: boolean) {
    this.timestamps = new Float32Array(w * h);
    this.prevIdx = new Uint32Array(w * h);
    this.scent = new Float32Array(w * h);
    this.initValues();

    this.w = w;
    this.h = h;
    this.decayMs = decayMs;
    this.scaleWorldToX = w / globals.sceneW;
    this.scaleWorldToY = h / globals.sceneH;
    this.scaleXToWorld = 1.0 / this.scaleWorldToX;
    this.scaleYToWorld = 1.0 / this.scaleWorldToY;

    const resource = new Custom.CustomBufferResource(this.timestamps, {
      width: w,
      height: h,
      internalFormat: 'R32F',
      format: 'RED',
      type: 'FLOAT',
    });

    this.baseTex = new PIXI.BaseTexture(resource, { scaleMode: PIXI.SCALE_MODES.NEAREST });
    this.baseTex.alphaMode = PIXI.ALPHA_MODES.PREMULTIPLY_ALPHA;
    this.tex = new PIXI.Texture(this.baseTex);

    this.sprite = new PIXI.Sprite(this.tex);
    this.sprite.width = globals.sceneW;
    this.sprite.height = globals.sceneH;
    this.sprite.x = 0;
    this.sprite.y = 0;

    this.uniforms = {
      gameTimeMs: 0,
      decayTimeMs: decayMs,
      mulR: isHome ? 0.1 : 0.3,
      mulG: isHome ? 0.4 : 0.3,
      mulB: isHome ? 0.0 : 1.0,
    };

    const shaderCode = document.getElementById('markerShader') as HTMLScriptElement;
    if (!shaderCode) throw new Error('shaderCode not found');

    const markerFilter = new PIXI.Filter(undefined, shaderCode.innerText, this.uniforms);
    markerFilter.blendMode = PIXI.BLEND_MODES.ADD;
    this.sprite.filters = [markerFilter];
  }

  private initValues() {
    for (let i = 0; i < this.timestamps.length; i++) {
      this.timestamps[i] = -1;
      this.prevIdx[i] = -1;
      this.scent[i] = 0;
    }
  }

  private calcIdx(worldX: number, worldY: number): number {
    const x = Math.round(worldX * this.scaleWorldToX + 0.15);
    const y = Math.round(worldY * this.scaleWorldToY + 0.15);
    return y * this.w + x;
  }

  public updateDebug() {
    this.uniforms.gameTimeMs = globals.showTrails ? globals.gameTimeMs : globals.gameTimeMs + 25000;
    this.tex.update();
  }

  public sample(worldX: number, worldY: number, result: sampleResult) {
    const idx = this.calcIdx(worldX, worldY);
    let bestScent: number = -1;
    let idxPrev: number = -1;
    let idxBest = -1;
    const d = 2;
    for (let y = -d; y <= d; ++y) {
      for (let x = -d; x <= d; ++x) {
        const subIdx = idx + y * this.w + x;

        if (this.timestamps[subIdx] > globals.gameTimeMs && this.scent[subIdx] > bestScent) {
          bestScent = this.scent[subIdx];
          idxPrev = this.prevIdx[subIdx];
          idxBest = subIdx;
          result.success = true;
        }
      }
    }

    if (idxPrev < 0) result.success = false;

    if (result.success) {
      const x = idxPrev % this.w;
      const y = (idxPrev - x) / this.w;
      result.targetX = (x + 0.15) * this.scaleXToWorld;
      result.targetY = (y + 0.15) * this.scaleYToWorld;
    }
  }

  public set(worldX: number, worldY: number, scentValue: number, idxPrev: number): number {
    if (scentValue === 0) scentValue = Math.random() * 1000;

    const idx = this.calcIdx(worldX, worldY);
    // do not set scent values next to a wall (attempt to get rid of stuck ants at corners)

    if (collision.isCloseToWall(worldX, worldY))
    {
      return 0;
    }

    if (scentValue > this.scent[idx] || globals.gameTimeMs > this.timestamps[idx]) {
      this.timestamps[idx] = globals.gameTimeMs + this.decayMs;
      this.scent[idx] = scentValue;
      this.prevIdx[idx] = idxPrev;
    }
    return idx;
  }
}

export default markers;
