import { useEffect } from 'react';
import collision from '../../Game/collision';
import game from '../../Game/game';
import globals from '../../Game/globals';

function GameCanvas(): JSX.Element {
  useEffect(() => {
    game.resetGame();
    game.run(tick);

    return () => {
      game.stop();
    };
  }, []);

  let prev: number = 0;

  let cnt = 0.0;

  function tick() {
    const now = Date.now();
    let d = prev === 0 ? 1 : now - prev;
    d = Math.min(d, 50) * 2;
    prev = now;
    if (globals.turbo) d *= 2;

    cnt += d;
    while (cnt >= globals.simStepMs) {
      cnt -= globals.simStepMs;
      globals.gameTimeMs += globals.simStepMs;
      globals.updateCounter++;

      game.tickGame();
    }

    collision.homeMarkers.updateDebug();
    collision.foodMarkers.updateDebug();
  }

  return <div id='gameCanvas'/>;
}

export default GameCanvas;
