import { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import * as Sprites from './../../Game/sprites';

function GameLoader(props: any): JSX.Element {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    console.log('Starting loader...');

    const loader = new PIXI.Loader();
    loader.add('antDefault', 'gfx/ant.png');
    loader.add('level1Background', 'gfx/map-test-2.png');
    loader.load((_, resources: any) => {
      Sprites.default.antDefault = new PIXI.Sprite(resources.antDefault.texture);
      Sprites.default.level1Background = new PIXI.Sprite(resources.level1Background.texture);

      console.log('Loading complete.');

      setLoadingComplete(true);
    });
  }, []);

  const loading = <div>Loading...</div>;
  const main = <>{props.children}</>;

  return loadingComplete ? main : loading;
}

export default GameLoader;
