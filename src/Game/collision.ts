import globals from './globals';
import markers from './markers';

class collision {
  static foodMarkers: markers = new markers(
    globals.markersW,
    globals.markersH,
    globals.foodDecayTime,
    false
  );

  static homeMarkers: markers = new markers(
    globals.markersW,
    globals.markersH,
    globals.homeDecayTime,
    true
  );

  static level: Uint8Array;
  static level_phase1: Uint8Array;
  static level_phase2: Uint8Array;
  static level_phase3: Uint8Array;
  static level_phase4: Uint8Array;

  static isCloseToWall(x: number, y: number): boolean {
    const worldToCollScaleX = globals.collW / globals.sceneW;
    const worldToCollScaleY = globals.collH / globals.sceneH;
    const sampleX = Math.round(x * worldToCollScaleX);
    const sampleY = Math.round(y * worldToCollScaleY);
    const sum =
      this.sampleLocalCoord(sampleX + 2, sampleY - 2) +
      this.sampleLocalCoord(sampleX + 2, sampleY + 2) +
      this.sampleLocalCoord(sampleX - 2, sampleY + 2) +
      this.sampleLocalCoord(sampleX - 2, sampleY - 2);
    return sum > 0;
  }

  static sample(x: number, y: number): number {
    // return this.isCloseToWall(x, y) ? 255 : 0;

    const worldToCollScaleX = globals.collW / globals.sceneW;
    const worldToCollScaleY = globals.collH / globals.sceneH;
    const sampleX = Math.round(x * worldToCollScaleX);
    const sampleY = Math.round(y * worldToCollScaleY);
    return this.sampleLocalCoord(sampleX, sampleY);
  }

  static sampleLocalCoord(x: number, y: number): number {
    const idx = y * globals.collW + x;
    const val = this.level[idx];
    return val;
  }
}

export default collision;
