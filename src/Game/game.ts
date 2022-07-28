import * as PIXI from 'pixi.js'
import { Ant } from './ant';
import collision from './collision';
import globals from './globals';
import { level } from './level';
import { Soldier } from './soldier';

class game {
    static app: PIXI.Application
    static level: level
    static ants: Ant[] = []
    static soldiers: Soldier[] = []
    static showHomeTrails: boolean = false
    static showFoodTrails: boolean = false

    static stop() {
        console.log('Stopping game...')
        const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement
        gameCanvas.removeChild(this.app.view)
        this.ants = []
        this.soldiers = []
       
        this.app.destroy()
    }
    
    static run(tick: () => void) {
        console.log('Starting game...')
    
        const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement
        if (!gameCanvas)
            throw new Error('gameCanvas not found');
    
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

        this.app = new PIXI.Application({ backgroundColor: 0x606060, width: globals.sceneW, height: globals.sceneH });
        gameCanvas.appendChild(this.app.view)

        this.level = new level()
        this.level.loadLevel()
    
        for (let i = 0; i < 3; ++i) {
            game.addAnt();
        }

        for (let i = 0; i < 0; ++i) {
            game.addSoldier();
        }

        this.app.ticker.add(tick)
    }

    static tickGame() {
        for (let ant of this.ants) {
            ant.update()
        }

        for (let soldier of this.soldiers) {
            soldier.update()
        }

        if (this.showHomeTrails)
            collision.homeMarkers.updateDebug()
    }

    static addAnt() {
        const ant = new Ant();
        this.ants.push(ant);
    }

    static addSoldier() {
        const soldier = new Soldier();
        this.soldiers.push(soldier);
    }

    static recall() {
        this.ants[0].recall()
        // for (let ant of this.ants) {
        //     ant.recall()
        // }

        for (let soldier of this.soldiers) {
            soldier.recall()
        }
    }
}

export default game;