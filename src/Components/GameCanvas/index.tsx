import { useEffect } from 'react';
import game from '../../Game/game';

function GameCanvas(): JSX.Element {
  useEffect(() => {
    game.run(tick);

    return () => {
      game.stop();
    };
  }, []);

  function tick(delta: number) {
    game.updateAnts(delta);
  }

  return (
    <>
      <div id='gameCanvas' style={{ width: '40%', aspectRatio: '1/1' }} />
    </>
  );
}

export default GameCanvas;
