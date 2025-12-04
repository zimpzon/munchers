import { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';
import sprites from './../../Game/sprites';
import collision from '../../Game/collision';
import level from '../../Game/level';
import * as generators from './../../Game/generators';

// Import assets
import antDefaultImg from '../../assets/gfx/ant.png';
import level2Img from '../../assets/gfx/level2.png';
import foodImg from '../../assets/gfx/food.png';
import white2x2Img from '../../assets/gfx/white_2x2.png';
import whiteCircleImg from '../../assets/gfx/white_circle.png';
import homeIconImg from '../../assets/gfx/home.png';

function GameLoader(props: any): JSX.Element {
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    console.log('Loading resources...');
    console.log('Asset paths:', {
      antDefault: antDefaultImg,
      level1Background: level2Img,
      foodLayer: foodImg,
      white_2x2: white2x2Img,
      whiteCircle: whiteCircleImg,
      homeIcon: homeIconImg
    });

    // Force include these assets in the bundle by referencing them
    const requiredAssets = [white2x2Img, whiteCircleImg, homeIconImg];
    console.log('Required assets loaded:', requiredAssets.length);

    const levelPath = level2Img;
    const foodLayerPath = foodImg;
    const loader = new PIXI.Loader();

    // Add error handling for the loader
    loader.onError.add((error: any) => {
      console.error('PIXI Loader error:', error);
    });

    loader.add('antDefault', antDefaultImg);
    loader.add('level1Background', levelPath);
    loader.add('foodLayer', foodLayerPath);
    loader.add('white_2x2', white2x2Img);
    loader.add('whiteCircle', whiteCircleImg);
    loader.add('homeIcon', homeIconImg);

    loader.load(async (loaderInstance, resources: any) => {
      try {
        console.log('PIXI loader completed, processing assets...');
        console.log('Available resources:', Object.keys(resources));
        console.log('Level path:', levelPath);

        // Check if all required resources loaded successfully
        const requiredResources = ['antDefault', 'level1Background', 'foodLayer', 'white_2x2', 'whiteCircle', 'homeIcon'];
        for (const resourceName of requiredResources) {
          if (!resources[resourceName] || resources[resourceName].error) {
            throw new Error(`Failed to load required resource: ${resourceName}`);
          }
        }

        const imgData1 = await getImageData(levelPath);
        console.log('Image data loaded:', imgData1.w, 'x', imgData1.h);

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

        console.log('All assets loaded successfully!');
        setLoadingComplete(true);
      } catch (error) {
        console.error('Error loading assets:', error);
        console.error('This might be due to incorrect asset paths on itch.io or other hosting platforms');
      }
    });
  }, []);

  function getImageData(url: string): Promise<{ pixels: Uint8Array; w: number; h: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          context.drawImage(img, 0, 0);
          const imageData = context.getImageData(0, 0, img.width, img.height).data;
          const pixels = new Uint8Array(imageData);
          resolve({ pixels: pixels, w: img.width, h: img.height });
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

  const loading = <div>Loading...</div>;
  const main = <>{props.children}</>;

  return loadingComplete ? main : loading;
}

export default GameLoader;
