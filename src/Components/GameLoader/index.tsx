import { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import sprites from './../../Game/sprites';
import collision from '../../Game/collision';

function GameLoader(props: any): JSX.Element {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    console.log('Loading resources...');

    const loader = new PIXI.Loader();
    loader.add('antDefault', 'gfx/ant.png');
    loader.add('level1Background', 'gfx/level1.png');
    loader.add('white_2x2', 'gfx/white_2x2.png');

    loader.load((_, resources: any) => {
      const levelData = getImageData('gfx/level1.png');
      const total = levelData.w * levelData.h;

      collision.level = new Uint8Array(total);
      console.log(levelData.pixels.length);
      console.log(levelData.w);
      console.log(levelData.h);
      for (let idx = 0; idx < total * 4; idx += 4) {
        let a = levelData.pixels[idx + 3];
        collision.level[idx / 4] = a;
      }

      sprites.white_2x2 = new PIXI.Sprite(resources.white_2x2.texture);
      sprites.antDefault = new PIXI.Sprite(resources.antDefault.texture);
      sprites.level1Background = new PIXI.Sprite(resources.level1Background.texture);
      sprites.level1Background.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

      // const buf = new Uint8Array(800 * 600 * 4);
      // for (let idx = 0; idx < buf.length; idx += 4) {
      //   buf[idx + 1] = collision.level[idx / 4] / 2;
      //   buf[idx + 3] = 255;
      // }
      // var tex = PIXI.Texture.fromBuffer(buf, 800, 600);
      // sprites.level1Background = new PIXI.Sprite(tex);

      console.log('Loading complete.');

      setLoadingComplete(true);
    });
  }, []);

  function getImageData(url: string): { pixels: Uint8Array; w: number; h: number } {
    var img = new Image();
    img.src = url;
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var context: any = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    var data = context.getImageData(0, 0, img.width, img.height).data;
    return { pixels: data, w: img.width, h: img.height };
  }

  const loading = <div>Loading...</div>;
  const main = <>{props.children}</>;

  return loadingComplete ? main : loading;
}

export default GameLoader;
