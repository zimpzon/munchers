class globals {
  static sceneW: number = 1200;
  static sceneH: number = 900;
  static collW: number = 800;
  static collH: number = 600;
  static markersW: number = 800;
  static markersH: number = 600;
  static homeDecayTime: number = 30000;
  static foodDecayTime: number = 25000;
  static homeMarkerModulus: number = 1;
  static foodMarkerModulus: number = 1;
  static homeScanModulus: number = 7;
  static foodScanModulus: number = 4;
  static gameTimeMs: number = 0;
  static updateCounter: number = 0;
  static homeSize: number = 64;
  static homeRadius: number = this.homeSize * 0.5;
  static simStepMs: number = 30;
  static simFps: number = 1000 / this.simStepMs;
  static simStep: number = 1 / this.simFps;
  static turbo: boolean = false;
  static showTrails: boolean = true;
  static foodValue: number = 0.05;
}

export default globals;
