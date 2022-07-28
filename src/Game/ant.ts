import * as PIXI from 'pixi.js'
import * as Vec2D from 'vector2d'
import collision from './collision';
import game from './game';
import globals from './globals';
import level from './level';
import * as MathUtil from './math';
import sprites from './sprites';
import { distanceSqr } from './util';

enum AntState { Exploring, ReturningHome }

export class Ant {
    public dir: Vec2D.Vector
    container: PIXI.Container // A sprite is actually also a container, so no need for this parent container.
    scanFwd: PIXI.Sprite
    scanLeft: PIXI.Sprite
    scanRight: PIXI.Sprite
    pointFwd: PIXI.Point = new PIXI.Point()
    pointLeft: PIXI.Point = new PIXI.Point()
    pointRight: PIXI.Point = new PIXI.Point()
    prefLeft: number = 0.4 - Math.random() * 0.15
    prefRight: number = 0.4 - Math.random() * 0.15
    turnAngle: number = 0
    individualSpeed: number = 50 + (Math.random() * 0.8 - 0.4)
    atHomeTimestamp: number = 0
    state: AntState = AntState.Exploring

    constructor() {
        this.container = new PIXI.Container();
        this.container.x = level.homeX
        this.container.y = level.homeY;

        const ant = new PIXI.Sprite(sprites.antDefault.texture)
        ant.tint = 0xffffff
        ant.width = 8
        ant.height = 8
        ant.anchor.set(0.5, 0.5)
        this.dir = MathUtil.RandomUnitVector()
        this.container.addChild(ant)

        this.pointFwd.x = ant.width * 0.6

        this.pointLeft.x = ant.width * 0.5
        this.pointLeft.y = ant.height * -0.5

        this.pointRight.x = ant.width * 0.5
        this.pointRight.y = ant.height * 0.5

        const dotFwd = new PIXI.Sprite(sprites.white_2x2.texture)
        dotFwd.width = 2
        dotFwd.height = 2
        dotFwd.position = this.pointFwd
        dotFwd.anchor.set(0.5, 0.5)
        this.scanFwd = dotFwd

        const dotLeft = new PIXI.Sprite(sprites.white_2x2.texture)
        dotLeft.width = 2
        dotLeft.height = 2
        dotLeft.position = this.pointLeft
        dotLeft.anchor.set(0.5, 0.5)
        this.scanLeft = dotLeft
        
        const dotRight = new PIXI.Sprite(sprites.white_2x2.texture)
        dotRight.width = 2
        dotRight.height = 2
        dotRight.position = this.pointRight
        dotRight.anchor.set(0.5, 0.5)
        this.scanRight = dotRight
        
        // this.container.addChild(dotFwd)
        // this.container.addChild(dotLeft)
        // this.container.addChild(dotRight)

        this.container.pivot.x = 0
        this.container.pivot.y = 0
        this.atHomeTimestamp = globals.gameTimeMs

        game.app.stage.addChild(this.container)
    }

    public recall() {
        this.state = AntState.ReturningHome
        // this.container.x = level.homeX
        // this.container.y = level.homeY
    }

    private explore() {
        const rndSwitch = this.turnAngle === 0 ? Math.random() < 0.1 : Math.random() < 0.1
        if (rndSwitch) {
            const rnd = Math.random()
            if (rnd < this.prefLeft)
                this.turnAngle = 3
            else if (rnd > 1 - this.prefRight)
                this.turnAngle = -3
            else
                this.turnAngle = 0
        }

        this.dir.rotate(PIXI.DEG_TO_RAD * this.turnAngle * globals.simStep * this.individualSpeed)

        this.container.rotation = Math.atan2(this.dir.y, this.dir.x)
        const fwd = this.container.toGlobal(this.pointFwd)
        const dist = distanceSqr(this.container.position.x, this.container.position.y, level.homeX, level.homeY)
        const isHome = dist < globals.homeSize * globals.homeSize
        if (isHome)
            this.atHomeTimestamp = globals.gameTimeMs

        const newPos = new PIXI.Point(
            this.container.position.x + this.dir.x * globals.simStep * this.individualSpeed,
            this.container.position.y + this.dir.y * globals.simStep * this.individualSpeed)

        const s = collision.sample(fwd.x, fwd.y)
        if (s === 255) {
            this.dir.x *= Math.random() * 0.8 - 1
            this.dir.y *= Math.random() * 0.8 - 1
            this.dir.normalise()
            return
        }

        this.container.position = newPos
    }

    private returnHome() {
        this.explore()
        const sample = collision.homeMarkers.sample(this.container.position.x, this.container.position.y)
        console.log(sample)
    }

    public update() {
        switch (this.state) {
            case AntState.Exploring:
                this.explore()
                collision.homeMarkers.set(this.container.position.x, this.container.position.y, this.atHomeTimestamp)
                break;

            case AntState.ReturningHome:
                this.returnHome()
                break;
        }
    }
}