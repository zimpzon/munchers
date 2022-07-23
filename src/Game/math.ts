import * as Vec2D from 'vector2d'

export function RandomUnitVector(): Vec2D.Vector {
    let vec = new Vec2D.Vector((Math.random() * 2) - 1, (Math.random() * 2) - 1)
    vec.normalise()
    return vec
}
