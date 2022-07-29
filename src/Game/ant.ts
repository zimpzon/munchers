import * as PIXI from 'pixi.js'
import * as Vec2D from 'vector2d'
import collision from './collision';
import field, { sampleResult } from './field';
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
    pointFwd: PIXI.Point = new PIXI.Point()
    prefLeft: number = 0.2
    prefRight: number = 0.2
    turnAngle: number = 0
    individualSpeed: number = 50 + (Math.random() * 0.8 - 0.4)
    atHomeTimestamp: number = 0
    atFoodTimestamp: number = 0
    isAtHome: boolean = false
    state: AntState = AntState.Exploring
    skip: number = 0

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

        const dotFwd = new PIXI.Sprite(sprites.white_2x2.texture)
        dotFwd.width = 2
        dotFwd.height = 2
        dotFwd.position = this.pointFwd
        dotFwd.anchor.set(0.5, 0.5)
        this.scanFwd = dotFwd
      
        // this.container.addChild(dotFwd)

        this.container.pivot.x = 0
        this.container.pivot.y = 0
        this.atHomeTimestamp = globals.gameTimeMs

        game.app.stage.addChild(this.container)
    }

    public recall() {
        this.atFoodTimestamp = globals.gameTimeMs
        this.state = AntState.ReturningHome
        this.container.addChild(this.scanFwd)
    }

    public unrecall() {
        this.state = AntState.Exploring
        this.container.removeChild(this.scanFwd)
    }

    private common() {
        this.dir.rotate(PIXI.DEG_TO_RAD * this.turnAngle * globals.simStep * this.individualSpeed)

        this.container.rotation = Math.atan2(this.dir.y, this.dir.x)
        const fwd = this.container.toGlobal(this.pointFwd)
        const dist = distanceSqr(this.container.position.x, this.container.position.y, level.homeX, level.homeY)
        this.isAtHome = dist < globals.homeRadius * globals.homeRadius
        if (this.isAtHome)
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
    }

    sample: sampleResult = new sampleResult()

    private followMarkers(): boolean {
        // const fwd = this.container.toGlobal(this.pointFwd)

        // const sampleFwd = collision.markers.sample(fwd.x, fwd.y, this.sample)

        return false
    }
    
    private returnHome() {
        if (this.isAtHome) {
            this.unrecall()
            return
        }

        if (!this.followMarkers())
            this.explore()
    }

    public update() {
        switch (this.state) {
            case AntState.Exploring:
                if (!this.followMarkers()) {
                    this.explore()
                }
                const dist = distanceSqr(this.container.position.x, this.container.position.y, level.foodX, level.foodY)
                const isAtFood = dist < globals.homeRadius * globals.homeRadius
                if (isAtFood) {
                    this.dir.x *= -1
                    this.dir.y *= -1
                    this.recall()
                }
                else {
                    if (++this.skip == 3) {
                        this.skip = 0
                        collision.markers.setHome(this.container.position.x, this.container.position.y, this.atHomeTimestamp)
                    }
                }
                break;

            case AntState.ReturningHome:
                this.returnHome()
                collision.markers.setFood(this.container.position.x, this.container.position.y, this.atFoodTimestamp)
                break;
        }

        this.common()
    }
}