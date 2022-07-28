class globals {
    static sceneW: number = 1200
    static sceneH: number = 900
    static collW: number = 800
    static collH: number = 600
    static markersW: number = 800
    static markersH: number = 600
    static homeDecayTime: number = 1000 * 60 * 5
    static foodDecayTime: number = 5000
    static gameTimeMs: number = 0
    static homeSize: number = 64
    static simStepMs: number = 30
    static simFps: number = 1000 / this.simStepMs
    static simStep: number = 1 / this.simFps
}

export default globals
