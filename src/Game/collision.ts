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

  static sample(x: number, y: number): number {
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
