export const distanceSqr = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1
    const dy = y2 - y1
    return dx * dx + dy * dy
}
