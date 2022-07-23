import * as PIXI from 'pixi.js'
import { Ant } from './ant';
import { level } from './level';

class game {
    static app: PIXI.Application
    static level: level
    static ants: Ant[] = [];

    static stop() {
        console.log('Stopping game...')
        const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement
        gameCanvas.removeChild(this.app.view)
        this.app.destroy()
    }
    
    static run(tick: (delta: number) => void) {
        console.log('Starting game...')
    
        const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement
        if (!gameCanvas)
            throw new Error('gameCanvas not found');
    
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

        this.app = new PIXI.Application({ backgroundColor: 0x606060, width: 800, height: 600 });
        gameCanvas.appendChild(this.app.view)

        this.level = new level()
        this.level.loadLevel()
    
        for (let i = 0; i < 5; ++i) {
            game.addAnt();
        }

        this.app.ticker.add(tick)
    }

    static updateAnts(delta: number) {
        for (let ant of this.ants) {
            ant.update(delta)
        }
    }

    static addAnt() {
        const ant = new Ant();
        this.ants.push(ant);
    }
}

export default game;