import { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import sprites from './../../Game/sprites';
import collision from '../../Game/collision';
import level from '../../Game/level';
import * as generators from './../../Game/generators';

function GameLoader(props: any): JSX.Element {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    console.log('Loading resources...');

    const levelPath = 'gfx/level2.png';
    const foodLayerPath = 'gfx/food.png';
    const loader = new PIXI.Loader();
    loader.add('antDefault', 'gfx/ant.png');
    loader.add('level1Background', levelPath);
    loader.add('foodLayer', foodLayerPath);
    loader.add('white_2x2', 'gfx/white_2x2.png');
    loader.add('whiteCircle', 'gfx/white_circle.png');
    loader.add('homeIcon', 'gfx/home.png');

    loader.load((_, resources: any) => {
      const imgData1 = getImageData(levelPath);

      // Usage example
      // const imgData2 = generators.createCentralHub(imgData1.pixels, imgData1.w, imgData1.h, 10, 50, 255, 255, 255);
      // const imgData2 = generators.createGridMaze(imgData1.pixels, imgData1.w, imgData1.h, 10, 255, 255, 255);
      const imgData2 = imgData1;

      collision.level_phase1 = level.loadCollisionMap(imgData2);

      sprites.whiteCircle = new PIXI.Sprite(resources.whiteCircle.texture);
      sprites.white_2x2 = new PIXI.Sprite(resources.white_2x2.texture);

      sprites.antDefault = new PIXI.Sprite(resources.antDefault.texture);
      sprites.antDefault.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

      const baseTexture: any = PIXI.BaseTexture.fromBuffer(imgData1.pixels, imgData1.w, imgData1.h);
      sprites.level1Background = new PIXI.Sprite(new PIXI.Texture(baseTexture));
      sprites.level1Background.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  
      sprites.foodLayer = new PIXI.Sprite(resources.foodLayer.texture);
      sprites.foodLayer.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

      sprites.homeIcon = new PIXI.Sprite(resources.homeIcon.texture);
      sprites.homeIcon.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

      console.log('Loading complete.');

      setLoadingComplete(true);
    });
  }, []);

  function getImageData(url: string): { pixels: Uint8Array; w: number; h: number } {
    const img = new Image();
    img.src = url;
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context: any = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    const data = context.getImageData(0, 0, img.width, img.height).data;
    return { pixels: data, w: img.width, h: img.height };
  }

  const loading = <div>Loading...</div>;
  const main = <>{props.children}</>;

  return loadingComplete ? main : loading;
}

export default GameLoader;
