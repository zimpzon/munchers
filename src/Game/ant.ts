import * as PIXI from 'pixi.js'
import { Vector } from 'vector2d';
import collision from './collision';
import game from './game';
import globals from './globals';
import level from './level';
import { sampleResult } from './markers';
import sprites from './sprites';

export enum MotivationState {
    lookForFood,
    pickingUpFood,
    deliverFood
}

export interface IAntState {
    motivationState: MotivationState,
    posX: number,
    posY: number,
    dirX: number,
    dirY: number,
    homeScent: number,
    foodScent: number,
    pickUpFoodStartMs: number,
}

export class Ant {
    public static counter: number = 0
    id: number = Ant.counter++

    container: PIXI.Container // A sprite is actually also a container, so no need for this parent container.
    scanFwd: PIXI.Sprite
    pointFwd: PIXI.Point = new PIXI.Point()
    prefLeft: number = 0.2
    prefRight: number = 0.2
    turnAngle: number = 0
    individualSpeed: number = 50
    skip: number = 0
    state: IAntState
    sugarSize: number = 3
    foodScanId: number
    homeScanId: number

    // Globals initialized in top of update()
    isOnHome: boolean = false

    constructor(state: IAntState) {
        this.state = state
        this.container = new PIXI.Container();
        this.container.x = state.posX
        this.container.y = state.posY

        const ant = new PIXI.Sprite(sprites.antDefault.texture)
        ant.tint = 0xffffff
        ant.width = 10
        ant.height = 10
        ant.anchor.set(0.5, 0.5)
        this.container.addChild(ant)

        this.pointFwd.x = ant.width * 0.6

        const dotFwd = new PIXI.Sprite(sprites.white_2x2.texture)
        dotFwd.width = state.motivationState === MotivationState.deliverFood ? this.sugarSize : 0
        dotFwd.height = state.motivationState === MotivationState.deliverFood ? this.sugarSize : 0
        dotFwd.position = this.pointFwd
        dotFwd.anchor.set(0.5, 0.5)
        dotFwd.tint = 0x10ffff
        this.scanFwd = dotFwd
        this.container.addChild(this.scanFwd)
      
        this.container.pivot.x = 0
        this.container.pivot.y = 0

        this.foodScanId = this.id % globals.foodScanModulus
        this.homeScanId = this.id % globals.homeScanModulus

        game.app.stage.addChild(this.container)
    }

    private getDirVec(): Vector {
        return new Vector(this.state.dirX, this.state.dirY)
    }

    private SetDir(vec: Vector) {
        this.state.dirX = vec.x
        this.state.dirY = vec.y
    }

    private common() {
        const vec = this.getDirVec()
        vec.rotate(PIXI.DEG_TO_RAD * this.turnAngle * globals.simStep * this.individualSpeed)
        this.SetDir(vec)

        this.container.rotation = Math.atan2(this.state.dirY, this.state.dirX)
        const fwd = this.container.toGlobal(this.pointFwd)

        const newPos = new PIXI.Point(
            this.container.position.x + this.state.dirX * globals.simStep * this.individualSpeed,
            this.container.position.y + this.state.dirY * globals.simStep * this.individualSpeed)

        const s = collision.sample(fwd.x, fwd.y)
        if (s === 255) {
            const vec = new Vector(this.state.dirX *= Math.random() * 0.8 - 1, this.state.dirY *= Math.random() * 0.8 - 1)
            vec.normalise()
            this.SetDir(vec)
            return
        }

        this.container.position = newPos
        if (this.isOnHome)
        {
            this.state.homeScent = game.gameState.homeScentMax
        }
    }

    private lookForFood() {
        if (globals.updateCounter % globals.homeMarkerModulus === 0)
            collision.homeMarkers.set(
                this.state.posX,
                this.state.posY,
                this.state.homeScent,
                this.state.dirX,
                this.state.dirY)

        if (globals.updateCounter % globals.foodScanModulus !== this.foodScanId)
            return

        const food = level.isOnFood(this.state.posX, this.state.posY)
        if (food !== null) {
            this.state.foodScent = game.gameState.foodScentMax
            this.state.motivationState = MotivationState.pickingUpFood
            this.state.pickUpFoodStartMs = globals.gameTimeMs
            const vec = new Vector(this.state.dirX *= Math.random() * 0.8 - 1, this.state.dirY *= Math.random() * 0.8 - 1)
            vec.normalise()
            this.SetDir(vec)
            return
        }

        this.explore(globals.foodScanModulus)
    }

    latestHomeMarkersSample: sampleResult = new sampleResult()

    private deliverFood() {
        if (globals.updateCounter % globals.foodMarkerModulus === 0) {
            collision.foodMarkers.set(
                this.state.posX,
                this.state.posY,
                this.state.foodScent,
                this.state.dirX,
                this.state.dirY)
        }

        if (this.isOnHome) {
            this.state.motivationState = MotivationState.lookForFood
            this.scanFwd.width = 0
            this.scanFwd.height = 0
            game.addMoney(1)
            return
        }

        collision.homeMarkers.sample(this.scanFwd.position.x, this.scanFwd.position.y, this.latestHomeMarkersSample)
        // Y no match??
        if (this.latestHomeMarkersSample.success === true)
            console.log(this.latestHomeMarkersSample.markerX)

        this.explore(1)
    }

    private explore(modulus: number) {
        const rndSwitch = Math.random() / modulus < 0.1
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

    private pickingUpFood() {
        if (globals.gameTimeMs > this.state.pickUpFoodStartMs + game.gameState.pickupFoodMs) {
            const food = level.isOnFood(this.state.posX, this.state.posY)
            if (food === null) {
                this.state.motivationState = MotivationState.lookForFood
                console.log('lost food')
                return
            }

            this.state.motivationState = MotivationState.deliverFood
            this.scanFwd.width = this.sugarSize
            this.scanFwd.height = this.sugarSize
            food.claim()
        }
    }

    public update() {
        this.state.posX = this.container.position.x
        this.state.posY = this.container.position.y
        this.isOnHome = level.isOnHome(this.state.posX, this.state.posY)

        if (this.state.motivationState === MotivationState.lookForFood) {
            this.lookForFood()
        } else if (this.state.motivationState === MotivationState.pickingUpFood) {
            this.pickingUpFood()
        } else if (this.state.motivationState === MotivationState.deliverFood) {
            this.deliverFood()
        }

        if (this.state.motivationState !== MotivationState.pickingUpFood)
            this.common()
    }
}