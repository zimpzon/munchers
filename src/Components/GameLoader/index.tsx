import { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import sprites from './../../Game/sprites';
import collision from '../../Game/collision';
import level from '../../Game/level';

function GameLoader(props: any): JSX.Element {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    console.log('Loading resources...');

    const loader = new PIXI.Loader();
    loader.add('antDefault', 'gfx/ant.png');
    loader.add('level1Background', 'gfx/level2.png');
    // loader.add('level1Background', 'gfx/level1_phase1.png');
    loader.add('white_2x2', 'gfx/white_2x2.png');
    loader.add('whiteCircle', 'gfx/white_circle.png');
    loader.add('homeIcon', 'gfx/home.png');

    loader.load((_, resources: any) => {
      const imgData1 = getImageData('gfx/level2.png');
      collision.level_phase1 = level.loadCollisionMap(imgData1);

      sprites.whiteCircle = new PIXI.Sprite(resources.whiteCircle.texture);
      sprites.white_2x2 = new PIXI.Sprite(resources.white_2x2.texture);

      sprites.antDefault = new PIXI.Sprite(resources.antDefault.texture);
      sprites.antDefault.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

      sprites.level1Background = new PIXI.Sprite(resources.level1Background.texture);
      sprites.level1Background.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

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
