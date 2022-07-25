import globals from "./globals"

class collision {
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