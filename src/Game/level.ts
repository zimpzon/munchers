import * as PIXI from 'pixi.js'
import game from './game'
import globals from './globals'

export class level {
    homeMarkers: number[] = []
    foodMarkers: number[] = []
    collMap: Uint8Array = new Uint8Array()
    static homeX: number = 0
    static homeY: number = 0

    backgroundSprite: PIXI.Sprite | undefined

    public loadLevel() {
        var levelDef = Level1
        this.backgroundSprite = PIXI.Sprite.from(levelDef.path)
        const collW = globals.collW;
        const collH = globals.collH;

        let pixArray = game.app.renderer.plugins.extract.pixels(this.backgroundSprite)

        let val = pixArray.reduce((prev: number, i: number) => prev + i, 0)
        console.log("val: " + val)

        this.backgroundSprite.width = globals.sceneW
        this.backgroundSprite.height = globals.sceneH
        this.collMap = new Uint8Array(globals.collW * globals.collH)
        for (let y = 0; y < collH; ++y)
        {
            for (let x = 0; x < collW; ++x)
            {
                let idx = y * collW + x;
                let r = pixArray[idx + 0]
                let g = pixArray[idx + 1]
                let b = pixArray[idx + 2]
                this.collMap[idx] = 128;
            }
        }

        let b = new PIXI.BufferResource(this.collMap, { width: collW, height: collH })
        let bt = new PIXI.BaseTexture(b);
        bt.format = WebGLRenderingContext.LUMINANCE
        let t = new PIXI.Texture(bt)

        this.backgroundSprite = PIXI.Sprite.from(t)

        console.log(this.collMap.length)

        level.homeX = levelDef.homeX
        level.homeY = levelDef.homeY

        game.app.stage.addChild(this.backgroundSprite);
    }
}

class LevelDef {
    public path: string = ''
    public homeX: number = 0
    public homeY: number = 0
}

const Level1: LevelDef = {
    path: '/gfx/map-test-2.png',
    homeX: 150,
    homeY: 250,
}

export default level