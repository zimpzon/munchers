import * as PIXI from 'pixi.js'
import * as Vec2D from 'vector2d'
import game from './game';
import level from './level';
import * as MathUtil from './math';

export class Ant {
    public dir: Vec2D.Vector
    public sprite: PIXI.Sprite

    constructor() {
        const ant = PIXI.Sprite.from('/gfx/ant.png')
        ant.width = 10;
        ant.height = 10;
        ant.x = level.homeX
        ant.y = level.homeY;
        this.sprite = ant;
        this.dir = MathUtil.RandomUnitVector()
        game.app.stage.addChild(ant)
    }

    public update(delta: number) {
        this.dir.rotate(PIXI.DEG_TO_RAD * 1)
        this.sprite.rotation = Math.atan2(this.dir.y, this.dir.x)
        this.sprite.x += delta * this.dir.x
        this.sprite.y += delta * this.dir.y
    }
}