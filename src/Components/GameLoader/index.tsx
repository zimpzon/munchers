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
    loader.add('level1Background', 'gfx/map-test-2.png');

    loader.load((_, resources: any) => {
      const levelData = getImageData('gfx/map-test-2.png');
      const total = levelData.w * levelData.h;
      collision.level = new Uint8Array(total);
      for (let idx = 0; idx < total; idx += 4) {
        let a = levelData.pixels[idx + 3];
        collision.level[idx / 4] = a;
      }
      console.log(collision.level);

      sprites.antDefault = new PIXI.Sprite(resources.antDefault.texture);
      sprites.level1Background = new PIXI.Sprite(resources.level1Background.texture);
      console.log('Loading complete.');

      // setLoadingComplete(true);
    });
  }, []);

  function getImageData(url: string): { pixels: Uint8Array; w: number; h: number } {
    var img = new Image();
    img.src = url;
    var canvas = document.createElement('canvas');
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
