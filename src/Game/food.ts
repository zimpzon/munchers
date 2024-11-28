import globals from './globals';

class food {
  w: number;
  h: number;
  scaleWorldToX: number;
  scaleWorldToY: number;
  scaleXToWorld: number;
  scaleYToWorld: number;
  layer: Uint8Array;

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.layer = new Uint8Array(w * h);

    this.scaleWorldToX = w / globals.sceneW;
    this.scaleWorldToY = h / globals.sceneH;
    this.scaleXToWorld = 1.0 / this.scaleWorldToX;
    this.scaleYToWorld = 1.0 / this.scaleWorldToY;
  }

  private calcIdx(worldX: number, worldY: number): number {
    const x = Math.round(worldX * this.scaleWorldToX + 0.15);
    const y = Math.round(worldY * this.scaleWorldToY + 0.15);
    return y * this.w + x;
  }

  public sample(worldX: number, worldY: number, result: boolean) {
    const idx = this.calcIdx(worldX, worldY);
    return;
  }
}

export default food;
