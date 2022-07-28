import field from "./field"
import globals from "./globals"

class collision {
    static homeMarkers: field = new field(
        globals.markersW,
        globals.markersH,
        globals.homeDecayTime,
        'homeMarkers')
        
    // static foodMarkers: field = new field(
    //     globals.markersW,
    //     globals.markersH,
    //     globals.foodDecayTime,
    //     'foodMarkers')

    static level: Uint8Array

    static sample(x: number, y: number): number {
        const worldToCollScaleX = globals.collW / globals.sceneW
        const worldToCollScaleY = globals.collH / globals.sceneH
        const sampleX = Math.round(x * worldToCollScaleX)
        const sampleY = Math.round(y * worldToCollScaleY)
        const idx = sampleY * globals.collW + sampleX
        const val = this.level[idx]
        return val
    }
}

export default collision